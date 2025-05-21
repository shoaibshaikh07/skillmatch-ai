import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, { message: "Invalid Name" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .strict();

export type SignInSchema = z.infer<typeof signInSchema>;
