import "server-only";

import bcrypt from "bcryptjs";
import clientPromise from "./mongodb";
import { validateEnv } from "./env-validator";

// ------------------------
// Helpers
// ------------------------

async function getUsersCollection() {
  const env = validateEnv(); // Ensure env is valid before connecting
  const client = await clientPromise;
  const db = client.db(env.MONGODB_DB);
  return db.collection("users");
}

export async function findUserByEmail(email) {
  const users = await getUsersCollection();
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalizedEmail) return null;
  return users.findOne({ email: normalizedEmail });
}

export async function createUser(name, email, password) {
  const users = await getUsersCollection();

  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const safeName = String(name || "").trim();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name: safeName,
    email: normalizedEmail,
    password: hashedPassword,
    roles: ["user"],
    createdAt: new Date(),
  };

  const result = await users.insertOne(newUser);

  return {
    ...newUser,
    id: result.insertedId.toString(),
    _id: result.insertedId.toString(),
  };
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
