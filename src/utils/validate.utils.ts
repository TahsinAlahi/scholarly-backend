import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const validateObjectIdOrThrow = (id: string, name = "ID") => {
  if (!isValidObjectId(id)) {
    throw createHttpError(400, {
      message: `Invalid ${name.toLowerCase()}${name !== "ID" ? " id" : ""}`,
      errors: `Invalid ${name.toLowerCase()}${name !== "ID" ? " id" : ""}`,
    });
  }
};
