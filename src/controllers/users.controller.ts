import usersModel from "../models/users.model";
import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { UserRole } from "../models/users.model";
import { isValidObjectId } from "mongoose";

const getAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await usersModel.find().select("-password -__v");

    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const findUserByQuery: RequestHandler = async (req, res, next) => {
  try {
    const { query } = req.query;

    const users = await usersModel
      .find()
      .or([
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ])
      .select("-password -__v");

    if (users.length === 0) {
      throw createHttpError(404, {
        message: `No users found by the name/email ${query}`,
        errors: "No users found",
      });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
    return;
  } catch (error) {
    next(error);
  }
};

const updateUserRole: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!isValidObjectId(id)) {
      throw createHttpError(400, {
        message: "Invalid user id",
        errors: "Invalid user id",
      });
    }

    if (!role) {
      throw createHttpError(400, {
        message: "Role is required",
        errors: "Role is required",
      });
    }
    if (!Object.values(UserRole).includes(role)) {
      throw createHttpError(400, {
        message: "Role must be one of: student, tutor, or admin",
        errors: "Unknown role",
      });
    }

    const user = await usersModel.findById(id).select("-password -__v");
    if (!user) {
      throw createHttpError(404, {
        message: `User not found by the id ${id}`,
        errors: "User not found",
      });
    }

    if (user.role === role) {
      throw createHttpError(400, {
        message: `User already has the ${role} role`,
        errors: "User already has the same role",
      });
    }
    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllUsers, findUserByQuery, updateUserRole };
