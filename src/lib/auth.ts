import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.isLoggedIn) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== ("admin" as Role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function loginUser(userId: string, email: string, name: string, role: Role) {
  const session = await getSession();
  session.userId = userId;
  session.email = email;
  session.name = name;
  session.role = role;
  session.isLoggedIn = true;
  await session.save();
}

export async function logoutUser() {
  const session = await getSession();
  session.destroy();
}
