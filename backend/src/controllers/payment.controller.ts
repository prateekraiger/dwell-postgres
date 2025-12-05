import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../lib";
import { config } from "../config/env";
import Stripe from "stripe";

const stripe = new Stripe(config.stripeSecretKey || "", {
  apiVersion: "2025-01-27.acacia" as any,
});

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user!.userId;

    if (!config.stripeSecretKey) {
      console.error("Stripe secret key is missing");
      return res.status(500).json({
        success: false,
        message: "Stripe configuration missing. Please set STRIPE_SECRET_KEY in backend .env",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Please provide bookingId",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const nights = Math.ceil(
      (new Date(booking.checkOut).getTime() -
        new Date(booking.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: booking.room.title,
              description: `Booking for ${nights} nights at ${booking.room.title}`,
              images: booking.room.photos.length > 0 ? [booking.room.photos[0]] : [],
            },
            unit_amount: Math.round(booking.room.pricePerNight * 100), // Stripe expects amount in cents/paise
          },
          quantity: nights,
        },
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Service Fee",
              description: "12% Service Fee",
            },
            unit_amount: Math.round(booking.room.pricePerNight * nights * 0.12 * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.frontendUrl}/my-bookings?success=true&bookingId=${booking.id}`,
      cancel_url: `${config.frontendUrl}/my-bookings?canceled=true`,
      metadata: {
        bookingId: booking.id,
        userId: userId,
      },
    });

    res.json({
      success: true,
      data: { sessionUrl: session.url },
    });
  } catch (error) {
    console.error("CreateCheckoutSession error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};
