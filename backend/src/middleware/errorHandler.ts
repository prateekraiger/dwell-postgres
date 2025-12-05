import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
