import { createLogger, format, transports } from "winston";

// Define log format
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/combined.log" }), // Log to a file
    new transports.File({ filename: "logs/errors.log", level: "error" }), // Separate file for errors
  ],
});

export default logger;
