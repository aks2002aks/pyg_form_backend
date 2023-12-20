import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
// Verify token API
export const verifyToken = (req: Request, res: Response) => {
  const token = req.headers.cookie?.split("=")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_TOKEN as string);
    return res.status(200).json({ success: true, message: "Valid token" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Decode token API
export const decodeToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.decode(token);
    return res.status(200).json({ success: true, decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
