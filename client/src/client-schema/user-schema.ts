import * as z from "zod";
import { ROLES } from "@/lib/constants/roles";

// Password validation schema with comprehensive requirements
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

// Schema for creating a new user
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: passwordSchema,
  role: z.enum([ROLES.ADMIN, ROLES.TEAM, ROLES.CLIENT], {
    message: "Please select a role",
  }),
});

// Schema for editing an existing user (no password required)
export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.enum([ROLES.ADMIN, ROLES.TEAM, ROLES.CLIENT], {
    message: "Please select a role",
  }),
});

// Type definitions
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type EditUserForm = z.infer<typeof editUserSchema>;