import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createWAConnection, getWAConnection, requestPairingCodeForExisting, disconnectWA } from "@/lib/waManager";

// Helper to format international phone for display
function formatInternationalDisplay(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  if (!clean) return "";
  // Try to detect country and format as +[code][number]
  return `+${clean}`;
}

// POST - start new connection (QR or pairing) - WORLDWIDE
export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const body = await req.json();
    const { phone, method, formattedPhone, country } = body; // method: "qr" | "pairing"
    
    const connectionMethod = method === "pairing" ? "pairing" : "qr";
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : undefined;

    if (connectionMethod === "pairing" && !cleanPhone) {
      return NextResponse.json({ error: "Nomor WA wajib untuk pairing code - pilih negara & masukkan nomor!" }, { status: 400 });
    }

    if (cleanPhone && cleanPhone.length < 7) {
      return NextResponse.json({ error: "Nomor terlalu pendek! Minimal 7 digit untuk worldwide." }, { status: 400 });
    }

    if (cleanPhone && cleanPhone.length > 15) {
      return NextResponse.json({ error: "Nomor terlalu panjang! Maksimal 15 digit (format E.164 internasional)." }, { status: 400 });
    }

    // Create real Baileys connection - worldwide support
    const waState = await createWAConnection(`${payload.userId}`, cleanPhone, connectionMethod);

    // Wait a bit for QR to generate
    await new Promise(r => setTimeout(r, 1500));

    const updated = getWAConnection(`${payload.userId}`);

    const displayPhone = formattedPhone || (cleanPhone ? formatInternationalDisplay(cleanPhone) : null);

    return NextResponse.json({
      method: connectionMethod,
      status: updated?.status || "connecting",
      qr: updated?.qr || null,
      qrImage: updated?.qrImage || null,
      pairingCode: updated?.pairingCode || null,
      phone: cleanPhone || null,
      formattedPhone: displayPhone,
      country: country || null,
      isConnected: updated?.isConnected || false,
      worldwide: true,
      message: connectionMethod === "qr" 
        ? "Scan QR code dengan WhatsApp (negara mana saja): Setelan > Perangkat Tertaut > Tautkan Perangkat"
        : `Masukkan pairing code di WhatsApp: Setelan > Perangkat Tertaut > Tautkan dengan Nomor Telepon - Berlaku worldwide untuk ${displayPhone}`,
    });

  } catch (err: any) {
    console.error("Pairing error:", err);
    return NextResponse.json({ error: err.message || "Gagal membuat koneksi WA worldwide" }, { status: 500 });
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
        formattedPhone: null,
        qr: null,
        qrImage: null,
        pairingCode: null,
        worldwide: true,
      });
    }

    const formatted = wa.phone ? formatInternationalDisplay(wa.phone) : null;

    return NextResponse.json({
      connected: wa.isConnected,
      status: wa.status,
      phone: wa.phone || null,
      formattedPhone: formatted,
      qr: wa.qr || null,
      qrImage: wa.qrImage || null,
      pairingCode: wa.pairingCode || null,
      lastError: wa.lastError || null,
      worldwide: true,
      successMessage: wa.isConnected ? `✅ Pairing Berhasil! Nomor ${formatted} terhubung aktif & siap digunakan di seluruh dunia!` : null,
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
    return NextResponse.json({ success: true, message: "WA disconnected - bisa ganti nomor dunia baru" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH - request pairing code for existing QR session - worldwide
export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "Nomor required - pilih negara & nomor worldwide" }, { status: 400 });

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return NextResponse.json({ error: "Nomor worldwide harus 7-15 digit" }, { status: 400 });
    }

    const code = await requestPairingCodeForExisting(`${payload.userId}`, cleanPhone);
    return NextResponse.json({ 
      pairingCode: code, 
      phone: cleanPhone,
      formattedPhone: formatInternationalDisplay(cleanPhone),
      worldwide: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal request pairing code worldwide" }, { status: 500 });
  }
}
