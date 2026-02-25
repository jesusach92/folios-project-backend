import jwt, { SignOptions } from "jsonwebtoken";
import { AuthPayload } from "../types";

const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || "24h";

export function generateToken(payload: AuthPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRATION as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  return parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : null;
}
