import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { UserBet } from "../entities/UserBet";
import { Event } from "../entities/Event";
import argon2 from "argon2";
import logger from "../utils/logger";
import { AuthenticatedRequest } from "../middlewares/auth";


export class UserController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    logger.info(`Creating account for email: ${email}`);

    try {
      const userRepository = AppDataSource.getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        logger.info(`Email ${email} is already registered.`);
        return res.status(400).json({ message: "Email is already registered." });
      }

      const hashedPassword = await argon2.hash(password);
      const user = userRepository.create({ email, password: hashedPassword, balance: 0 });
      await userRepository.save(user);

      logger.info(`Account created successfully for email: ${email}`);
      res.status(201).json(user);
    } catch (error) {
      logger.error("Error creating account: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to create account." });
    }
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    logger.info(`Attempting login for email: ${email}`);

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        logger.info(`Login failed for email: ${email} - User not found.`);
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        logger.info(`Login failed for email: ${email} - Invalid password.`);
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate JWT Token
      const jwtSecret = process.env.JWT_SECRET || 'mysecret001';  // Use a secure secret key from your environment variables
      const jwtToken = jwt.sign({ userId: user.user_id }, jwtSecret, { expiresIn: '10h' });

      user.jwt_token = jwtToken;
      user.last_login = new Date();
      await userRepository.save(user);

      logger.info(`Login successful for email: ${email}`);
      res.json({ token: jwtToken });
    } catch (error) {
      logger.error("Error during login: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to login." });
    }
  };

  static getMyBets = async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user!.user_id; // Access the authenticated user's ID
    logger.info(`Fetching bets for user_id: ${user_id}`);
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { user_id }, relations: ['bets'] });
      if (!user) {
        logger.info(`User with id ${user_id} not found.`);
        return res.status(404).json({ message: "User not found." });
      }
      logger.info(`Retrieved ${user.bets.length} bets for user_id: ${user_id}.`);
      res.json(user.bets);
    } catch (error) {
      logger.error("Error fetching user bets: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to fetch user bets." });
    }
  };

  static placeBet = async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user!.user_id; // Access the authenticated user's ID
    const { event_id, amount } = req.body;
    if (!event_id || !amount || amount <= 0) {
      logger.info(`Invalid bet placement attempt by user_id: ${user_id}`);
      return res.status(400).json({ message: "Invalid event ID or bet amount." });
    }
    logger.info(`User ${user_id} is attempting to place a bet of ${amount} on event ${event_id}`);
    try {
      const userRepository = AppDataSource.getRepository(User);
      const eventRepository = AppDataSource.getRepository(Event);
      const userBetRepository = AppDataSource.getRepository(UserBet);
      const user = await userRepository.findOne({ where: { user_id } });
      if (!user) {
        logger.info(`User with id ${user_id} not found.`);
        return res.status(404).json({ message: "User not found." });
      }
      const event = await eventRepository.findOne(event_id);
      if (!event) {
        logger.info(`Event with id ${event_id} not found.`);
        return res.status(404).json({ message: "Event not found." });
      }
      if (user.balance < amount) {
        logger.info(`User ${user_id} does not have sufficient balance for this bet.`);
        return res.status(400).json({ message: "Insufficient balance." });
      }
      // Deduct the amount from the user's balance
      user.balance -= amount;
      await userRepository.save(user);
      // Create a new UserBet entry
      const userBet = userBetRepository.create({
        user,
        event,
        amount,
      });
      await userBetRepository.save(userBet);
      logger.info(`Bet placed successfully by user ${user_id} on event ${event_id}`);
      res.status(201).json({ message: "Bet placed successfully.", bet: userBet });
    } catch (error) {
      logger.error("Error placing bet: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to place bet." });
    }
  };
}
