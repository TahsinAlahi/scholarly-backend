import { Router } from "express";
import sessionController from "../controllers/session.controller";

const router = Router();

router.get("/mine", sessionController.mySessions);
router.patch("/:id/resubmit", sessionController.resubmitSession);
router.patch("/:id/status", sessionController.updateSessionStatus);
router.get("/:id", sessionController.getSessionDetails);
router.get("/pending", sessionController.getPendingSessions);
router
  .route("/")
  .post(sessionController.createSession)
  .get(sessionController.getSessions);

export default router;
