import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createPrankCallJob, getUserPrankCallJobs, PRANK_SCRIPTS } from "@/lib/prankCallManager";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    if (payload.role === "user") {
      return NextResponse.json({ error: "🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER!" }, { status: 403 });
    }

    const jobs = getUserPrankCallJobs(payload.userId);
    return NextResponse.json({
      jobs: jobs.map(j => ({
        ...j,
        createdAt: j.createdAt.toISOString(),
        stoppedAt: j.stoppedAt?.toISOString() || null,
      })),
      scripts: PRANK_SCRIPTS,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    if (payload.role === "user") {
      return NextResponse.json({ error: "🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER. UPGRADE AKUNMU!" }, { status: 403 });
    }

    const { target, count, interval, script, voice } = await req.json();

    if (!target || !target.trim()) {
      return NextResponse.json({ error: "Nomor target wajib diisi!" }, { status: 400 });
    }

    const cleanTarget = target.replace(/[^0-9]/g, "");
    if (cleanTarget.length < 10) {
      return NextResponse.json({ error: "Nomor tidak valid! Format: 628xxxx" }, { status: 400 });
    }

    const job = createPrankCallJob(
      payload.userId,
      payload.username,
      cleanTarget,
      parseInt(count) || 5,
      parseInt(interval) || 10,
      script || "police",
      voice || "male"
    );

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        createdAt: job.createdAt.toISOString(),
      },
      message: `✅ Prank call ${job.count}x ke ${cleanTarget} dimulai! Interval ${job.interval} detik`,
    });
  } catch (err: any) {
    console.error("Prank call start error:", err);
    return NextResponse.json({ error: err.message || "Gagal memulai prank call" }, { status: 500 });
  }
}
