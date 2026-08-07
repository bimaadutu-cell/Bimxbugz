import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createSpamOtpJob, getUserSpamOtpJobs, OTP_SERVICES } from "@/lib/prankCallManager";

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    if (payload.role === "user") {
      return NextResponse.json({ error: "🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER!" }, { status: 403 });
    }

    const jobs = getUserSpamOtpJobs(payload.userId);
    return NextResponse.json({
      jobs: jobs.map((j: any) => ({
        ...j,
        createdAt: j.createdAt.toISOString(),
        stoppedAt: j.stoppedAt?.toISOString() || null,
      })),
      services: OTP_SERVICES,
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

    const { target, count, interval, services } = await req.json();

    if (!target || !target.trim()) {
      return NextResponse.json({ error: "Nomor target wajib diisi!" }, { status: 400 });
    }

    const cleanTarget = target.replace(/[^0-9]/g, "");
    if (cleanTarget.length < 10) {
      return NextResponse.json({ error: "Nomor tidak valid! Format: 628xxxx" }, { status: 400 });
    }

    const selectedServices = Array.isArray(services) && services.length > 0 ? services : ["gopay", "ovo", "dana", "shopee", "whatsapp"];

    const job = createSpamOtpJob(
      payload.userId,
      payload.username,
      cleanTarget,
      parseInt(count) || 10,
      parseInt(interval) || 5,
      selectedServices
    );

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        createdAt: job.createdAt.toISOString(),
      },
      message: `✅ Spam OTP ${job.count}x ke ${cleanTarget} via ${selectedServices.length} layanan dimulai!`,
    });
  } catch (err: any) {
    console.error("Spam OTP start error:", err);
    return NextResponse.json({ error: err.message || "Gagal memulai spam OTP" }, { status: 500 });
  }
}
