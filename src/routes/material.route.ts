import { Router } from "express";
import materialController from "../controllers/material.controller";
const router = Router();

router.get("/session/:sessionId", materialController.getSessionMaterials);
router.post("/", materialController.postMaterial);

export default router;
