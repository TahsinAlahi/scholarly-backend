import { Router } from "express";
import bookingController from "../controllers/booking.controller";
const router = Router();

router.post("/free", bookingController.bookFreeSession);
// TODO: add paid route later on
router.get("/mine", bookingController.getMyBookings);
router.get("/:sessionId/classmates", bookingController.getClassmates);
export default router;
