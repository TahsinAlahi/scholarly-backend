import sessionsModel from "../models/sessions.model";
import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { sessionSchema } from "../validations/session.schema";
import { zodErrorFormat } from "../utils/zodError.utils";

const createSession: RequestHandler = async (req, res, next) => {
  try {
    const parse = sessionSchema.safeParse(req.body);
    if (!parse.success) {
      throw createHttpError(400, zodErrorFormat(parse.error));
    }

    const session = await sessionsModel.create(parse.data);

    res.status(201).json({
      message: "Session created successfully",
      success: true,
      data: session,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export default { createSession };
