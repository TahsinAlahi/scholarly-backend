import { Router } from "express";
import courseController from "../controllers/course.controller";

const router = Router();

// TODO: remove the param
router.get("/mine/:id", courseController.getMyCourses);
router.get("/pending", courseController.getPendingCourses);
router.patch("/:id/status", courseController.updateCourseStatus);
router
  .route("/:id")
  .get(courseController.getCourseDetails)
  .delete(courseController.deleteCourse);
router
  .route("/")
  .post(courseController.createCourse)
  .get(courseController.getCourses);

export default router;
