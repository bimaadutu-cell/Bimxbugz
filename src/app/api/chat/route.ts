import { NextRequest, NextResponse } from "next/server";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { chatMessages } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { memoryDB } from "@/lib/dbMemory";

export async function GET() {
  try {
    const dbStatus = getDbStatus();
    if (dbStatus.available && isDatabaseAvailable && db) {
      try {
        const msgs = await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt)).limit(100);
        return NextResponse.json(msgs.reverse().map((m: any) => ({
          id: m.id,
          userId: m.userId,
          username: m.username,
          message: m.message,
          createdAt: m.createdAt.toISOString(),
        })));
      } catch (e) {
        console.error("DB chat GET failed, fallback:", e);
      }
    }

    // Fallback memory
    const memMsgs = await memoryDB.getChatMessages(100);
    return NextResponse.json(memMsgs.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      username: m.username,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });

  const dbStatus = getDbStatus();
  if (dbStatus.available && isDatabaseAvailable && db) {
    try {
      const [msg] = await db.insert(chatMessages).values({
        userId: payload.userId,
        username: payload.username,
        message: message.trim(),
      }).returning();
      return NextResponse.json({
        id: msg.id,
        userId: msg.userId,
        username: msg.username,
        message: msg.message,
        createdAt: msg.createdAt.toISOString(),
      });
    } catch (e) {
      console.error("DB chat POST failed, fallback memory:", e);
    }
  }

  // Fallback
  const memMsg = await memoryDB.createChatMessage(payload.userId, payload.username, message.trim());
  return NextResponse.json({
    id: memMsg.id,
    userId: memMsg.userId,
    username: memMsg.username,
    message: memMsg.message,
    createdAt: memMsg.createdAt.toISOString(),
  });
}
