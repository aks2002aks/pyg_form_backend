// awsS3Service.ts
import dotenv from "dotenv";
import { S3, S3ClientConfig } from "@aws-sdk/client-s3";

dotenv.config();

const client_s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
} as S3ClientConfig);

export default client_s3;
