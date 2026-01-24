import { z } from "zod";

// Simplified password validation for testing
export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .trim(),
    // email: emailField,
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function formatZodErrors(error) {
  const formatted = {};
  error.errors.forEach((err) => {
    const field = err.path[0];
    if (!formatted[field]) {
      formatted[field] = err.message;
    }
  });
  return formatted;
}
