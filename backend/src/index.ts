import express from "express";
import morgan from "morgan";
import logger from "./utils/logger"; // Import the logger
import { AppDataSource } from "./data-source";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 8083;

// Setup morgan to log requests using winston
app.use(
  morgan("combined", {
    stream: {
      write: (message:any) => logger.info(message.trim()),
    },
  })
);

app.use(express.json());
app.use(router);

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error during Data Source initialization: " + error.message);
    process.exit(1); // Exit the process with a failure code
  });
