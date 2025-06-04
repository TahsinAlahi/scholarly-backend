import { Router } from "express";
import sessionController from "../controllers/session.controller";

const router = Router();

router.get("/mine", sessionController.mySessions);
router.patch("/:id/resubmit", sessionController.resubmitSession);
router.route("/").post(sessionController.createSession);
export default router;
