import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayload, Secret, SignOptions } from "jsonwebtoken"; // Import JwtPayload, Secret, and SignOptions
import process from "process"; // Import process

dotenv.config();

const jwtSecret: string = process.env.JWT_SECRET || "your-secret-key";
const jwtExpiresIn: any = process.env.JWT_EXPIRES_IN || "1h";

class jwtUtils {
  static generateToken(payload: object, options?: jwt.SignOptions): string {
    const signOptions: SignOptions = { ...options, expiresIn: jwtExpiresIn }; // Include expiresIn in options
    return jwt.sign(payload, jwtSecret as Secret, signOptions);
  }

  static verifyToken(token: string): JwtPayload {
    // Explicit return type annotation: JwtPayload
    return jwt.verify(token, jwtSecret) as JwtPayload; // You might still need assertion internally if jwt.verify's type is too broad
  }
}

export default jwtUtils;
