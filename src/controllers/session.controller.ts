import sessionsModel from "../models/sessions.model";
import usersModel from "../models/users.model";
import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { sessionSchema } from "../validations/session.schema";
import { zodErrorFormat } from "../utils/zodError.utils";
import { Status } from "../models/sessions.model";
import { validateObjectIdOrThrow } from "../utils/validate.utils";

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
    validateObjectIdOrThrow(id, "Session");

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

const getPendingSessions: RequestHandler = async (req, res, next) => {
  try {
    const pendingSessions = await sessionsModel.find({
      status: Status.PENDING,
    });

    res.status(200).json({
      message: "Pending sessions fetched successfully",
      success: true,
      data: pendingSessions,
    });
  } catch (error) {
    next(error);
  }
};

const updateSessionStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Session");

    const session = await sessionsModel.findById(id);
    if (!session) {
      throw createHttpError(404, {
        message: "Session not found",
        errors: "Session not found",
      });
    }

    const { status, rejectionReason } = req.body;
    if (!status) {
      throw createHttpError(400, {
        message: "Status is required",
        errors: "Status is required",
      });
    }
    if (!Object.values(Status).includes(status)) {
      throw createHttpError(400, {
        message: "Status must be one of: pending, accepted, or rejected",
        errors: "Unknown status",
      });
    }

    session.status = status;
    session.rejectionReason = rejectionReason;
    await session.save();

    res.status(200).json({
      message: "Session status updated successfully",
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const getSessions: RequestHandler = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (status && Object.values(Status).includes(status as Status)) {
      const sessions = await sessionsModel.find({
        status,
      });

      res.status(200).json({
        message: `${status} sessions fetched successfully`,
        success: true,
        data: sessions,
      });
    }

    const approvedSessions = await sessionsModel.find({
      status: Status.ACCEPTED,
    });

    res.status(200).json({
      message: "Approved sessions fetched successfully",
      success: true,
      data: approvedSessions,
    });
  } catch (error) {
    next(error);
  }
};

const getSessionDetails: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectIdOrThrow(id, "Session");

    const session = await sessionsModel.findById(id);
    if (!session) {
      throw createHttpError(404, {
        message: "Session not found",
        errors: "Session not found",
      });
    }

    res.status(200).json({
      message: "Session details fetched successfully",
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createSession,
  mySessions,
  resubmitSession,
  getPendingSessions,
  updateSessionStatus,
  getSessions,
  getSessionDetails,
};
