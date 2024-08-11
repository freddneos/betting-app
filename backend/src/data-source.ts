import "reflect-metadata";
import { DataSource } from "typeorm";
import { Event } from "./entities/Event";
import logger from "./utils/logger"; // Import the logger

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "betting_dashboard",
  synchronize: false, // Disable automatic schema synchronization in production
  logging: true, // Enable TypeORM logging
  entities: [Event],
  migrations: [],
  subscribers: [],
});

// Log database connection events
AppDataSource.initialize()
  .then(async () => {
    logger.info("Data Source has been initialized!");

    const eventRepository = AppDataSource.getRepository(Event);

    // Check if there are any events in the database
    const eventCount = await eventRepository.count();
    if (eventCount === 0) {
      logger.info("Seeding the database with initial events...");
      await eventRepository.save([
        { event_name: "Soccer: Team A vs. Team B", odds: 1.75 },
        { event_name: "Basketball: Team C vs. Team D", odds: 2.10 },
        { event_name: "Tennis: Player E vs. Player F", odds: 1.95 },
        { event_name: "Football: Team G vs. Team H", odds: 3.25 },
        { event_name: "Hockey: Team I vs. Team J", odds: 2.50 },
      ]);
      logger.info("Database seeded successfully.");
    } else {
      logger.info("Events already exist in the database. Skipping seeding.");
    }
  })
  .catch((error) => {
    logger.error("Error during Data Source initialization: " + error.message);
    process.exit(1); // Exit the process with a failure code
  });
