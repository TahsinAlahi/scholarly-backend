import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { usersModel } from "../models";
import { loginSchema, registerSchema } from "../validations";
import { zodErrorFormat } from "../utils";

const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return next(createHttpError(400, zodErrorFormat(parse.error)));
    }

    const { name, email, password, role, image } = req.body;

    // TODO: Find efficient way to check if user already exists
    // and not to call user twice
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, "User already exists");
    }

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

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      throw createHttpError(400, zodErrorFormat(parse.error));
    }

    const { email, password } = parse.data;

    const user = await usersModel.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createHttpError(401, "Invalid credentials");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

export default { registerUser, loginUser };
