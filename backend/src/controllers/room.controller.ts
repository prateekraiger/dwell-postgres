import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../lib";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const where: any = { isAvailable: true };

    const rooms = await prisma.room.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: { rooms },
    });
  } catch (error) {
    console.error("GetRooms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      data: { room },
    });
  } catch (error) {
    console.error("GetRoom error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyRooms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const rooms = await prisma.room.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: { rooms },
    });
  } catch (error) {
    console.error("GetMyRooms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const {
      title,
      location,
      pricePerNight,
      description,
      photos,
      maxGuests,
      highlights,
    } = req.body;

    if (
      !title ||
      !location ||
      !pricePerNight ||
      !description ||
      !photos ||
      !maxGuests
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const room = await prisma.room.create({
      data: {
        ownerId: userId,
        title,
        location,
        pricePerNight: parseFloat(pricePerNight),
        description,
        photos,
        maxGuests: parseInt(maxGuests),
        highlights: highlights || [],
        isAvailable: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { room },
    });
  } catch (error) {
    console.error("CreateRoom error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.ownerId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only update rooms that you own",
      });
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: { room: updatedRoom },
    });
  } catch (error) {
    console.error("UpdateRoom error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.ownerId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only delete rooms that you own",
      });
    }

    await prisma.room.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("DeleteRoom error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
