import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const filePath = join(process.cwd(), "src/hooks/useHeroProducts.js");

console.log("🔧 Fixing useHeroProducts.js...\n");

if (!existsSync(filePath)) {
  console.log("❌ File not found");
  process.exit(1);
}

let content = readFileSync(filePath, "utf8");

// Replace localhost URLs with relative paths
content = content.replace(
  /: "http:\/\/localhost:3000\/api\/hero-products"; \/\/ Local development/g,
  ': "/api/hero-products"; // Use relative path'
);

content = content.replace(
  /: "http:\/\/localhost:3000\/api\/hero-products"/g,
  ': "/api/hero-products"'
);

writeFileSync(filePath, content, "utf8");

console.log("✅ Fixed useHeroProducts.js");
console.log("\nUpdated content:");
console.log(
  content
    .split("\n")
    .filter((line) => line.includes("hero-products"))
    .join("\n")
);
