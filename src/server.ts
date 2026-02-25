import { app, initializeDatabase, closeDatabaseConnection } from "./app";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    await initializeDatabase();
    logger.info("Database initialized successfully");

    app.listen(PORT, () => {
      logger.info(`✓ Server running on http://localhost:${PORT}`);
      logger.info(`✓ Health check: http://localhost:${PORT}/health`);
    });

    process.on("SIGINT", async () => {
      logger.info("Shutting down gracefully...");
      await closeDatabaseConnection();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("Shutting down gracefully...");
      await closeDatabaseConnection();
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
