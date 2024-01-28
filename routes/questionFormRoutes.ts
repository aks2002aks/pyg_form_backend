import express from "express";
import {
  editQuestionForm,
  createQuestionForm,
  getAllFormsByUser,
  getFormById,
  setFormName,
  deleteForm,
  setIsPublished,
  saveImageUrlKey,
  setFormSettings,
  setAcceptingResponse,
  setAcceptingResponseTill,
} from "../controllers/questionFormController";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

router.post("/createQuestionForm", isLoggedIn, createQuestionForm);
router.post("/editQuestionForm", isLoggedIn, editQuestionForm);
router.post("/getAllForms", isLoggedIn, getAllFormsByUser);
router.post("/getFormById", getFormById);
router.put("/setFormName", isLoggedIn, setFormName);
router.post("/deleteForm", isLoggedIn, deleteForm);
router.put("/setIsPublished", isLoggedIn, setIsPublished);
router.post("/saveImageUrlKey", saveImageUrlKey);
router.post("/setFormSettings", isLoggedIn, setFormSettings);
router.post("/setAcceptingResponse", isLoggedIn, setAcceptingResponse);
router.post("/setAcceptingResponseTill", isLoggedIn, setAcceptingResponseTill);

export default router;
