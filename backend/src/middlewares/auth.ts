import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import logger from "../utils/logger";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.info("No token provided or invalid format.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret001') as { userId: number };
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ user_id: decoded.userId });

    if (!user) {
      logger.info("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the authenticated user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    logger.error("Error authenticating token: " + (error as Error).message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
