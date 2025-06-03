import { z } from "zod/v4";

const requiredError = (fieldName: string, expectedType: string) => {
  return (issue: z.core.$ZodRawIssue) =>
    issue.input === undefined
      ? `${fieldName} is required`
      : `${fieldName} must be a ${expectedType}`;
};

export const registerSchema = z.object({
  name: z
    .string({ error: requiredError("Name", "string") })
    .min(4, { message: "Name must be at least 4 characters long" }),

  email: z.email({ error: "Please enter a valid email address" }),

  password: z
    .string({ error: requiredError("Password", "string") })
    .min(8, { message: "Password must be at least 8 characters long" }),

  role: z.enum(["student", "tutor", "admin"], {
    error: () => "Role must be one of: student, tutor, or admin",
  }),

  image: z.string().optional().nullable(),
});
