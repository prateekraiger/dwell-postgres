import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.post(
  "/create-checkout-session",
  authenticate,
  paymentController.createCheckoutSession
);

export default router;
