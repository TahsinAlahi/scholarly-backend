import { Router } from "express";
import materialController from "../controllers/material.controller";
const router = Router();

router
  .route("/:id")
  .patch(materialController.updateMaterial)
  .delete(materialController.deleteMaterial);
router.get("/session/:sessionId", materialController.getSessionMaterials);
router.post("/", materialController.postMaterial);

export default router;
