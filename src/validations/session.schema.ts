import mongoose from "mongoose";
import { z } from "zod/v4";
import { Status } from "../models/sessions.model";
import { requiredError } from "../utils/zodError.utils";

export const sessionSchema = z.object({
  title: z
    .string({ error: requiredError("Title", "string") })
    .min(4, { error: "Title must be at least 4 characters long" })
    .max(100, { error: "Title must be no more than 100 characters long" }),

  description: z
    .string({ error: requiredError("Description", "string") })
    .min(4, { error: "Description must be at least 4 characters long" })
    .max(500, {
      error: "Description must be no more than 500 characters long",
    }),

  tutor: z
    .string({ error: requiredError("Tutor ID", "string") })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid tutor ID",
    }),

  status: z
    .enum(Object.values(Status) as [string, ...string[]], {
      error: () => `Status must be one of: ${Object.values(Status).join(", ")}`,
    })
    .default(Status.PENDING),

  price: z
    .number({
      error: requiredError("Price", "number"),
    })
    .positive({ error: "Price must be a positive number" }),

  date: z.iso.datetime({
    error: requiredError("Date and time", "date"),
  }),

  tags: z.array(z.string({ error: "Tags must be strings" }), {
    error: "Tags must be an array of strings",
  }),

  rejectionReason: z.string().optional().nullable(),
});
