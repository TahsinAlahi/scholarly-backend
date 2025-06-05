import { RequestHandler } from "express";
import { reviewSchema } from "../validations";
import { reviewsModel } from "../models";
import createHttpError from "http-errors";
import { validateObjectIdOrThrow, zodErrorFormat } from "../utils";

const postReview: RequestHandler = async (req, res, next) => {
  try {
    const parse = reviewSchema.safeParse(req.body);
    if (!parse.success) {
      return next(createHttpError(400, zodErrorFormat(parse.error)));
    }

    const review = await reviewsModel.create(parse.data);

    res.status(201).json({
      message: "Review created successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getSessionReviews: RequestHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    validateObjectIdOrThrow(sessionId, "Session");

    const review = await reviewsModel
      .find({ session: sessionId })
      .populate({
        path: "student",
        select: "name email image",
      })
      .select("-__v");
    if (review.length === 0) {
      throw createHttpError(404, {
        message: `No reviews found for session ${sessionId}`,
        errors: "No reviews found",
      });
    }

    res.status(200).json({
      message: "Reviews fetched successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export default { postReview, getSessionReviews };
