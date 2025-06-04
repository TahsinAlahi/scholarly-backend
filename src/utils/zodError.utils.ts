import { z } from "zod/v4";

export const zodErrorFormat = (error: z.ZodError) => {
  const errorMessage = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    message: errorMessage,
    errors: "Validation error",
  };
};

export const requiredError = (fieldName: string, expectedType: string) => {
  return (issue: z.core.$ZodRawIssue) =>
    issue.input === undefined
      ? `${fieldName} is required`
      : `${fieldName} must be a ${expectedType}`;
};
