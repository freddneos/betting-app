import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

export class AuthController {
  static signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }

      const hashedPassword = await argon2.hash(password);
      const user = userRepository.create({ email, password: hashedPassword });
      await userRepository.save(user);

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      logger.error("Error registering user: " + (error as Error).message);
      res.status(500).json({ message: "Failed to register user." });
    }
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user || !(await argon2.verify(user.password, password))) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
      logger.error("Error logging in: " + (error as Error).message);
      res.status(500).json({ message: "Failed to log in." });
    }
  };
}

