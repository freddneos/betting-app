import {  Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { UserBet } from "../entities/UserBet";
import { Event } from "../entities/Event";
import logger from "../utils/logger";
import { AuthenticatedRequest } from "../middlewares/auth";

const BALANCE_GRANT = 100;


export class UserController {
  static getMyBets = async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user!.user_id; 
    logger.info(`Fetching bets for user_id: ${user_id}`);
    
    try {
      const userBetRepository = AppDataSource.getRepository(UserBet);
      
      const userBets = await userBetRepository.find({
        where: { user: { user_id } },
        relations: ['event', 'event.sport'],
      });

      if (userBets.length === 0) {
        logger.info(`No bets found for user_id: ${user_id}.`);
        return res.status(404).json({ message: "No bets found." });
      }

      const betsWithEventData = userBets.map(bet => ({
        bet_id: bet.bet_id,
        amount: bet.amount,
        event: {
          event_id: bet.event.event_id,
          event_name: bet.event.event_name,
          odds: bet.event.odds,
          sport: {
            sport_id: bet.event.sport.sport_id,
            name: bet.event.sport.name,
            color: bet.event.sport.color,
            emoji: bet.event.sport.emoji,
            slug: bet.event.sport.slug,
          }
        },
        possibleAmountToWin: bet.amount * bet.event.odds,
      }));

      logger.info(`Retrieved ${userBets.length} bets for user_id: ${user_id}.`);
      res.json(betsWithEventData);
    } catch (error) {
      logger.error("Error fetching user bets: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to fetch user bets." });
    }
  };

  static placeBet = async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user!.user_id; 
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

      const event = await eventRepository.findOne({ where: { event_id } });
      if (!event) {
        logger.info(`Event with id ${event_id} not found.`);
        return res.status(404).json({ message: "Event not found." });
      }

      if (user.balance < amount) {
        logger.info(`User ${user_id} does not have sufficient balance for this bet. Requested -> ${amount} / Available -> ${user.balance}`);
        return res.status(400).json({ message: "Insufficient balance." });
      }

      user.balance -= amount;
      await userRepository.save(user);

      const userBet = userBetRepository.create({
        user,
        event,
        amount,
      });

      await userBetRepository.save(userBet);
      logger.info(`Bet placed successfully by user ${user_id} on event ${event_id}`);

      res.status(201).json({
        message: "Bet placed successfully.",
        bet: {
          bet_id: userBet.bet_id,
          event: {
            event_id: event.event_id,
            event_name: event.event_name,
            odds: event.odds,
          },
          amount: userBet.amount,
          possibleAmountToWin: userBet.amount * event.odds,
        },
      });
    } catch (error) {
      logger.error("Error placing bet: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to place bet." });
    }
  };
}
