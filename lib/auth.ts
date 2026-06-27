import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbOperations } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "phonix_super_secret_jwt_key_2025";
const COOKIE_NAME = "phonix_session";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);

  if (!tokenCookie) {
    return null;
  }

  const payload = verifyToken(tokenCookie.value);
  if (!payload) {
    return null;
  }

  // Fetch fresh user data from database
  const user = await dbOperations.findUserByEmail(payload.email);
  if (!user) {
    return null;
  }

  return {
    id: user.id || user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/",
  });
}
