import { NextRequest, NextResponse } from "next/server";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { memoryDB } from "@/lib/dbMemory";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = auth.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    let user: any = null;
    const dbStatus = getDbStatus();
    if (dbStatus.available && isDatabaseAvailable && db) {
      try {
        const [dbUser] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
        if (dbUser) user = dbUser;
      } catch (e) {
        console.error("DB me failed, fallback:", e);
      }
    }

    if (!user) {
      const memUser = await memoryDB.findUserById(payload.userId);
      if (memUser) user = memUser;
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Akun tidak aktif" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      expiresAt: user.expiresAt?.toISOString?.() ?? user.expiresAt?.toISOString?.() ?? (user.expiresAt ? new Date(user.expiresAt).toISOString() : null),
      profilePic: user.profilePic || null,
      createdAt: user.createdAt?.toISOString?.() ?? new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error - DB mungkin tidak tersedia, tapi fallback memory aktif" }, { status: 500 });
  }
}
