// server.ts

import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import { connectDatabase } from "./database";
import authRoutes from "./routes/authRoutes";
import welcomeRoutes from "./routes/welcomeRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(mongoSanitize());

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", welcomeRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
