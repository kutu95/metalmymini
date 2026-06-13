import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Role } from "@/generated/prisma/client";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: Role;
  isLoggedIn: boolean;
}

function getSessionPassword(): string {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set and at least 32 characters");
    }
    return "dev-only-session-secret-change-me-32chars";
  }
  return password;
}

export function getSessionOptions() {
  return {
    password: getSessionPassword(),
    cookieName: "metalmymini_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax" as const,
    },
  };
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}
