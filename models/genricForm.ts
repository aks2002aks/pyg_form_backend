// models/allFormFieldModel.ts

import mongoose, { Document, Schema } from "mongoose";

interface FormField {
  type: string;
  id: string;
  label: string;
  focus: boolean;
  options?: string[];
  isOther?: boolean;
  description?: string;
  required: boolean;
  validation?: any;
  fileValidation?: any;
  isTime?: boolean;
  answer?: string;
  selectedAnswer?: string[];
  imageUrlKey: string;
  imageSettings: {
    width: number;
    height: number;
    align: string;
  };
}

interface genricForm extends Document {
  formFields: FormField[];
  userId: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
  formName: string;
  isPublic?: boolean;
  formSettings?: any;
  acceptingResponses: boolean;
  acceptingResponsesTill?: string;
  accessByRole?: string[];
}

const genricFormSchema = new Schema<genricForm>({
  formFields: [Schema.Types.Mixed],
  userId: String,
  user: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  formName: String,
  isPublic: {
    type: Boolean,
    default: false,
  },
  acceptingResponses: {
    type: Boolean,
    default: true,
  },
  accessByRole: {
    type: [String],
    default: ["admin", "manager", "vendor", "customer"],
  },
  acceptingResponsesTill: String,
  formSettings: {
    response: {
      collectEmailAddresses: {
        type: String,
        enum: ["do not collect", "Verified", "Responder input"],
        default: "do not collect",
      },
      limitToOneResponsePerPerson: {
        type: Boolean,
        default: false,
      },
      allowResponseEditing: {
        type: Boolean,
        default: false,
      },
    },
    presentation: {
      showLinkToSubmitAnotherResponse: {
        type: Boolean,
        default: false,
      },
      confirmationMessage: {
        type: String,
        default: "Your response has been recorded.",
      },
    },
    defaults: {
      makeAllQuestionsRequire: {
        type: Boolean,
        default: false,
      },
    },
  },
});

export default mongoose.model<genricForm>("genricForm", genricFormSchema);
