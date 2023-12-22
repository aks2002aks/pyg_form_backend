// server.ts

import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import { connectDatabase } from "./database";
import authRoutes from "./routes/authRoutes";
import welcomeRoutes from "./routes/welcomeRoutes";
import cors from "cors";
import tokenRoutes from "./routes/tokenRoutes";
import questionFormRoutes from "./routes/questionFormRoutes";
import awsS3Routes from "./routes/awsS3Routes";
import formResponseRoutes from "./routes/formResponseRoutes";
import { client, connectRedisDatabase } from "./redis";

dotenv.config();

const app = express();
app.use(express.json());
app.use(mongoSanitize());

// Connect to MongoDB
connectDatabase();
connectRedisDatabase();
// Middleware
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use("/api", welcomeRoutes);
app.use("/api", tokenRoutes);
app.use("/api", questionFormRoutes);
app.use("/api", awsS3Routes);
app.use("/api", formResponseRoutes);

client.on("error", (err) => {
  console.log("Redis error: ", err);
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
