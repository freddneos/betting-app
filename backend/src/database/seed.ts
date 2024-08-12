import { AppDataSource } from "./data-source";
import { Sport } from "../entities/Sport";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { UserBet } from "../entities/UserBet";
import argon2 from "argon2";
import logger from "../utils/logger";

async function tableExists(tableName: string): Promise<boolean> {
  const queryRunner = AppDataSource.createQueryRunner();
  const result = await queryRunner.query(`SELECT to_regclass('${tableName}')`);
  await queryRunner.release();
  return result[0].to_regclass !== null;
}

async function createTableIfNotExists(tableName: string, createTableSQL: string) {
  const queryRunner = AppDataSource.createQueryRunner();
  const isTableExists = await tableExists(tableName);
  if (!isTableExists) {
    logger.info(`Table ${tableName} does not exist. Creating table...`);
    await queryRunner.query(createTableSQL);
    logger.info(`Table ${tableName} has been created.`);
  }
  await queryRunner.release();
}

async function seed() {
  try {
    await AppDataSource.initialize();
    logger.info("Data Source has been initialized.");

    // Create Tables if they do not exist
    await createTableIfNotExists('sport', `
      CREATE TABLE sport (
        sport_id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        color VARCHAR NOT NULL,
        emoji VARCHAR NOT NULL,
        slug VARCHAR NOT NULL
      )
    `);

    await createTableIfNotExists('event', `
      CREATE TABLE event (
        event_id SERIAL PRIMARY KEY,
        event_name VARCHAR NOT NULL,
        odds INTEGER NOT NULL,  -- Use INTEGER for odds
        sport_id INTEGER REFERENCES sport(sport_id)
      )
    `);

    await createTableIfNotExists('user', `
      CREATE TABLE "user" (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        balance INTEGER NOT NULL,  -- Use INTEGER for balance
        jwt_token VARCHAR,
        last_login TIMESTAMP,
        last_bet TIMESTAMP
      )
    `);

    await createTableIfNotExists('user_bet', `
      CREATE TABLE user_bet (
        bet_id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES event(event_id),
        user_id INTEGER REFERENCES "user"(user_id),
        amount INTEGER NOT NULL  -- Use INTEGER for amount
      )
    `);

    // Seed Sports
    const sportRepository = AppDataSource.getRepository(Sport);
    const sportCount = await sportRepository.count();
    if (sportCount === 0) {
      const sportsData = [
        { name: "Soccer", color: "#34eb46", emoji: "⚽️", slug: "soccer" },
        { name: "Basketball", color: "#eb8f34", emoji: "🏀", slug: "basketball" },
        { name: "Tennis", color: "#34ebd8", emoji: "🎾", slug: "tennis" },
        { name: "Football", color: "#eb3434", emoji: "🏈", slug: "football" },
        { name: "Hockey", color: "#3483eb", emoji: "🏒", slug: "hockey" },
      ];
      await sportRepository.save(sportsData);
      logger.info("Sports have been seeded.");
    } else {
      logger.info("Sports table already contains data. Skipping seeding.");
    }

    // Seed Events
    const eventRepository = AppDataSource.getRepository(Event);
    const eventCount = await eventRepository.count();
    if (eventCount === 0) {
      const sports = await AppDataSource.getRepository(Sport).find();
      const eventsData = [
        { event_name: "Team A vs. Team B", odds: 175, sport: sports[0] },  // Example of odds as integer (1.75 -> 175)
        { event_name: "Team C vs. Team D", odds: 210, sport: sports[1] },
        { event_name: "Player E vs. Player F", odds: 195, sport: sports[2] },
        { event_name: "Team G vs. Team H", odds: 325, sport: sports[3] },
        { event_name: "Team I vs. Team J", odds: 250, sport: sports[4] },
      ];
      await eventRepository.save(eventsData);
      logger.info("Events have been seeded.");
    } else {
      logger.info("Events table already contains data. Skipping seeding.");
    }

    // Seed Users
    const userRepository = AppDataSource.getRepository(User);
    const userCount = await userRepository.count();
    if (userCount === 0) {
      const usersData = [
        {
          email: "user1@example.com",
          password: await argon2.hash("password123"),
          balance: 150,  // Example balance as integer (1.5 -> 150)
        },
        {
          email: "user2@example.com",
          password: await argon2.hash("password123"),
          balance: 200,  // Example balance as integer (2.0 -> 200)
        },
      ];
      await userRepository.save(usersData);
      logger.info("Users have been seeded.");
    } else {
      logger.info("Users table already contains data. Skipping seeding.");
    }

    // Seed UserBets
    const userBetRepository = AppDataSource.getRepository(UserBet);
    const userBetCount = await userBetRepository.count();
    if (userBetCount === 0) {
      const users = await AppDataSource.getRepository(User).find();
      const events = await AppDataSource.getRepository(Event).find();
      const userBetsData = [
        { event: events[0], user: users[0], amount: 10 },  
        { event: events[1], user: users[0], amount: 20 },  
        { event: events[2], user: users[1], amount: 30 },  
        { event: events[3], user: users[1], amount: 40 },  
      ];
      await userBetRepository.save(userBetsData);
      logger.info("UserBets have been seeded.");
    } else {
      logger.info("UserBets table already contains data. Skipping seeding.");
    }

    logger.info("Database seeding completed successfully.");
  } catch (error) {
    logger.error("Error during database seeding: " + (error as Error).message);
  } finally {
    await AppDataSource.destroy();
    logger.info("Data Source has been closed.");
  }
}

seed();
