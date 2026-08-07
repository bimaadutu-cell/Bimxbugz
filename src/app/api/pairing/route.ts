import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createWAConnection, getWAConnection, requestPairingCodeForExisting, disconnectWA } from "@/lib/waManager";

// POST - start new connection (QR or pairing)
export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const body = await req.json();
    const { phone, method } = body; // method: "qr" | "pairing"
    
    const connectionMethod = method === "pairing" ? "pairing" : "qr";
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : undefined;

    if (connectionMethod === "pairing" && !cleanPhone) {
      return NextResponse.json({ error: "Nomor WA wajib untuk pairing code" }, { status: 400 });
    }

    // Create real Baileys connection
    const waState = await createWAConnection(`${payload.userId}`, cleanPhone, connectionMethod);

    // Wait a bit for QR to generate
    await new Promise(r => setTimeout(r, 1500));

    const updated = getWAConnection(`${payload.userId}`);

    return NextResponse.json({
      method: connectionMethod,
      status: updated?.status || "connecting",
      qr: updated?.qr || null,
      qrImage: updated?.qrImage || null,
      pairingCode: updated?.pairingCode || null,
      phone: cleanPhone || null,
      isConnected: updated?.isConnected || false,
      message: connectionMethod === "qr" 
        ? "Scan QR code dengan WhatsApp: Setelan > Perangkat Tertaut > Tautkan Perangkat"
        : "Masukkan pairing code di WhatsApp: Setelan > Perangkat Tertaut > Tautkan dengan Nomor Telepon",
    });

  } catch (err: any) {
    console.error("Pairing error:", err);
    return NextResponse.json({ error: err.message || "Gagal membuat koneksi WA" }, { status: 500 });
  }
}

// GET - check status / poll
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const wa = getWAConnection(`${payload.userId}`);
    
    if (!wa) {
      return NextResponse.json({ 
        connected: false, 
        status: "idle",
        phone: null,
        qr: null,
        qrImage: null,
        pairingCode: null,
      });
    }

    return NextResponse.json({
      connected: wa.isConnected,
      status: wa.status,
      phone: wa.phone || null,
      qr: wa.qr || null,
      qrImage: wa.qrImage || null,
      pairingCode: wa.pairingCode || null,
      lastError: wa.lastError || null,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - disconnect
export async function DELETE(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    await disconnectWA(`${payload.userId}`);
    return NextResponse.json({ success: true, message: "WA disconnected" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH - request pairing code for existing QR session
export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "Nomor required" }, { status: 400 });

    const code = await requestPairingCodeForExisting(`${payload.userId}`, phone);
    return NextResponse.json({ pairingCode: code, phone: phone.replace(/[^0-9]/g, "") });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal request pairing code" }, { status: 500 });
  }
}
