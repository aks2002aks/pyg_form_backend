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

const router = express.Router();

router.post("/createQuestionForm", createQuestionForm);
router.post("/editQuestionForm", editQuestionForm);
router.post("/getAllForms", getAllFormsByUser);
router.post("/getFormById", getFormById);
router.put("/setFormName", setFormName);
router.post("/deleteForm", deleteForm);
router.put("/setIsPublished", setIsPublished);
router.post("/saveImageUrlKey", saveImageUrlKey);
router.post("/setFormSettings", setFormSettings);
router.post("/setAcceptingResponse", setAcceptingResponse);
router.post("/setAcceptingResponseTill", setAcceptingResponseTill);

export default router;
