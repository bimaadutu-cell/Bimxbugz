import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getSpamOtpJob, stopSpamOtpJob } from "@/lib/prankCallManager";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const { id } = await params;
    const job = getSpamOtpJob(id);
    
    if (!job) return NextResponse.json({ error: "Job tidak ditemukan" }, { status: 404 });
    if (job.userId !== payload.userId && payload.role !== "developer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      ...job,
      createdAt: job.createdAt.toISOString(),
      stoppedAt: job.stoppedAt?.toISOString() || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const { id } = await params;
    const stopped = stopSpamOtpJob(id, payload.userId);
    
    if (!stopped) return NextResponse.json({ error: "Gagal stop job atau tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true, message: "✅ Spam OTP dihentikan!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
