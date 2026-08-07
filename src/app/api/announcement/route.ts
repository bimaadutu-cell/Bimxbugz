import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const [latest] = await db.select().from(announcements)
    .where(eq(announcements.isActive, true))
    .orderBy(desc(announcements.createdAt))
    .limit(1);
  return NextResponse.json(latest ?? null);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "developer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });

  const [ann] = await db.insert(announcements).values({ message: message.trim() }).returning();
  return NextResponse.json(ann);
}
