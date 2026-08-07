import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, hashPassword } from "@/lib/auth";

function requireDev(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "developer") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  const dev = requireDev(req);
  if (!dev) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select({
    id: users.id,
    username: users.username,
    role: users.role,
    isActive: users.isActive,
    expiresAt: users.expiresAt,
    createdAt: users.createdAt,
  }).from(users).orderBy(users.createdAt);

  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const dev = requireDev(req);
  if (!dev) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username, password, role, durationDays } = await req.json();
  if (!username || !password || !role) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const hashed = await hashPassword(password);

  let expiresAt: Date | null = null;
  if (durationDays && durationDays !== -1) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(durationDays));
  }

  const [newUser] = await db.insert(users).values({
    username,
    password: hashed,
    role,
    expiresAt: expiresAt ?? undefined,
    isActive: true,
  }).returning({ id: users.id, username: users.username, role: users.role });

  return NextResponse.json(newUser);
}
