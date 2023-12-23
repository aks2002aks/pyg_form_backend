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

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendEmailOTP", sendEmailOTP);
router.post("/verifyEmailOTP", verifyEmailOTP);
router.post("/resendEmailOTP", resendEmailOTP);
router.post("/resetPassword", resetPassword);
router.post("/setProfileImageUrl", setProfileImageUrl);
router.post("/verifyOTPUsingEmail", verifyOTPUsingEmail);
router.post("/forgotPassword", forgotPassword);

// router.get("/logout", signout);

export default router;
