import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import roomRoutes from "./room.routes";
import bookingRoutes from "./booking.routes";
import paymentRoutes from "./payment.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
