import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearertoken = req.headers.authorization;
    const token = bearertoken?.split(" ")[1];
    if (token) {
      console.log(process.env.JWT_TOKEN);
      const decodedToken: any = jwt.verify(
        token,
        process.env.JWT_TOKEN as string
      );
      if (decodedToken) {
        return next();
      }
    } else {
      res.status(401).json({ success: false, message: "Authorization denied" });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: "Authorization denied" });
  }
};

export { isLoggedIn };
