import { Request, Response } from "express";
import User from "../models/user";
import dotenv from "dotenv";
import formResponse from "../models/formResponse";
import * as Papa from "papaparse";
import { htmlToText } from "html-to-text";

dotenv.config();

const createFormResponse = async (req: Request, res: Response) => {
  const { userResponse } = req.body;

  try {
    const newFormResponse = new formResponse(userResponse);
    newFormResponse.updatedAt = new Date();
    await newFormResponse.save();

    res.status(200).json({
      success: true,
      message: "Form response created successfully.",
      id: newFormResponse._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create form response. Internal server error.",
    });
  }
};

const deleteFormResponses = async (req: Request, res: Response) => {
  const { formId } = req.body;

  try {
    const deletedResponses = await formResponse.deleteMany({ formId });

    if (deletedResponses.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Form responses deleted successfully.",
        count: deletedResponses.deletedCount,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No form responses found for the given form ID.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete form responses. Internal server error.",
    });
  }
};

const checkUserResponse = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const userResponse = await formResponse
      .findOne({ userId })
      .sort({ submittedAt: -1 });

    if (userResponse) {
      return res.status(200).json({
        success: true,
        message: "User has responded.",
        response: userResponse,
        id: userResponse._id,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User has not responded yet.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check user response. Internal server error.",
    });
  }
};

const getUserResponseById = async (req: Request, res: Response) => {
  const { responseId } = req.body;

  try {
    const userResponse = await formResponse.findById(responseId);

    if (userResponse) {
      return res.status(200).json({
        success: true,
        message: "User response found.",
        response: userResponse,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User response not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user response. Internal server error.",
    });
  }
};

const editFormResponse = async (req: Request, res: Response) => {
  const { responseId, userResponse } = req.body;

  try {
    const updatedResponse = await formResponse.findByIdAndUpdate(
      responseId,
      { response: userResponse },
      { new: true }
    );

    if (updatedResponse) {
      return res.status(200).json({
        success: true,
        message: "User response updated successfully.",
        response: updatedResponse,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User response not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user response. Internal server error.",
    });
  }
};

const setFileUrlKey = async (req: Request, res: Response) => {
  const { responseId, fileUrlKey, formFieldId, answer } = req.body;

  try {
    const updatedResponse = await formResponse.findOneAndUpdate(
      { _id: responseId, "formResponses.formFieldId": formFieldId },
      {
        $set: {
          "formResponses.$.fileUrlKey": fileUrlKey,
          "formResponses.$.answer": answer,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (updatedResponse) {
      return res.status(200).json({
        success: true,
        message: "User response updated successfully.",
        response: updatedResponse,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User response not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user response. Internal server error.",
    });
  }
};

const deleteResponsesByFormId = async (req: Request, res: Response) => {
  const { formId } = req.body;

  try {
    const deletedResponses = await formResponse.deleteMany({ formId: formId });

    if (deletedResponses.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Responses deleted successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No responses found for the given formId.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete responses. Internal server error.",
    });
  }
};

interface RowData {
  [key: string]: string | string[];
}

//TODO : Correct the csv making it is wrong.

const exportResponsesToCSV = async (req: Request, res: Response) => {
  const { formId } = req.body;

  try {
    const responses = await formResponse.find({ formId });

    // Create a mapping between formFieldId and label
    const formFieldIdToLabel: { [key: string]: string } = {};
    responses.forEach((response) => {
      response.formResponses.forEach((formResponse) => {
        const text = htmlToText(formResponse.label);
        formFieldIdToLabel[formResponse.formFieldId] = Array.isArray(text)
          ? text.join(" ")
          : text;
      });
    });

    const csvData = responses.map((response) => {
      const rowData: RowData = {};

      response.formResponses.forEach((formResponse) => {
        const formFieldId = formResponse.formFieldId;
        const label = formFieldIdToLabel[formFieldId] || "";

        // Add formFieldId and its corresponding label as headers
        rowData[`formFieldId_${formFieldId}`] = formFieldId;
        rowData[`label_${formFieldId}`] = label;

        // Map the answer to its corresponding label
        rowData[label] = formResponse.answer;
      });

      return rowData;
    });

    // Extract unique labels to create CSV header
    const uniqueLabels = Object.values(formFieldIdToLabel).map(
      (label) => `label_${label}`
    );
    const uniqueFormFieldIds = Object.keys(formFieldIdToLabel).map(
      (formFieldId) => `formFieldId_${formFieldId}`
    );

    const csv = Papa.unparse({
      fields: [...uniqueFormFieldIds, ...uniqueLabels],
      data: csvData,
    });

    if (csv) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=responses.csv"
      );
      return res.status(200).json({
        success: true,
        csv: csv,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No responses found for the given formId.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch responses. Internal server error.",
    });
  }
};

const getResponsesByFormId = async (req: Request, res: Response) => {
  try {
    const { formId } = req.body;

    // Query the database to get all responses associated with the formId
    const responses = await formResponse.find({ formId });

    // Extract the required fields from each response
    const formattedResponses = responses.map((response) => ({
      formId: response.formId,
      userId: response.userId || null,
      userName: response.userName || null,
      email: response.email || null,
      _id: response._id,
      submittedAt: response.submittedAt,
    }));

    return res.status(200).json({
      success: true,
      response: formattedResponses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch responses. Internal server error.",
    });
  }
};

const getResponseByResponseId = async (req: Request, res: Response) => {
  try {
    const { responseId } = req.body;

    // Query the database to get all responses associated with the formId
    const response = await formResponse.findOne({ _id: responseId });

    return res.status(200).json({
      success: true,
      response: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch responses. Internal server error.",
    });
  }
};

const getAllResponsesByEmailId = async (req: Request, res: Response) => {
  try {
    const { Email } = req.body;

    // Query the database to get all responses associated with the formId
    const response = await formResponse.find({ email: Email });

    return res.status(200).json({
      success: true,
      response: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch responses. Internal server error.",
    });
  }
};

export {
  createFormResponse,
  deleteFormResponses,
  checkUserResponse,
  getUserResponseById,
  editFormResponse,
  setFileUrlKey,
  deleteResponsesByFormId,
  exportResponsesToCSV,
  getResponsesByFormId,
  getResponseByResponseId,
  getAllResponsesByEmailId
};
