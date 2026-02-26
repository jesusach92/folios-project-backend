import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyToken } from "../config/jwt";
import { AuthPayload, UserRole } from "../types";
import { hasRole } from "../utils/authorization";
import logger from "../config/logger";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * RF-01: Authentication Middleware
 * 
 * Validates JWT token and enriches request with user context
 * Required for all protected endpoints
 * 
 * FLOW:
 * 1. Extract token from Authorization: Bearer <token> header
 * 2. Verify token signature and expiration
 * 3. Attach decoded payload (AuthPayload) to req.user
 * 4. Proceed to route handler
 */
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

/**
 * RF-01: Role-Based Authorization Middleware
 * 
 * Guards routes to only allow users with specific roles
 * Must be used AFTER authMiddleware
 * 
 * USAGE:
 * router.post(
 *   "/folios",
 *   authMiddleware,
 *   roleMiddleware(UserRole.ADMIN, UserRole.PLANNING),
 *   (req, res) => folioController.createFolio(req, res)
 * );
 * 
 * @param allowedRoles - One or more UserRole enum values
 * @returns middleware function
 */
export function roleMiddleware(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      logger.warn("User not authenticated", { path: req.path });
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (!hasRole(req.user, ...allowedRoles)) {
      logger.warn("Insufficient permissions", {
        userId: req.user.id,
        userRole: req.user.role_id,
        allowedRoles,
        path: req.path
      });
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}

/**
 * Global Error Handler Middleware
 * Catches and logs all unhandled errors
 */
export function errorHandlingMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error("Unhandled error:", {
    error: err.message,
    stack: err.stack,
    path: req.path
  });

  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
}

