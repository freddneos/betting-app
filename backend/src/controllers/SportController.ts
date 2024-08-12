import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Sport } from "../entities/Sport";
import logger from "../utils/logger";

export class SportController {
  static getAllSports = async (req: Request, res: Response) => {
    logger.info("Fetching all sports...");

    try {
      const sportRepository = AppDataSource.getRepository(Sport);
      const sports = await sportRepository.find();

      if (sports.length === 0) {
        logger.info("No sports found.");
        return res.status(404).json({ message: "No sports found." });
      }

      logger.info(`Retrieved ${sports.length} sports.`);
      res.json(sports);
    } catch (error) {
      logger.error("Error fetching sports: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to fetch sports." });
    }
  };

  static getEventsBySport = async (req: Request, res: Response) => {
    const { sport_id } = req.params;
    logger.info(`Fetching events for sport_id: ${sport_id}`);

    try {
      const sportRepository = AppDataSource.getRepository(Sport);
      const sport = await sportRepository.findOne({
        where: { sport_id: Number(sport_id) },
        relations: ["events"], // Load the related events
      });

      if (!sport) {
        logger.info(`Sport with id ${sport_id} not found.`);
        return res.status(404).json({ message: "Sport not found." });
      }

      if (!sport.events || sport.events.length === 0) {
        logger.info(`No events found for sport_id: ${sport_id}.`);
        return res.status(404).json({ message: "No events found for this sport." });
      }

      logger.info(`Retrieved ${sport.events.length} events for sport_id: ${sport_id}.`);
      res.json(sport.events);
    } catch (error) {
      logger.error("Error fetching events by sport: " + (error as Error).message);
      return res.status(500).json({ message: "Failed to fetch events by sport. "  + (error as Error).message });
    }
  };
}
