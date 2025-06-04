import { z } from "zod/v4";
import { requiredError } from "../utils/zodError.utils";
import mongoose from "mongoose";

export const bookingSchema = z.object({
  session: z
    .string({ error: requiredError("Session", "string") })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid session ID",
    }),
  student: z
    .string({ error: requiredError("Student", "string") })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid student ID",
    }),
  paymentStatus: z
    .enum(["free", "paid"], {
      error: () => `Payment status must be one of: free, paid`,
    })
    .default("free"),
  bookedAt: z.iso.datetime().default(new Date().toISOString),
});
