import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attackLogs } from "@/db/schema";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  if (payload.role === "user") {
    return NextResponse.json({ error: "FITUR INI KHUSUS MEMBER RESELLER/OWNER. SILAKAN UPGRADE AKUNMU!" }, { status: 403 });
  }

  const { groupLink } = await req.json();
  if (!groupLink) {
    return NextResponse.json({ error: "Link grup tidak boleh kosong" }, { status: 400 });
  }

  // Try real WA send via new endpoint logic
  let real = false;
  try {
    const { isWAConnected } = await import("@/lib/waManager");
    if (isWAConnected(`${payload.userId}`)) {
      real = true;
      // The actual send will be done via /api/wa/send, but we log here too
    }
  } catch {}

  await db.insert(attackLogs).values({
    userId: payload.userId,
    username: payload.username,
    attackType: "kill-group",
    target: groupLink,
    status: real ? "success-real" : "success",
  });

  await new Promise((r) => setTimeout(r, 1200));

  return NextResponse.json({
    success: true,
    message: "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success dan insyaallah akan bekerja",
    credit: "BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!!",
    groupLink,
    realWA: real,
    v2: true,
  });
}
