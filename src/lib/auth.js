"use server";

import {
  LoginSchema,
  RegisterSchema,
  formatZodErrors,
} from "../lib/validation";

import { createSession, deleteSession } from "../lib/session";
import bcrypt from "bcryptjs";
import clientPromise from "./mongodb";

// Use ONE database name everywhere (same locally + Vercel)
const DB_NAME = process.env.MONGODB_DB || "ecommerce";

// ------------------------
// Helpers
// ------------------------

async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
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

// ------------------------
// Register Action
// ------------------------

export async function registerAction(prevState, formData) {
  try {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const parsed = await RegisterSchema.safeParseAsync(data);
    if (!parsed.success) {
      return {
        success: false,
        errors: formatZodErrors(parsed.error),
        message: "Validation failed",
      };
    }

    const existingUser = await findUserByEmail(parsed.data.email);
    if (existingUser) {
      return {
        success: false,
        errors: { email: "Email already registered" },
        message: "Email already registered",
      };
    }

    const newUser = await createUser(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password
    );

    await createSession(newUser.id, newUser.email, newUser.roles || ["user"]);

    return {
      success: true,
      message: "Registration successful!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roles: newUser.roles || ["user"],
      },
      redirect: "/dashboard",
    };
  } catch (error) {
    console.error("💥 Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
}

// ------------------------
// Login Action
// ------------------------

export async function loginAction(prevState, formData) {
  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsed = await LoginSchema.safeParseAsync(data);
    if (!parsed.success) {
      return {
        success: false,
        errors: formatZodErrors(parsed.error),
        message: "Validation failed. Please check your input.",
      };
    }

    const user = await findUserByEmail(parsed.data.email);

    // Don’t reveal which one is wrong (security)
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    // ✅ MUST be true
    const passwordMatch = await bcrypt.compare(
      parsed.data.password,
      user.password
    );

    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    await createSession(
      user._id.toString(),
      user.email,
      user.roles || ["user"]
    );

    return {
      success: true,
      message: "Login successful!",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles || ["user"],
      },
      redirect: "/dashboard",
    };
  } catch (error) {
    console.error("💥 Login error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

// ------------------------
// Logout Action
// ------------------------

export async function logoutAction() {
  try {
    await deleteSession();
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("💥 Logout error:", error);
    return { success: false, message: "Failed to log out" };
  }
}
