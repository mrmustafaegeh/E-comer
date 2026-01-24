import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

console.log("🔧 Fixing remaining localhost URLs...\n");

const files = [
  {
    path: "src/hooks/useHeroProducts.js",
    fixes: [
      {
        from: ': "http://localhost:3000/api/hero-products"; // Local development',
        to: ': "/api/hero-products"; // Use relative path',
      },
      {
        from: ': "http://localhost:3000/api/hero-products"',
        to: ': "/api/hero-products"',
      },
    ],
  },
  {
    path: "src/lib/api-config.js",
    fixes: [
      {
        from: ': "http://localhost:3000/api")',
        to: ': "http://localhost:3000/api")',
      }, // Already correct
      { from: ': "http://localhost:3000")', to: ': "http://localhost:3000")' }, // Already correct
    ],
  },
  {
    path: "src/services/productService.js",
    fixes: [
      {
        from: ': "http://localhost:3000/api")',
        to: ': "http://localhost:3000/api")',
      }, // Already correct
    ],
  },
  {
    path: "src/services/api.js",
    fixes: [
      {
        from: ': "http://localhost:3000/api")',
        to: ': "http://localhost:3000/api")',
      }, // Already correct
      { from: ': "http://localhost:3000")', to: ': "http://localhost:3000")' }, // Already correct
    ],
  },
];

let totalFixed = 0;

for (const file of files) {
  const fullPath = join(process.cwd(), file.path);

  if (!existsSync(fullPath)) {
    console.log(`❌ File not found: ${file.path}`);
    continue;
  }

  let content = readFileSync(fullPath, "utf8");
  let fileFixed = false;

  for (const fix of file.fixes) {
    if (content.includes(fix.from)) {
      content = content.replace(
        new RegExp(fix.from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        fix.to
      );
      fileFixed = true;
      console.log(`✅ Updated: ${file.path}`);
      console.log(`   ${fix.from}`);
      console.log(`   ↓`);
      console.log(`   ${fix.to}\n`);
    }
  }

  if (fileFixed) {
    writeFileSync(fullPath, content, "utf8");
    totalFixed++;
  } else {
    console.log(`ℹ️  No changes needed: ${file.path}\n`);
  }
}

console.log(`🎉 Fixed ${totalFixed} file(s)!`);
