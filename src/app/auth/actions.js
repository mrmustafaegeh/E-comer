"use server";

import {
  LoginSchema,
  RegisterSchema,
  formatZodErrors,
} from "../../lib/validation";

import { createSession, deleteSession } from "../../lib/session";
import { findUserByEmail, createUser, comparePassword } from "../../lib/auth-core";
import { validateRequest } from "../../lib/security";
import "server-only";

/**
 * Internal wrapper for origin validation.
 */
async function validateOrigin() {
  const isValid = await validateRequest();
  if (!isValid) throw new Error("Invalid origin");
  return true;
}

export async function registerAction(prevState, formData) {
  try {
    await validateOrigin();
    
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
      message: error.message === "Invalid origin" ? "Security check failed" : "An error occurred during registration",
    };
  }
}

export async function loginAction(prevState, formData) {
  try {
    await validateOrigin();

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

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const passwordMatch = await comparePassword(
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
      message: error.message === "Invalid origin" ? "Security check failed" : "An error occurred during login",
    };
  }
}

export async function logoutAction() {
  try {
    await deleteSession();
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("💥 Logout error:", error);
    return { success: false, message: "Failed to log out" };
  }
}
