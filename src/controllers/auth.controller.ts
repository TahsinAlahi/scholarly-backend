import usersModel from "../models/users.model";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { registerSchema } from "../validations/auth.schema";
import { zodErrorFormat } from "../utils/zodErrorFormat.utils";

const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const parse = registerSchema.safeParse(req.body);

    if (!parse.success) {
      return next(createHttpError(400, zodErrorFormat(parse.error)));
    }

    const { name, email, password, role, image } = req.body;

    const user = await usersModel.create({
      name,
      email,
      password,
      role,
      image,
    });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: user,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export default { registerUser };
