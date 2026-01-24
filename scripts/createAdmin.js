// scripts/createAdmin.js
const bcrypt = require("bcryptjs");

async function createAdminHash() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);
  console.log("\nUse this in MongoDB:");
  console.log(`
db.users.insertOne({
  email: "admin@example.com",
  password: "${hash}",
  name: "Admin User",
  roles: ["admin", "user"],
  createdAt: new Date()
})
  `);
}

createAdminHash();
