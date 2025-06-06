import { RequestHandler } from "express";
import { noteSchema } from "../validations";
import createHttpError from "http-errors";
import { validateObjectIdOrThrow, zodErrorFormat } from "../utils";
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

const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Note");
    // TODO: get the student id from jwt and match it with the student id in the note
    // If they don't match, throw an error

    // TODO: add optional title and content if needed
    const parse = noteSchema.safeParse(req.body);
    if (!parse.success) {
      throw createHttpError(400, zodErrorFormat(parse.error));
    }

    const note = await notesModel.findById(id);
    if (!note) {
      throw createHttpError(404, {
        message: "Note not found",
        errors: "Note not found",
      });
    }

    if (note.title !== parse.data.title) {
      note.title = parse.data.title;
    }
    if (note.content !== parse.data.content) {
      note.content = parse.data.content;
    }
    note.save();

    res.status(200).json({
      message: "Note updated successfully",
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Note");
    // TODO: get the student id from jwt and match it with the student id in the note
    // If they don't match, throw an error

    const note = await notesModel.findByIdAndDelete(id);
    if (!note) {
      throw createHttpError(404, {
        message: "Note not found",
        errors: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export default { createNote, getNotes, updateNote, deleteNote };
