import { RequestHandler } from "express";
import { courseSchema } from "../validations/course.schema";
import createHttpError from "http-errors";
import { validateObjectIdOrThrow, zodErrorFormat } from "../utils";
import { coursesModel } from "../models";
import { Status } from "../models";

const createCourse: RequestHandler = async (req, res, next) => {
  try {
    const parse = courseSchema.safeParse(req.body);
    if (!parse.success) {
      console.log("nothing");
      throw createHttpError(400, zodErrorFormat(parse.error));
    }

    const course = await coursesModel.create(parse.data);

    res.status(201).json({
      message: "Course created successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const getCourses: RequestHandler = async (req, res, next) => {
  try {
    const courses = await coursesModel
      .find({ status: Status.ACCEPTED })
      .populate({
        path: "tutor",
        select: "name email _id image",
      })
      .select("-__v");

    res.status(200).json({
      message: "Courses fetched successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCourses: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const myCourses = await coursesModel.find({ tutor: id }).select("-__v");

    res.status(200).json({
      message: "Courses fetched successfully",
      success: true,
      data: myCourses,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseDetails: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Course");

    const course = await coursesModel.findById(id);
    if (!course) {
      throw createHttpError(404, {
        message: "Course not found",
        errors: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course details fetched successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Course");

    const course = await coursesModel.findByIdAndDelete(id);
    if (!course) {
      throw createHttpError(404, {
        message: "Course not found",
        errors: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingCourses: RequestHandler = async (_req, res, next) => {
  try {
    const courses = await coursesModel
      .find({ status: Status.PENDING })
      .populate({
        path: "tutor",
        select: "name email _id",
      })
      .select("-__v");

    res.status(200).json({
      message: "Courses fetched successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourseStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Course");

    const course = await coursesModel.findById(id);
    if (!course) {
      throw createHttpError(404, {
        message: "Course not found",
        errors: "Course not found",
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
    course.status = status;
    course.rejectionReason = rejectionReason;
    await course.save();

    res.status(200).json({
      message: "Course status updated successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createCourse,
  getMyCourses,
  getCourses,
  getCourseDetails,
  deleteCourse,
  getPendingCourses,
  updateCourseStatus,
};
