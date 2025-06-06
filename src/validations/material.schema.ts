import mongoose from "mongoose";
import { z } from "zod/v4";
import { requiredError } from "../utils";
import { ContentType } from "../models";

const baseFields = z.object({
  session: z
    .string({
      error: requiredError("Session", "string"),
    })
    .refine(
      (value) => {
        return mongoose.Types.ObjectId.isValid(value);
      },
      {
        error: "Invalid session id",
      }
    ),
  title: z
    .string({
      error: requiredError("Title", "string"),
    })
    .min(5, { error: "Title must be at least 5 characters long" })
    .max(50, { error: "Title must be less than 50 characters" }),
  // contentType: z.enum(Object.values(ContentType) as [string, ...string[]], {
  //   error: () =>
  //     `Content type must be one of: ${Object.values(ContentType).join(", ")}`,
  // }),
  // fileUrl: z.string().optional().nullable(),
  // noteContent: z.string().optional().nullable(),
});

const noteSchema = z.object({
  ...baseFields.shape,
  contentType: z.literal(ContentType.NOTE),
  noteContent: z
    .string({ error: requiredError("Note content", "string") })
    .min(1, { error: "Note content must be at least 1 character long" }),
});

const linkSchema = z.object({
  ...baseFields.shape,
  contentType: z.literal(ContentType.LINK),
  fileUrl: z
    .string({ error: requiredError("File URL", "string") })
    .min(1, { error: "File URL must be at least 1 character long" }),
});

export const materialsSchema = z.discriminatedUnion("contentType", [
  noteSchema,
  linkSchema,
]);
