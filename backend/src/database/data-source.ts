import "reflect-metadata";
import { DataSource } from "typeorm";
import { Sport } from "../entities/Sport";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { UserBet } from "../entities/UserBet";
import logger from "../utils/logger"; // Import the logger

// Load environment variables from a .env file if available
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "betting_dashboard",
  synchronize: process.env.DB_SYNCHRONIZE === "true", 
  logging: process.env.DB_LOGGING === "true", 
  entities: [Sport, Event, User, UserBet],
  migrations: ["src/database/migrations/*.ts"],  // Ensure this matches your migration path
  subscribers: [],
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((error) => {
    logger.error("Error during Data Source initialization: " + error.message);
    process.exit(1); // Exit the process with a failure code
  });
