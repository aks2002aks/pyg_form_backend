// controllers/welcomeController.js
// routes/userRoutes.ts

import express from "express";
import { welcome } from "../controllers/welcomeContoller";

const router = express.Router();

router.post("/welcome", welcome);
router.get("/welcome", welcome);

export default router;
