import fs from "fs";
import path from "path";

const appDir = path.join(process.cwd(), "src/app");

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  let issues = [];

  lines.forEach((line, index) => {
    // Check for problematic patterns
    if (line.includes("export const")) {
      const configExports = [
        "runtime",
        "dynamic",
        "revalidate",
        "fetchCache",
        "maxDuration",
        "regions",
      ];
      configExports.forEach((exportName) => {
        if (line.includes(exportName)) {
          issues.push(`Line ${index + 1}: ${line.trim()}`);
        }
      });
    }

    // Check for multiple default exports
    if (line.includes("export default")) {
      // Look for other default exports
      const otherDefaults = lines.filter(
        (l) => l.includes("export default") && l !== line
      );
      if (otherDefaults.length > 0) {
        issues.push(`Multiple default exports found`);
      }
    }
  });

  if (issues.length > 0) {
    console.log(`\n🔴 ${filePath}:`);
    issues.forEach((issue) => console.log(`   ${issue}`));
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      checkFile(fullPath);
    }
  });
}

if (fs.existsSync(appDir)) {
  console.log("🔍 Scanning for invalid exports...");
  scanDirectory(appDir);
} else {
  console.log("No src/app directory found");
}
