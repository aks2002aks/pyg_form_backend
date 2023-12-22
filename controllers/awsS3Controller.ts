import { Request, Response } from "express";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client_s3 from "../utils/awsS3Service";

dotenv.config();

const deleteFormImages = async (req: Request, res: Response) => {
  const { formId } = req.query;

  try {
    if (!formId) {
      return res.status(400).json({
        success: false,
        message: "Missing formId parameter",
      });
    } else {
      const prefix = `forms/${formId}/`;
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
      });
      const listResponse = await client_s3.send(listCommand);
      const deletePromises = listResponse.Contents?.map(async (obj) => {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: obj.Key || "",
        });
        await client_s3.send(deleteCommand);
      });
      await Promise.all(deletePromises || []);
      return res.status(200).json({
        success: true,
        message: "Delete successful all images",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error deleting form images: " + error,
    });
  }
};

const deleteImage = async (req: Request, res: Response) => {
  const { fileKey } = req.query;

  try {
    if (!fileKey) {
      return res.status(400).json({
        success: false,
        message: "Missing fileKey parameter",
      });
    } else {
      const Key = `${fileKey}`;
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
      });

      await client_s3.send(command);
      return res.status(200).json({
        success: true,
        message: "Delete successful",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error deleting image: " + error,
    });
  }
};

const uploadImage = async (req: Request, res: Response) => {
  const { fileType, fileKey, fileName } = req.query;

  const decodedFileType = decodeURIComponent(fileType as string);
  const decodedfileKey = decodeURIComponent(fileKey as string);
  const decodedfileName = decodeURIComponent(fileName as string);

  try {
    if (!decodedFileType || !decodedfileKey || !decodedfileName) {
      return res.status(400).json({
        success: false,
        message: "Missing fileKey or fileType parameter",
      });
    } else {
      const Key = `forms/${decodedfileKey}/${decodedfileName}`;
      const ext = decodedFileType.split("/")[1];
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        ContentType: `images/${ext}`,
      };

      const uploadUrl = await getSignedUrl(
        client_s3,
        new PutObjectCommand(s3Params),
        {
          expiresIn: 600,
        }
      );

      return res.status(200).json({
        success: true,
        uploadUrl,
        Key,
        message: "Uploaded successful",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error uploading image: " + error,
    });
  }
};

const uploadFile = async (req: Request, res: Response) => {
  const { fileName, fileType, fileKey } = req.query;

  const decodedFileType = decodeURIComponent(fileType as string);
  const decodedfileKey = decodeURIComponent(fileKey as string);
  const decodedfileName = decodeURIComponent(fileName as string);

  try {
    if (!decodedFileType || !decodedfileKey || !decodedfileName) {
      return res.status(400).json({
        success: false,
        message: "Missing  parameter",
      });
    } else {
      const Key = `response/${decodedfileKey}/${decodedfileName}`;
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        ContentType: `${decodedFileType}`,
      };
      const uploadUrl = await getSignedUrl(
        client_s3,
        new PutObjectCommand(s3Params),
        {
          expiresIn: 600,
        }
      );
      return res.status(200).json({
        success: true,
        uploadUrl,
        Key,
        message: "Uploaded successful",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error uploading File: " + error,
    });
  }
};

const deleteFile = async (req: Request, res: Response) => {
  const { fileKey } = req.query;

  try {
    if (!fileKey) {
      return res.status(400).json({
        success: false,
        message: "Missing  parameter",
      });
    } else {
      const Key = `${fileKey}`;
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
      });

      await client_s3.send(command);
      return res.status(200).json({
        success: true,
        message: "Deleted successful",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error deleting File: " + error,
    });
  }
};

const deleteFormFiles = async (req: Request, res: Response) => {
  const { formId } = req.query;

  try {
    if (!formId) {
      return res.status(400).json({
        success: false,
        message: "Missing formId parameter",
      });
    } else {
      const prefix = `response/${formId}/`;
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
      });
      const listResponse = await client_s3.send(listCommand);
      const deletePromises = listResponse.Contents?.map(async (obj) => {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: obj.Key || "",
        });
        await client_s3.send(deleteCommand);
      });
      await Promise.all(deletePromises || []);
      return res.status(200).json({
        success: true,
        message: "Delete successful all Files",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error deleting form Files: " + error,
    });
  }
};



const deleteProfileImage = async (req: Request, res: Response) => {
  const { fileKey } = req.query;

  try {
    if (!fileKey) {
      return res.status(400).json({
        success: false,
        message: "Missing fileKey parameter",
      });
    } else {
      const Key = `${fileKey}`;
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
      });

      await client_s3.send(command);
      return res.status(200).json({
        success: true,
        message: "Delete successful",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error deleting image: " + error,
    });
  }
};

const uploadProfileImage = async (req: Request, res: Response) => {
  const { fileType, fileKey, fileName } = req.query;

  const decodedFileType = decodeURIComponent(fileType as string);
  const decodedfileKey = decodeURIComponent(fileKey as string);
  const decodedfileName = decodeURIComponent(fileName as string);

  try {
    if (!decodedFileType || !decodedfileKey || !decodedfileName) {
      return res.status(400).json({
        success: false,
        message: "Missing fileKey or fileType parameter",
      });
    } else {
      const Key = `user/${decodedfileKey}/${decodedfileName}`;
      const ext = decodedFileType.split("/")[1];
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
        ContentType: `images/${ext}`,
      };

      const uploadUrl = await getSignedUrl(
        client_s3,
        new PutObjectCommand(s3Params),
        {
          expiresIn: 600,
        }
      );

      return res.status(200).json({
        success: true,
        uploadUrl,
        Key,
        message: "Uploaded successful",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error uploading image: " + error,
    });
  }
};

export {
  uploadImage,
  uploadFile,
  deleteImage,
  deleteFormImages,
  deleteFile,
  deleteFormFiles,
  uploadProfileImage,
  deleteProfileImage
};
