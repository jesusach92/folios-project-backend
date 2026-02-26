import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { initializeDatabase, closeDatabaseConnection } from "./config/database";
import { errorHandlingMiddleware } from "./middlewares/auth";
import logger from "./config/logger";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import clientRoutes from "./routes/clients.routes";
import projectRoutes from "./routes/projects.routes";
import sectionRoutes from "./routes/sections.routes";
import folioRoutes from "./routes/folios.routes";
import processRoutes from "./routes/processes.routes";
import demoRoutes from "./routes/demo.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});



app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/folios", folioRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/processes", processRoutes);
app.use("/api/admin/demo", demoRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandlingMiddleware);

export { app, initializeDatabase, closeDatabaseConnection };
