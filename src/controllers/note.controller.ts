import { RequestHandler } from "express";
import { noteSchema } from "../validations";
import createHttpError from "http-errors";
import { zodErrorFormat } from "../utils";
import { notesModel } from "../models";

const createNote: RequestHandler = async (req, res, next) => {
  try {
    // TODO: get the id from jwt
    const { id } = req.params;
    const parse = noteSchema.safeParse(req.body);
    if (!parse.success) {
      return next(createHttpError(400, zodErrorFormat(parse.error)));
    }

    const note = await notesModel.create({ ...parse.data, student: id });

    res.status(201).json({
      message: "Note created successfully",
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const getNotes: RequestHandler = async (req, res, next) => {
  try {
    // TODO: get the id from jwt
    const { id } = req.params;

    const myNotes = await notesModel
      .find({ student: id })
      .select("-__v -student");

    res.status(200).json({
      message: "Notes fetched successfully",
      success: true,
      data: myNotes,
    });
  } catch (error) {
    next(error);
  }
};

export default { createNote, getNotes };
