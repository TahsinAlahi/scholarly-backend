import { Router } from "express";
import sessionController from "../controllers/session.controller";

const router = Router();

router.route("/").post(sessionController.createSession);

export default router;
