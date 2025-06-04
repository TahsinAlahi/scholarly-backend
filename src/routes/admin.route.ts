import { Router } from "express";
import usersController from "../controllers/users.controller";

const router = Router();

router.get("/", usersController.getAllUsers);
router.get("/search", usersController.findUserByQuery);
router.patch("/:id/role", usersController.updateUserRole);

export default router;
