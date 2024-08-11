import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entities/Event";
import { QueryFailedError } from "typeorm";
import logger from "../utils/logger";



export class EventController {
  static getAll = async (req: Request, res: Response) => {
    logger.info("Fetching events...");
    const page = parseInt(req.query.page as string, 10) || 1;  // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string, 10) || 20;  // Default to 10 items per page

    try {
      const eventRepository = AppDataSource.getRepository(Event);
      const [events, total] = await eventRepository.findAndCount({
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      if (events.length === 0) {
        logger.info("No events found.");
        return res.status(404).json({ message: "No events found." });
      }

      logger.info(`Retrieved ${events.length} events.`);
      res.json({
        data: events,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        logger.error("Error fetching events: " + error.message);
        return res.status(500).json({ message: "Database query failed." });
      }

      logger.error("Unexpected Error: " + error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  };
}

