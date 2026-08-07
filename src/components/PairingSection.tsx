"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import CountryPicker from "./CountryPicker";
import { Country, COUNTRIES, validateWhatsAppNumber, formatInternationalPhone } from "@/lib/countries";

export default function PairingSection() {
  const { token, setConnected, isConnected, connectedPhone } = useApp();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(COUNTRIES.find(c => c.code === "ID") || null);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [method, setMethod] = useState<"qr" | "pairing">("qr");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/pairing", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();
      setStatus(data);
      if (data.qrImage) setQrImage(data.qrImage);
      if (data.pairingCode) setPairingCode(data.pairingCode);
      if (data.connected) {
        setConnected(true, data.phone);
      }
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      const data = await fetchStatus();
      if (data?.connected) {
        setPolling(false);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [polling]);

  const handlePhoneChange = (newPhone: string, country: Country | null, isValid: boolean) => {
    setPhone(newPhone);
    if (country) setSelectedCountry(country);
    setIsPhoneValid(isValid);
  };

  const startConnection = async () => {
    if (method === "pairing" && !phone.trim()) {
      setError("Masukkan nomor WA untuk pairing code! Pilih negara dulu.");
      return;
    }
    const validation = validateWhatsAppNumber(phone);
    if (method === "pairing" && !validation.valid) {
      setError(`Nomor tidak valid: ${validation.message}`);
      return;
    }

    setError("");
    setLoading(true);
    setQrImage(null);
    setPairingCode(null);
    try {
      const cleanPhone = phone.replace(/[^0-9+]/g, "").replace(/\+/g, "");
      const res = await fetch("/api/pairing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: cleanPhone,
          method,
          country: selectedCountry,
          formattedPhone: validation.valid ? formatInternationalPhone(phone, selectedCountry || undefined) : phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat koneksi WA");
      } else {
        setStatus(data);
        if (data.qrImage) setQrImage(data.qrImage);
        if (data.pairingCode) setPairingCode(data.pairingCode);
        if (data.qr || data.pairingCode) {
          setPolling(true);
        }
        if (data.method === "qr" && !data.qrImage) {
          setTimeout(() => fetchStatus(), 1500);
          setPolling(true);
        }
      }
    } catch (e: any) {
      setError("Gagal terhubung: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const requestPairCode = async () => {
    if (!phone.trim()) {
      setError("Masukkan nomor WA dulu! Pilih negara & nomor.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const cleanPhone = phone.replace(/[^0-9+]/g, "").replace(/\+/g, "");
      const res = await fetch("/api/pairing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setPairingCode(data.pairingCode);
        setPolling(true);
      } else {
        setError(data.error);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await fetch("/api/pairing", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } finally {
      setConnected(false);
      setStatus(null);
      setQrImage(null);
      setPairingCode(null);
      setPolling(false);
      setPhone("");
    }
  };

  const isFullyConnected = isConnected || status?.connected;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/logo-bimxz.png" alt="logo" className="w-[42px] h-[42px] rounded-full border-2 border-[#ff0040] shadow-[0_0_12px_#ff0040]" onError={(e)=>{(e.target as HTMLImageElement).src="/icon.png"}} />
          <h2 className="digital-font text-white text-[16px] font-black tracking-[1px] drop-shadow-[0_0_10px_#ff0040]">PAIRING WA V2.1 ULTRA — WORLDWIDE</h2>
        </div>
        <p className="digital-font text-white/50 text-[9px] tracking-[1px]">🌍 SUPPORT SEMUA NEGARA — AUTO DETEKSI KODE NEGARA — REAL BAILEYS v6.7.18 — 120FPS</p>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#ff0040] via-white to-transparent my-2.5 w-4/5 mx-auto shadow-[0_0_8px_#ff0040]" />
        <p className="digital-font text-[#00ff88] text-[8px] tracking-[1px]">✅ +62 INDONESIA • +1 USA • +44 UK • +60 MY • +65 SG • +91 IN • SEMUA NEGARA WA</p>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: "qr", label: "📷 QR SCAN", desc: "Scan QR asli WA" },
          { id: "pairing", label: "🔢 PAIRING CODE", desc: "Kode 8 digit worldwide" },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id as any)}
            className="flex-1 p-3 rounded-[10px] border text-center transition-all"
            style={{
              borderColor: method === m.id ? "#ff0040" : "rgba(255,255,255,0.1)",
              background: method === m.id ? "linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.8))" : "rgba(0,0,0,0.4)",
              color: method === m.id ? "#fff" : "rgba(255,255,255,0.5)",
              boxShadow: method === m.id ? "0 0 15px rgba(255,0,64,0.3)" : "none",
            }}
          >
            <p className="text-xs font-extrabold m-0">{m.label}</p>
            <p className="text-[10px] mt-1 opacity-70 m-0">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[rgba(255,0,64,0.08)] to-black/60 border border-[rgba(255,0,64,0.3)] rounded-[10px] p-3 mb-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff0040] rounded-l-[10px] shadow-[0_0_8px_#ff0040]" />
        <p className="digital-font text-[#ff5566] text-[10px] m-0 font-semibold leading-[1.6] pl-2">
          🌍 WORLDWIDE PAIRING V2.1: Sistem pairing mendukung SEMUA NEGARA yang terdaftar di WhatsApp! Otomatis kenali kode negara (+62, +1, +44, +60, dll). Pairing pakai protokol resmi WA → kode asli bukan simulasi! Setelah pairing, semua fitur (Bug 2GB, Spam OTP, Prank Call, Kill Grup 999.999) jalan via nomor yang dipairing.
        </p>
      </div>

      {isFullyConnected && (
        <div className="rounded-xl p-6 border-[1.5px] border-[#ff0040] bg-gradient-to-br from-[rgba(255,0,64,0.1)] to-black/80 shadow-[0_0_30px_rgba(255,0,64,0.2)] text-center mb-4">
          <div className="text-[52px] mb-2 drop-shadow-[0_0_15px_#ff0040]">✅</div>
          <h3 className="digital-font text-white text-base font-extrabold mb-1.5 drop-shadow-[0_0_10px_#ff0040]">🟢 PAIRING BERHASIL! REAL BAILEYS WORLDWIDE</h3>
          <p className="digital-font text-white text-[11px] mb-1">✅ Pairing Berhasil! Nomor <span className="text-[#ff0040] font-bold"> {connectedPhone || status?.phone || status?.formattedPhone || "Connected"} </span> terhubung aktif & siap digunakan di seluruh dunia!</p>
          <p className="digital-font text-white/50 text-[9px] mb-4">Sesi tersimpan aman di baileys_auth • Terenkripsi • Vercel persistent • Siap serang ke seluruh dunia!</p>
          <div className="bg-[rgba(255,0,64,0.1)] border border-[rgba(255,0,64,0.3)] rounded-lg p-2 mb-3.5">
            <p className="digital-font text-white text-[10px] m-0 font-semibold">🛡️ REAL WA CONNECTED WORLDWIDE — SEMUA FITUR AKTIF! SIAP GAS KE NOMOR MANA SAJA!</p>
          </div>
          <button onClick={disconnect} className="px-5 py-2 bg-black/60 border border-white/20 rounded-lg text-white cursor-pointer text-[11px] font-semibold">🔌 CABUT KONEKSI & GANTI NOMOR DUNIA</button>
        </div>
      )}

      {!isFullyConnected && method === "qr" && (qrImage || status?.qrImage) && (
        <div className="glass-card-black-red rounded-xl p-5 text-center mb-4">
          <p className="digital-font text-[#ff0040] text-[11px] mb-3 tracking-[1px] font-bold">📷 SCAN QR CODE ASLI DARI SERVER WA — WORLDWIDE READY:</p>
          <div className="bg-white p-3 rounded-xl inline-block shadow-[0_0_25px_rgba(255,0,64,0.5),0_0_50px_rgba(255,0,64,0.2)]">
            <img src={qrImage || status?.qrImage} alt="WA QR" className="w-[220px] h-[220px] block" />
          </div>
          <div className="bg-black/60 rounded-lg p-3 mt-4 text-left">
            <p className="text-white text-[11px] font-bold mb-2">📱 CARA SCAN WORLDWIDE REAL:</p>
            {["Buka WhatsApp di HP (negara mana saja)", "Setelan → Perangkat Tertaut", "Klik 'Tautkan Perangkat'", "Arahkan kamera ke QR di atas", "Tunggu CONNECTED — siap pakai ke seluruh dunia!"].map((step, i) => (
              <p key={i} className="text-white/70 text-[11px] my-1"><span className="text-[#ff0040] font-extrabold">{i + 1}.</span> {step}</p>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-[#ff0040] animate-pulse shadow-[0_0_8px_#ff0040]" />
            <span className="digital-font text-[#ff0040] text-[10px]">POLLING REAL-TIME 2.5s — WORLDWIDE WAITING SCAN...</span>
          </div>
        </div>
      )}

      {!isFullyConnected && (method === "pairing" || pairingCode || status?.pairingCode) && (pairingCode || status?.pairingCode) && (
        <div className="glass-card-black-red text-center rounded-xl p-5 mb-4">
          <p className="digital-font text-white text-[11px] mb-3 tracking-[1px]">🔑 PAIRING CODE 8-DIGIT ASLI WORLDWIDE:</p>
          <div className="text-[28px] sm:text-[38px] font-black tracking-[8px] text-white bg-gradient-to-br from-black to-[#1a0005] border-2 border-[#ff0040] rounded-xl p-4 mb-4 font-mono shadow-[0_0_25px_rgba(255,0,64,0.4),inset_0_0_20px_rgba(255,0,64,0.05)] drop-shadow-[0_0_15px_#ff0040]">
            {pairingCode || status?.pairingCode}
          </div>
          <p className="digital-font text-[#00ff88] text-[11px] mb-3">✅ Pairing code untuk nomor <span className="text-white font-bold">{status?.formattedPhone || status?.phone || phone}</span> — berlaku di seluruh dunia!</p>
          <div className="bg-[rgba(255,0,64,0.06)] rounded-lg p-3 text-left border border-[rgba(255,0,64,0.15)]">
            <p className="text-[#ff0040] text-[11px] font-bold mb-2">📱 CARA PAKAI PAIRING CODE WORLDWIDE:</p>
            {["Buka WA → Setelan → Perangkat Tertaut", "Klik 'Tautkan Perangkat'", "Pilih 'Tautkan dengan nomor telepon'", "Masukkan 8 digit kode di atas", "HP otomatis terhubung — siap pakai worldwide!"].map((step, i) => (
              <p key={i} className="text-white/80 text-[11px] my-1"><span className="text-[#ff0040] font-extrabold">{i + 1}.</span> {step}</p>
            ))}
          </div>
        </div>
      )}

      {!isFullyConnected && !(method === "qr" && (qrImage || status?.qrImage)) && !(pairingCode || status?.pairingCode) && (
        <div className="glass-card-black-white rounded-xl p-5">
          <CountryPicker
            value={phone}
            onChange={handlePhoneChange}
            label={method === "pairing" ? "🌍 NOMOR WA PENGIRIM WORLDWIDE UNTUK PAIRING CODE" : "🌍 NOMOR WA (OPSIONAL UNTUK QR) — WORLDWIDE SUPPORT"}
            placeholder={method === "pairing" ? "812-3456-7890" : "812-3456-7890 (opsional)"}
          />

          {error && <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.4)] rounded-lg p-2.5 text-[#ff4466] text-xs mt-3 text-center">{error}</div>}

          <button
            onClick={startConnection}
            disabled={loading || (method === "pairing" && !isPhoneValid)}
            className="w-full mt-3.5 bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] rounded-[10px] p-3.5 text-white text-[13px] font-extrabold tracking-[1px] shadow-[0_0_20px_rgba(255,0,64,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ MEMBUAT SESI BAILEYS REAL WORLDWIDE..." : method === "qr" ? "📷 BUAT QR CODE ASLI WORLDWIDE — REAL BAILEYS" : "🔢 BUAT PAIRING CODE 8 DIGIT WORLDWIDE — REAL"}
          </button>

          <p className="digital-font text-white/30 text-[8px] text-center mt-2.5 leading-[1.5]">🌍 WORLDWIDE: +62 ID, +1 US, +44 UK, +60 MY, +65 SG, +91 IN, +966 SA, dll — semua negara WA!<br />@whiskeysockets/baileys v6.7.18 • Real WA WebSocket • Vercel Ready • Bukan simulasi!</p>
        </div>
      )}

      {!isFullyConnected && method === "qr" && (qrImage || status?.qrImage) && (
        <div className="mt-3">
          <CountryPicker value={phone} onChange={handlePhoneChange} label="🔄 Atau ganti ke pairing code worldwide — isi nomor:" placeholder="812-3456-7890" />
          <button onClick={requestPairCode} disabled={loading || !isPhoneValid} className="w-full mt-2 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white text-[11px] font-semibold disabled:opacity-30">🔢 REQUEST PAIRING CODE WORLDWIDE</button>
        </div>
      )}

      {!isFullyConnected && (
        <button onClick={() => fetchStatus()} className="w-full mt-3 p-2 bg-transparent border border-white/10 rounded-lg text-white/40 text-[10px] cursor-pointer">🔄 REFRESH STATUS REAL-TIME WORLDWIDE</button>
      )}
    </div>
  );
}
