import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../lib";

export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const userId = req.user!.userId;

    if (!["GUEST", "OWNER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("UpdateRole error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user!.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
