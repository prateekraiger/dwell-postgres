import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.patch("/role", authenticate, userController.updateRole);

router.patch("/profile", authenticate, userController.updateProfile);

export default router;
