// routes/userRoutes.ts

import express from "express";
import {
  signup,
  login,
  sendEmailOTP,
  verifyEmailOTP,
  resetPassword,
  resendEmailOTP,
  setProfileImageUrl,
  verifyOTPUsingEmail,
  forgotPassword,
} from "../controllers/authController";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendEmailOTP", sendEmailOTP);
router.post("/verifyEmailOTP", isLoggedIn, verifyEmailOTP);
router.post("/resendEmailOTP", resendEmailOTP);
router.post("/resetPassword", isLoggedIn, resetPassword);
router.post("/setProfileImageUrl", isLoggedIn, setProfileImageUrl);
router.post("/verifyOTPUsingEmail", verifyOTPUsingEmail);
router.post("/forgotPassword", forgotPassword);

// router.get("/logout", signout);

export default router;
