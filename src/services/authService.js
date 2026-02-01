import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email) {
  const client = await clientPromise;
  const user = await client.db(process.env.MONGODB_DB).collection("users").findOne({ email: email.toLowerCase() });
  return user;
}

export async function getUserById(id) {
  if (!ObjectId.isValid(id)) return null;
  const client = await clientPromise;
  const user = await client.db(process.env.MONGODB_DB).collection("users").findOne({ _id: new ObjectId(id) });
  return user;
}

export async function updateProfile(userId, data) {
  const client = await clientPromise;
  const result = await client.db(process.env.MONGODB_DB).collection("users").findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result.value || result;
}

export async function registerUser({ name, email, password }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  
  const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("users").insertOne(user);
  return { ...user, id: result.insertedId.toString() };
}
