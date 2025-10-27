import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";

// The payload expected across the app (see authMiddleware)
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface DecodedToken extends JWTPayload {
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "24h") as SignOptions["expiresIn"]; // keep in sync with UserService default

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): DecodedToken {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const { userId, email, role, iat, exp } = decoded as JwtPayload &
    Partial<JWTPayload>;

  if (!userId || !email || !role) {
    throw new Error("Invalid token payload");
  }

  return { userId, email, role, iat, exp };
}

export function refreshToken(token: string): string {
  const decoded = jwt.verify(token, JWT_SECRET, {
    ignoreExpiration: true,
  }) as JwtPayload | string;

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const { userId, email, role } = decoded as JwtPayload & Partial<JWTPayload>;

  if (!userId || !email || !role) {
    throw new Error("Invalid token payload");
  }

  return generateToken({ userId, email, role });
}
