import { Router } from "express";
import courseController from "../controllers/course.controller";

const router = Router();

router
  .route("/")
  .post(courseController.createCourse)
  .get(courseController.getCourses);
// TODO: remove the param
router.get("/mine/:id", courseController.getMyCourses);

export default router;
