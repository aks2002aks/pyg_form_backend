// routes/userRoutes.ts

import express from "express";
import {
  deleteFile,
  deleteFormFiles,
  deleteFormImages,
  deleteImage,
  deleteProfileImage,
  uploadFile,
  uploadImage,
  uploadProfileImage,
} from "../controllers/awsS3Controller";

const router = express.Router();

router.get("/aws/s3/uploadImage", uploadImage);
router.get("/aws/s3/deleteImage", deleteImage);
router.get("/aws/s3/deleteFormImages", deleteFormImages);
router.get("/aws/s3/uploadFile", uploadFile);
router.get("/aws/s3/deleteFile", deleteFile);
router.get("/aws/s3/deleteFormFiles", deleteFormFiles);
router.get("/aws/s3/uploadProfileImage", uploadProfileImage);
router.get("/aws/s3/deleteProfileImage", deleteProfileImage);

export default router;
