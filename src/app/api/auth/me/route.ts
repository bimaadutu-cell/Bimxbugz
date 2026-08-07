import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

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
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Akun tidak aktif" }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      expiresAt: user.expiresAt?.toISOString() ?? null,
      profilePic: user.profilePic,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
