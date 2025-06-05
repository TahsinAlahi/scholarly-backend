import { z } from "zod/v4";
import { requiredError } from "../utils";
import mongoose from "mongoose";

export const reviewSchema = z.object({
  session: z
    .string({ error: requiredError("Session Id", "string") })
    .refine((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  student: z
    .string({ error: requiredError("User id", "string") })
    .refine((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  rating: z
    .number({ error: requiredError("Rating", "string") })
    .min(1, { error: "Rating must be at least 1" })
    .max(5, { error: "Rating must be at most 5" }),
  comment: z
    .string({ error: requiredError("Comment", "string") })
    .min(5, { error: "Comment must be at least 5 characters long" }),
});
