// models/allFormFieldModel.ts

import mongoose, { Document, Schema } from 'mongoose';

interface FormField {
  type: string;
  id: string;
  label: string;
  focus: boolean;
  options?: string[];
  isOther?: boolean;
  otherText?: string;
  description?: string;
  required: boolean;
  validation?: any;
  fileValidation?: any;
  isTime?: boolean;
  answer?: string;
  selectedAnswer?: string[];
  fromRange?: string;
  toRange?: string;
}

interface AllFormField extends Document {
  formFields: FormField[];
  userId?: string;
  user?: string;
}

const allFormFieldSchema = new Schema<AllFormField>({
  formFields: [
    {
      type: String,
      id: String,
      label: String,
      focus: Boolean,
      options: [String],
      isOther: Boolean,
      otherText: String,
      description: String,
      required: Boolean,
      validation: Schema.Types.Mixed,
      fileValidation: Schema.Types.Mixed,
      isTime: Boolean,
      answer: String,
      selectedAnswer: [String],
      fromRange: String,
      toRange: String,
    },
  ],
  userId: String,
  user: String,
});

const AllFormFieldModel = mongoose.model<AllFormField>('AllFormField', allFormFieldSchema);

export default AllFormFieldModel;
