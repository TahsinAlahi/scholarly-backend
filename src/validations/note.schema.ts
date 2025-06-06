import { z } from "zod/v4";
import { requiredError } from "../utils";

export const noteSchema = z.object({
  title: z
    .string({ error: requiredError("Title", "string") })
    .min(5, { error: "Title must be at least 5 characters long" })
    .max(100, { error: "Title must be less than 100 characters" }),
  content: z
    .string({ error: requiredError("Content", "string") })
    .min(1, { error: "Content must be at least 1 character long" }),
});
