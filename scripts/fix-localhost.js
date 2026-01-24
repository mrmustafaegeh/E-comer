const fs = require("fs");
const path = require("path");

const filesToUpdate = [
  {
    file: "src/hooks/useHeroProducts.js",
    replacements: [
      {
        from: ": 'http://localhost:3000/api/hero-products'; // Local development",
        to: ": '/api/hero-products';",
      },
      {
        from: ": 'http://localhost:3000/api/hero-products'",
        to: ": '/api/hero-products'",
      },
    ],
  },
  {
    file: "src/lib/api-config.js",
    replacements: [
      {
        from: ": 'http://localhost:3000/api')",
        to: ": 'http://localhost:3000/api')",
      },
      {
        from: ": 'http://localhost:3000')",
        to: ": 'http://localhost:3000')",
      },
    ],
  },
  {
    file: "src/services/productService.js",
    replacements: [
      {
        from: ": 'http://localhost:3000/api')",
        to: ": 'http://localhost:3000/api')",
      },
    ],
  },
  {
    file: "src/services/api.js",
    replacements: [
      {
        from: ": 'http://localhost:3000/api')",
        to: ": 'http://localhost:3000/api')",
      },
      {
        from: ": 'http://localhost:3000')",
        to: ": 'http://localhost:3000')",
      },
    ],
  },
];

filesToUpdate.forEach(({ file, replacements }) => {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let updated = false;

  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(
        new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        to
      );
      updated = true;
      console.log(`✅ Updated: ${file} (${from} → ${to})`);
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, content, "utf8");
  }
});

console.log("\n🎉 All files updated!");
