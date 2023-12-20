// routes/userRoutes.ts

import express from "express";
import {
  deleteFile,
  deleteFormFiles,
  deleteFormImages,
  deleteImage,
  uploadFile,
  uploadImage,
} from "../controllers/awsS3Controller";

const router = express.Router();

router.get("/aws/s3/uploadImage", uploadImage);
router.get("/aws/s3/deleteImage", deleteImage);
router.get("/aws/s3/deleteFormImages", deleteFormImages);

router.get("/aws/s3/uploadFile", uploadFile);
router.get("/aws/s3/deleteFile", deleteFile);
router.get("/aws/s3/deleteFormFiles", deleteFormFiles);

export default router;
