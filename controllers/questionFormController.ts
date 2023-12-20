import { Request, Response } from "express";
import genricForm from "../models/genricForm";
import User from "../models/user";
import dotenv from "dotenv";

dotenv.config();

const createQuestionForm = async (req: Request, res: Response) => {
  const { user, userId, formField } = req.body;

  try {
    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const genericForm = new genricForm();
    genericForm.user = user;
    genericForm.userId = userId;
    genericForm.formFields = formField;
    genericForm.formName = "untitled form";
    genericForm.createdAt = new Date();
    genericForm.updatedAt = new Date();
    await genericForm.save();

    res.status(200).json({
      success: true,
      id: genericForm._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Create Form. Internal server error.",
    });
  }
};

const editQuestionForm = async (req: Request, res: Response) => {
  const { formId, formFields, userId } = req.body;

  try {
    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const genericForm = await genricForm.findOneAndUpdate(
      { _id: formId, userId: userId },
      { formFields, updatedAt: new Date(), $inc: { __v: 1 } },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Generic form updated successfully.",
        id: genericForm._id,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Generic form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update generic form. Internal server error.",
    });
  }
};

const getAllFormsByUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const forms = await genricForm.find(
      { userId },
      { _id: 1, updatedAt: 1, formName: 1 }
    );

    res.status(200).json({
      success: true,
      forms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch forms. Internal server error.",
    });
  }
};

const getFormById = async (req: Request, res: Response) => {
  const { formId } = req.body;

  try {
    const form = await genricForm.findOne({ _id: formId });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }

    // Check and update acceptingResponses based on acceptingResponsesTill
    if (form.acceptingResponsesTill !== "") {
      const currentDate = new Date();
      const acceptingDate = new Date(form.acceptingResponsesTill as string);
      if (acceptingDate && acceptingDate < currentDate) {
        form.acceptingResponses = false;
        // Save the updated form to the database
        await form.save();
      } else {
        form.acceptingResponses = true;
        // Save the updated form to the database
        await form.save();
      }
    }

    res.status(200).json({
      success: true,
      form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch form. Internal server error.",
    });
  }
};

const setFormName = async (req: Request, res: Response) => {
  const { formId, formName, userId } = req.body;

  try {
    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const genericForm = await genricForm.findOneAndUpdate(
      { _id: formId, userId: userId },
      { formName, updatedAt: new Date() },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Form name updated successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update form name. Internal server error.",
    });
  }
};

const deleteForm = async (req: Request, res: Response) => {
  const { formId, userId } = req.body;

  try {
    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const genericForm = await genricForm.findOneAndDelete({
      _id: formId,
      userId: userId,
    });

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Form deleted successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete form. Internal server error.",
    });
  }
};

const setIsPublished = async (req: Request, res: Response) => {
  const { formId, userId, isPublic } = req.body;

  try {
    const userExists = await User.findOne({ _id: userId });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
    const genericForm = await genricForm.findOneAndUpdate(
      { _id: formId, userId: userId },
      { isPublic: isPublic, updatedAt: new Date() },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Form Published successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Publish form. Internal server error.",
    });
  }
};

const saveImageUrlKey = async (req: Request, res: Response) => {
  const { formId, fieldId, imageUrlKey } = req.body;

  try {
    const genericForm = await genricForm.findOneAndUpdate(
      { _id: formId, "formFields.id": fieldId },
      { $set: { "formFields.$.imageUrlKey": imageUrlKey } },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Image URL key saved successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form or field not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save image URL key. Internal server error.",
    });
  }
};

const setFormSettings = async (req: Request, res: Response) => {
  const { formId, userId, formSettings } = req.body;

  try {
    const genericForm = await genricForm.findByIdAndUpdate(
      { _id: formId, userId: userId },
      { $set: { formSettings: formSettings } },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Form settings updated successfully.",
        form: genericForm,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update form settings. Internal server error.",
    });
  }
};

const setAcceptingResponse = async (req: Request, res: Response) => {
  const { formId, acceptingResponse } = req.body;

  try {
    const genericForm = await genricForm.findByIdAndUpdate(
      { _id: formId },
      { $set: { acceptingResponses: acceptingResponse } },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Form Accepting Response updated successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update form Accepting Response. Internal server error.",
    });
  }
};

const setAcceptingResponseTill = async (req: Request, res: Response) => {
  const { formId, acceptingResponseTill } = req.body;

  try {
    const genericForm = await genricForm.findByIdAndUpdate(
      { _id: formId },
      { $set: { acceptingResponsesTill: acceptingResponseTill } },
      { new: true }
    );

    if (genericForm) {
      return res.status(200).json({
        success: true,
        message: "Form Accepting Response Till updated successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Form not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update form Accepting Response Till. Internal server error." +
        error,
    });
  }
};

export {
  createQuestionForm,
  editQuestionForm,
  getAllFormsByUser,
  getFormById,
  setFormName,
  setIsPublished,
  deleteForm,
  saveImageUrlKey,
  setFormSettings,
  setAcceptingResponse,
  setAcceptingResponseTill,
};
