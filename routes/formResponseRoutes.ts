import express from "express";
import {
  checkUserResponse,
  createFormResponse,
  deleteFormResponses,
  deleteResponsesByFormId,
  editFormResponse,
  exportResponsesToCSV,
  getAllResponsesByEmailId,
  getResponseByResponseId,
  getResponsesByFormId,
  getUserResponseById,
  setFileUrlKey,
} from "../controllers/formResponseController";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

router.post("/createFormResponse",createFormResponse);
router.post("/deleteFormResponses",isLoggedIn, deleteFormResponses);
router.post("/checkUserResponse", checkUserResponse);
router.post("/getUserResponseById",isLoggedIn, getUserResponseById);
router.post("/editFormResponse",isLoggedIn, editFormResponse);
router.post("/setFileUrlKey", setFileUrlKey);
router.post("/deleteResponsesByFormId",isLoggedIn, deleteResponsesByFormId);
router.post("/exportResponsesToCSV",isLoggedIn, exportResponsesToCSV);
router.post("/getResponsesByFormId",isLoggedIn, getResponsesByFormId);
router.post("/getResponseByResponseId",isLoggedIn, getResponseByResponseId);
router.post("/getAllResponsesByEmailId",isLoggedIn, getAllResponsesByEmailId);

export default router;
