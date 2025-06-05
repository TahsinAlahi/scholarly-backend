import { Router } from "express";
import reviewController from "../controllers/review.controller";
const router = Router();

router.post("/", reviewController.postReview);
router.get("/session/:sessionId", reviewController.getSessionReviews);

export default router;
