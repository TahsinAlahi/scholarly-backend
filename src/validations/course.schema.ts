import { z } from "zod/v4";
import { requiredError } from "../utils/zodError.utils";
import mongoose from "mongoose";
import { Status } from "../models";

export const courseSchema = z
  .object({
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

    image: z.string({ error: requiredError("Image", "string") }),

    status: z
      .enum(Object.values(Status) as [string, ...string[]], {
        error: () =>
          `Status must be one of: ${Object.values(Status).join(", ")}`,
      })
      .default(Status.PENDING),

    isPaid: z.boolean().default(false),

    registrationFee: z
      .number({
        error: requiredError("registrationFee", "number"),
      })
      .nonnegative({ error: "registrationFee cannot be negative" }),

    rejectionReason: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      (data.isPaid && data.registrationFee > 0) ||
      (!data.isPaid && data.registrationFee === 0),
    {
      message:
        "If isPaid is true, registrationFee must be greater than 0. If isPaid is false, registrationFee must be 0.",
      path: ["registrationFee"],
    }
  );
