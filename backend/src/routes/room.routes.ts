import { Router } from "express";
import * as roomController from "../controllers/room.controller";
import { authenticate, authorize } from "../middleware/auth";

const router: Router = Router();

// Public routes
router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoom);

// Protected routes
router.get(
  "/my/rooms",
  authenticate,
  authorize("OWNER", "ADMIN"),
  roomController.getMyRooms
);

router.post(
  "/",
  authenticate,
  authorize("OWNER", "ADMIN"),
  roomController.createRoom
);

router.patch(
  "/:id",
  authenticate,
  authorize("OWNER", "ADMIN"),
  roomController.updateRoom
);

router.delete(
  "/:id",
  authenticate,
  authorize("OWNER", "ADMIN"),
  roomController.deleteRoom
);

export default router;
