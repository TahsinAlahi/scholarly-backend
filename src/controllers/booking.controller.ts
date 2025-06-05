import { RequestHandler } from "express";
import { bookingSchema } from "../validations/booking.schema";
import createHttpError from "http-errors";
import { zodErrorFormat } from "../utils/zodError.utils";
import usersModel from "../models/users.model";
import sessionsModel from "../models/sessions.model";
import bookingsModel from "../models/bookings.model";
import { validateObjectIdOrThrow } from "../utils/validate.utils";

const bookFreeSession: RequestHandler = async (req, res, next) => {
  try {
    const parse = bookingSchema.safeParse(req.body);
    if (!parse.success) {
      return next(createHttpError(400, zodErrorFormat(parse.error)));
    }

    const student = await usersModel.findById(parse.data.student);
    if (!student) {
      throw createHttpError(404, {
        message: "Student not found",
        errors: "Student not found",
      });
    }
    // TODO: check if the student email matches with jwt email

    const session = await sessionsModel.findById(parse.data.session);
    if (!session) {
      throw createHttpError(404, {
        message: "Session not found",
        errors: "Session not found",
      });
    }
    if (session.status !== "accepted") {
      throw createHttpError(400, {
        message: "Session is yet to be accepted, wait for approval",
        errors: "Session is not accepted",
      });
    }
    if (session.price !== 0) {
      throw createHttpError(400, {
        message: "Session is not free, wrong endpoint",
        errors: "Session is not free",
      });
    }

    const booking = await bookingsModel.create({
      ...parse.data,
      paymentStatus: "free",
    });

    res.status(201).json({
      message: "Booking created successfully",
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

const getMyBookings: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.body;
    // TODO: get the id and email from jwt

    const bookings = await bookingsModel
      .find({ student: id })
      .select("-__v -updatedAt")
      .populate({
        path: "session",
        select: "-__v -updatedAt -createdAt",
        populate: {
          path: "tutor",
          select: "name email image",
        },
      });

    res.status(200).json({
      message: "Bookings fetched successfully",
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

const getClassmates: RequestHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    // TODO: take the student id from jwt later on
    const { id } = req.body;
    validateObjectIdOrThrow(sessionId, "Session");

    const classmates = await bookingsModel
      .find()
      .and([{ session: sessionId }, { student: { $ne: id } }])
      .select("-__v -updatedAt -session -paymentStatus")
      .populate({
        path: "student",
        select: "name email image",
      });

    res.status(200).json({
      message: "Classmates fetched successfully",
      success: true,
      data: classmates,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  bookFreeSession,
  getMyBookings,
  getClassmates,
};
