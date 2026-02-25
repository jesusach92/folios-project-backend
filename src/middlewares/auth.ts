import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyToken } from "../config/jwt";
import { AuthPayload } from "../types";
import logger from "../config/logger";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    logger.warn("Missing authorization token", { path: req.path, ip: req.ip });
    res.status(401).json({ error: "Missing authorization token" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    logger.warn("Invalid or expired token", { path: req.path, ip: req.ip });
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = payload;
  logger.debug("User authenticated", { userId: payload.id, email: payload.email });
  next();
}

export function roleMiddleware(...allowedRoleIds: number[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      logger.warn("User not authenticated", { path: req.path });
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (!allowedRoleIds.includes(req.user.role_id)) {
      logger.warn("Insufficient permissions", {
        userId: req.user.id,
        userRoleId: req.user.role_id,
        allowedRoleIds,
        path: req.path
      });
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}

export function errorHandlingMiddleware(err: any, req: Request, res: Response, _next: NextFunction): void {
  logger.error("Unhandled error:", { error: err.message, stack: err.stack, path: req.path });

  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
}
