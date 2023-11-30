import { Request, Response } from "express";

const welcome = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API successfully called",
  });
};

export { welcome };
