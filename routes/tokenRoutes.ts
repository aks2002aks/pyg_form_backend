import express from "express";
import { decodeToken, verifyToken } from "../controllers/tokenController";

const router = express.Router();

router.post("/verify", verifyToken);
router.post("/decode", decodeToken);

export default router;
