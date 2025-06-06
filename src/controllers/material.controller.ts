import { RequestHandler } from "express";
import { materialsSchema } from "../validations";
import createHttpError from "http-errors";
import { validateObjectIdOrThrow, zodErrorFormat } from "../utils";
import { materialsModel } from "../models";

const postMaterial: RequestHandler = async (req, res, next) => {
  try {
    // TODO: get the id from jwt
    const { uploader } = req.body;
    const parse = materialsSchema.safeParse(req.body);
    if (!parse.success) {
      throw createHttpError(400, zodErrorFormat(parse.error));
    }

    const material = await materialsModel.create({ ...parse.data, uploader });

    res.status(200).json({
      message: "Material uploaded successfully",
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

const getSessionMaterials: RequestHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    validateObjectIdOrThrow(sessionId, "Session");

    const sessionMaterials = await materialsModel.find({ session: sessionId });

    if (sessionMaterials.length === 0) {
      throw createHttpError(404, {
        message: `No materials found for session ${sessionId}`,
        errors: "No materials found",
      });
    }

    res.status(200).json({
      message: "Materials fetched successfully",
      success: true,
      data: sessionMaterials,
    });
  } catch (error) {
    next(error);
  }
};

const updateMaterial: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Material");

    const parse = materialsSchema.safeParse(req.body);
    if (!parse.success) {
      throw createHttpError(400, zodErrorFormat(parse.error));
    }

    const material = await materialsModel.findById(id);
    if (!material) {
      throw createHttpError(404, {
        message: "Material not found",
        errors: "Material not found",
      });
    }

    material.title = parse.data.title;
    if (parse.data.contentType === "link") {
      material.fileUrl = parse.data.fileUrl;
      material.contentType = parse.data.contentType;
      material.noteContent = undefined;
    } else {
      material.noteContent = parse.data.noteContent;
      material.contentType = parse.data.contentType;
      material.fileUrl = undefined;
    }
    await material.save();

    res.status(200).json({
      message: "Material updated successfully",
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMaterial: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectIdOrThrow(id, "Material");

    const material = await materialsModel.findByIdAndDelete(id);
    if (!material) {
      throw createHttpError(404, {
        message: "Material not found",
        errors: "Material not found",
      });
    }

    res.status(200).json({
      message: "Material deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  postMaterial,
  getSessionMaterials,
  updateMaterial,
  deleteMaterial,
};
