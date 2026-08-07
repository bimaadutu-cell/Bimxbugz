import { NextRequest, NextResponse } from "next/server";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { announcements } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { memoryDB } from "@/lib/dbMemory";

export async function GET() {
  try {
    const dbStatus = getDbStatus();
    if (dbStatus.available && isDatabaseAvailable && db) {
      try {
        const [latest] = await db.select().from(announcements)
          .where(eq(announcements.isActive, true))
          .orderBy(desc(announcements.createdAt))
          .limit(1);
        if (latest) {
          return NextResponse.json({
            id: latest.id,
            message: latest.message,
            createdAt: latest.createdAt.toISOString(),
          });
        }
      } catch (e) {
        console.error("DB announcement GET failed, fallback:", e);
      }
    }

    const memAnn = await memoryDB.getLatestAnnouncement();
    if (!memAnn) return NextResponse.json(null);
    return NextResponse.json({
      id: memAnn.id,
      message: memAnn.message,
      createdAt: memAnn.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "developer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });

  const dbStatus = getDbStatus();
  if (dbStatus.available && isDatabaseAvailable && db) {
    try {
      const [ann] = await db.insert(announcements).values({ message: message.trim() }).returning();
      return NextResponse.json({
        id: ann.id,
        message: ann.message,
        createdAt: ann.createdAt.toISOString(),
      });
    } catch (e) {
      console.error("DB announcement POST failed, fallback:", e);
    }
  }

  const memAnn = await memoryDB.createAnnouncement(message.trim());
  return NextResponse.json({
    id: memAnn.id,
    message: memAnn.message,
    createdAt: memAnn.createdAt.toISOString(),
  });
}
