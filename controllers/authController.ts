// controllers/authController.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import mongoose from "mongoose";

const login = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;

  try {
    // Check if the user exists based on email or phone number
    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email or phone number does not exist. Please signup",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const { password, ...userData } = user.toObject();

      res.json({
        success: true,
        message: "Login successful",
        user: userData,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or phone number or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    // Check if the email or phone number already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email or phone number already exists. Please use a different one or login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      updatedAt: new Date().toISOString(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {

    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation errors (e.g., required fields)
      return res.status(400).json({
        success: false,
        message: "Validation error. Check your input.",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register user. Internal server error.",
    });
  }
};

// const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const bearertoken = req.headers.authorization;
//     const token = bearertoken?.split(" ")[1];

//     if (token) {
//       const decodedToken: any = jwt.verify(
//         token,
//         process.env.JWT_TOKEN as string
//       );

//       if (decodedToken) {
//         res.locals.user = decodedToken;
//         return next();
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const signout = async (req: Request, res: Response) => {
//   res.clearCookie("jwt");
//   res.json({
//     success: true,
//     message: "User signed out successfully",
//   });
// };

export { login, signup };
