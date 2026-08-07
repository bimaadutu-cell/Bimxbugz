import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const msgs = await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt)).limit(100);
  return NextResponse.json(msgs.reverse());
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });

  const [msg] = await db.insert(chatMessages).values({
    userId: payload.userId,
    username: payload.username,
    message: message.trim(),
  }).returning();

  return NextResponse.json(msg);
}
