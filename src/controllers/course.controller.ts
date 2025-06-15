import { RequestHandler } from "express";
import { courseSchema } from "../validations/course.schema";
import createHttpError from "http-errors";
import { zodErrorFormat } from "../utils";
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

export default { createCourse, getMyCourses, getCourses };
