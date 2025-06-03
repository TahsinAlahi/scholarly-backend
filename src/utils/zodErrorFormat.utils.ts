import { z } from "zod/v4";

export const zodErrorFormat = (error: z.ZodError) => {
  const errorMessage = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    message: "Validation error",
    errors: errorMessage,
  };
};
