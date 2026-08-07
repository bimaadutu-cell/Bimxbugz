import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attackLogs } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  if (payload.role === "developer" || payload.role === "owner") {
    const logs = await db.select().from(attackLogs).orderBy(desc(attackLogs.createdAt)).limit(200);
    return NextResponse.json(logs);
  }

  const logs = await db.select().from(attackLogs)
    .where(eq(attackLogs.userId, payload.userId))
    .orderBy(desc(attackLogs.createdAt))
    .limit(50);
  return NextResponse.json(logs);
}
