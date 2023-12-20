// models/formResponseModel.ts

import mongoose, { Document, Schema } from "mongoose";

interface FormFieldResponse {
  formFieldId: string;
  type: string;
  answer: string | string[];
  time?: string;
  date?: string;
  fileUrlKey?: string;
  rangeTo?: number;
  rangeFrom?: number;
  required: boolean;
  isTime?: boolean;
  label: string;
  description?: string;
  imageUrlKey?: string;
  imageSettings?: any;
}

interface FormResponse extends Document {
  userId?: string;
  formId: string;
  userName?: string;
  email?: string;
  formResponses: FormFieldResponse[];
  submittedAt: Date;
  updatedAt?: Date;
}

const formResponseSchema = new Schema<FormResponse>({
  userId: String,
  formId: String,
  userName: String,
  email: String,
  formResponses: [Schema.Types.Mixed],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export default mongoose.model<FormResponse>("FormResponse", formResponseSchema);
