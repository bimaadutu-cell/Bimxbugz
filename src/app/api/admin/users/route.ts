import { NextRequest, NextResponse } from "next/server";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, hashPassword } from "@/lib/auth";
import { memoryDB } from "@/lib/dbMemory";

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

  const dbStatus = getDbStatus();
  if (dbStatus.available && isDatabaseAvailable && db) {
    try {
      const all = await db.select({
        id: users.id,
        username: users.username,
        role: users.role,
        isActive: users.isActive,
        expiresAt: users.expiresAt,
        createdAt: users.createdAt,
      }).from(users).orderBy(users.createdAt);
      return NextResponse.json(all.map((u: any) => ({
        ...u,
        expiresAt: u.expiresAt?.toISOString() || null,
        createdAt: u.createdAt.toISOString(),
      })));
    } catch (e) {
      console.error("DB users GET failed, fallback:", e);
    }
  }

  // Fallback memory
  const memUsers = await memoryDB.getAllUsers();
  return NextResponse.json(memUsers.map((u: any) => ({
    id: u.id,
    username: u.username,
    role: u.role,
    isActive: u.isActive,
    expiresAt: u.expiresAt?.toISOString() || null,
    createdAt: u.createdAt.toISOString(),
  })));
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

  const dbStatus = getDbStatus();
  if (dbStatus.available && isDatabaseAvailable && db) {
    try {
      const [newUser] = await db.insert(users).values({
        username,
        password: hashed,
        role,
        expiresAt: expiresAt ?? undefined,
        isActive: true,
      }).returning({ id: users.id, username: users.username, role: users.role });
      return NextResponse.json(newUser);
    } catch (e: any) {
      console.error("DB users POST failed, fallback memory:", e);
      if (e.message?.includes("unique") || e.message?.includes("duplicate")) {
        return NextResponse.json({ error: "Username sudah ada!" }, { status: 400 });
      }
    }
  }

  // Fallback memory
  try {
    const existing = await memoryDB.findUserByUsername(username);
    if (existing) {
      return NextResponse.json({ error: "Username sudah ada!" }, { status: 400 });
    }
    const memUser = await memoryDB.createUser(username, hashed, role, expiresAt);
    return NextResponse.json({ id: memUser.id, username: memUser.username, role: memUser.role });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
