import { z } from "zod/v4";
import { requiredError } from "../utils/zodError.utils";

export const registerSchema = z.object({
  name: z
    .string({ error: requiredError("Name", "string") })
    .min(4, { error: "Name must be at least 4 characters long" }),

  email: z.email({ error: "Please enter a valid email address" }),

  password: z
    .string({ error: requiredError("Password", "string") })
    .min(8, { error: "Password must be at least 8 characters long" }),

  role: z
    .enum(["student", "tutor", "admin"], {
      error: () => "Role must be one of: student, tutor, or admin",
    })
    .optional(),

  image: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string({ error: requiredError("Password", "string") }).min(8, {
    error: "Password must be at least 8 characters long",
  }),
});
