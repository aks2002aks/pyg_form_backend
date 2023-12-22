import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send OTP via email
export function sendOTPToEmail(email: string, otp: number) {
  console.log("Sending OTP to email...");
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS + "@gmail.com",
    to: email,
    subject: "Verification OTP!",
    text: `Your one-time password (OTP) is: ${otp} which is valid for 5 minutes.`,
  };

  console.log(mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });

  return otp;
}
