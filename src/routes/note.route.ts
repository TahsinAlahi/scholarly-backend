import { Router } from "express";
import noteController from "../controllers/note.controller";
const router = Router();

// TODO: remove the id from the params and get the id from jwt
router
  .route("/:id")
  .post(noteController.createNote)
  .get(noteController.getNotes)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

export default router;
