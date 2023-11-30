// models/user.ts

import mongoose, { Document } from "mongoose";

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>({
  firstName: {
    type: String,
    required: [true, "firstName must be provided"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number must be provided"],
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
  },
  role: {
    type: String,
    enum: ["admin", "manager", "vendor", "customer"],
    default: "customer",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.model<User>("User", userSchema);
