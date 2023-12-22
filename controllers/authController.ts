// controllers/authController.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import mongoose from "mongoose";
import { setAsync, getAsync, delAsync, connectRedisDatabase } from "../redis";
import { generateOTP } from "../utils/otpGenerator";
import { sendOTPToEmail } from "../utils/sendEmailOtp";

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

async function resetPassword(req: Request, res: Response) {
  const { email, newPassword, currentPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (passwordMatch) {
      // Generate a new hashed password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: "Password reset successfully" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid current password" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ success: false, message: "Error resetting password" });
  }
}

async function sendEmailOTP(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user?.isEmailVerified) {
      return res
        .status(200)
        .json({ user: true, message: "Already Verified. Login Again" });
    }

    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const storedOTP = await getAsync(email);
    if (storedOTP) {
      await delAsync(email);
    }

    await setAsync(email, otp, "EX", 300);
    sendOTPToEmail(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error sending OTP" });
  }
}

async function verifyEmailOTP(req: Request, res: Response) {
  const { email, otp } = req.body;

  try {
    const storedOTP = await getAsync(email);

    if (storedOTP && storedOTP === otp) {
      // Remove the OTP from Redis after successful verification
      await delAsync(email);

      // mark email as verified in the database
      // update user status accordingly
      const user = await User.findOne({ email });
      if (user) {
        user.isEmailVerified = true;
        user.save();
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.json({ success: true, message: "Email verified successfully" });
    } else {
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error verifying OTP" });
  }
}

async function resendEmailOTP(req: Request, res: Response) {
  const { email } = req.body;

  try {
    // Generate a new OTP
    const storedOTP = await getAsync(email);

    // Send the new OTP to the user's email
    sendOTPToEmail(email, parseInt(storedOTP as string));

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error resending OTP" });
  }
}

async function setProfileImageUrl(req: Request, res: Response) {
  const { userId, profileImageUrl } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (user) {
      // Set the profileImageUrl
      user.profileImageUrl = profileImageUrl;
      await user.save();

      res.json({ success: true, message: "Profile image URL set successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

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

export {
  login,
  signup,
  sendEmailOTP,
  verifyEmailOTP,
  resendEmailOTP,
  resetPassword,
  setProfileImageUrl
};
