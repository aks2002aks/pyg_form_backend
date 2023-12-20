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

const router = express.Router();

router.post("/createFormResponse", createFormResponse);
router.post("/deleteFormResponses", deleteFormResponses);
router.post("/checkUserResponse", checkUserResponse);
router.post("/getUserResponseById", getUserResponseById);
router.post("/editFormResponse", editFormResponse);
router.post("/setFileUrlKey", setFileUrlKey);
router.post("/deleteResponsesByFormId", deleteResponsesByFormId);
router.post("/exportResponsesToCSV", exportResponsesToCSV);
router.post("/getResponsesByFormId", getResponsesByFormId);
router.post("/getResponseByResponseId", getResponseByResponseId);
router.post("/getAllResponsesByEmailId", getAllResponsesByEmailId);

export default router;
