import sessionsModel from "../models/sessions.model";
import usersModel from "../models/users.model";
import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { sessionSchema } from "../validations/session.schema";
import { zodErrorFormat } from "../utils/zodError.utils";
import { isValidObjectId } from "mongoose";
import { Status } from "../models/sessions.model";

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

const mySessions: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    // TODO: Compare the email with the one in the session with jwt

    if (!email) {
      throw createHttpError(400, {
        message: "Email is required",
        errors: "Email is required",
      });
    }

    const results = await usersModel.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
      {
        $lookup: {
          from: "sessions",
          localField: "_id",
          foreignField: "tutor",
          as: "sessions",
        },
      },
      {
        $project: {
          sessions: 1,
          _id: 0,
        },
      },
    ]);

    if (results.length === 0) {
      throw createHttpError(404, {
        message: "Email not found",
        errors: "Email not found",
      });
    }

    if (results[0].sessions.length === 0) {
      throw createHttpError(404, {
        message: "No sessions found",
        errors: "No sessions found",
      });
    }

    res.status(200).json({
      message: "Sessions fetched successfully",
      success: true,
      data: results[0],
    });
  } catch (error) {
    next(error);
  }
};

const resubmitSession: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Compare the email with the one in the session with jwt
    if (!isValidObjectId(id)) {
      throw createHttpError(400, {
        message: "Invalid session id",
        errors: "Invalid session id",
      });
    }

    const session = await sessionsModel.findById(id);
    if (!session) {
      throw createHttpError(404, {
        message: "Session not found",
        errors: "Session not found",
      });
    }

    session.status = Status.PENDING;
    await session.save();

    res.status(200).json({
      message: "Session resubmitted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export default { createSession, mySessions, resubmitSession };
