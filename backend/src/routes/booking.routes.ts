import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticate, authorize } from "../middleware/auth";

const router: Router = Router();

// All booking routes require authentication
router.use(authenticate);

router.get("/my-bookings", bookingController.getMyBookings);

router.get(
  "/owner-bookings",
  authorize("OWNER", "ADMIN"),
  bookingController.getOwnerBookings
);

router.get("/:id", bookingController.getBooking);

router.get("/room/:roomId/availability", bookingController.getRoomBookings);

router.post("/", bookingController.createBooking);

router.patch("/:id", bookingController.updateBooking);

router.delete("/:id", bookingController.cancelBooking);

export default router;
