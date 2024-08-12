import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const SECRET = process.env.JWT_SECRET || 'mysecret001';

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
      const user = userRepository.create({ email, password: hashedPassword, balance: 100 });
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

      // Check if the user already has a valid token
      if (user.jwt_token) {
        try {
          jwt.verify(user.jwt_token, SECRET); // Verify if the existing token is still valid
          return res.status(200).json({ message: "Login successful.", token: user.jwt_token });
        } catch (err) {
         return res.status(401).json({ message: "Invalid token." });
        }

      }

      // Generate a new token
      const token = jwt.sign({ user_id: user.user_id }, SECRET, { expiresIn: "1h" });
      user.jwt_token = token;
      await userRepository.save(user);

      res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
      logger.error("Error logging in: " + (error as Error).message);
      res.status(500).json({ message: "Failed to log in." });
    }
  };

  static me = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing." });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, SECRET);
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { user_id: decoded.user_id } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ email: user.email, balance: user.balance });
    } catch (error) {
      logger.error("Error fetching user data: " + (error as Error).message);
      res.status(500).json({ message: "Failed to fetch user data." });
    }
  };
}
