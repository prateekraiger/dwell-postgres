import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../lib";

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    console.error("GetMyBookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const myRooms = await prisma.room.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const roomIds = myRooms.map((room) => room.id);

    const bookings = await prisma.booking.findMany({
      where: { roomId: { in: roomIds } },
      include: {
        room: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    console.error("GetOwnerBookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error("GetBooking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoomBookings = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: "CANCELLED" },
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
      },
    });

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    console.error("GetRoomBookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide roomId, checkIn and checkOut dates",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: "CANCELLED" },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
        ],
      },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This room is already booked for the selected dates",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: "PENDING",
      },
      include: {
        room: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error("CreateBooking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isGuest = booking.userId === userId;
    const isOwner = booking.room.ownerId === userId;

    if (!isGuest && !isOwner && userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own bookings or bookings for rooms that you own",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { room: true },
    });

    res.json({
      success: true,
      data: { booking: updatedBooking },
    });
  } catch (error) {
    console.error("UpdateBooking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isGuest = booking.userId === userId;
    const isOwner = booking.room.ownerId === userId;

    if (!isGuest && !isOwner && userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings or bookings for rooms that you own",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { room: true },
    });

    res.json({
      success: true,
      data: { booking: updatedBooking },
    });
  } catch (error) {
    console.error("CancelBooking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
