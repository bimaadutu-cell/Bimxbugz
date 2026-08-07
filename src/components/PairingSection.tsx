"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export default function PairingSection() {
  const { token, setConnected, isConnected, connectedPhone } = useApp();
  const [phone, setPhone] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const startConnection = async () => {
    if (method === "pairing" && !phone.trim()) {
      setError("Masukkan nomor WA untuk pairing code!");
      return;
    }
    setError("");
    setLoading(true);
    setQrImage(null);
    setPairingCode(null);
    try {
      const res = await fetch("/api/pairing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: phone.replace(/[^0-9]/g, ""),
          method,
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
          // Wait a bit and poll for QR
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
      setError("Masukkan nomor WA dulu!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pairing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
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
          <img src="/logo-bimxz.png" alt="logo" style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid #ff0040", boxShadow: "0 0 12px #ff0040" }} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
          <h2 className="digital-font" style={{ color: "#ffffff", fontSize: "18px", fontWeight: "900", letterSpacing: "1px", textShadow: "0 0 10px #ff0040" }}>
            PAIRING WA V2 — REAL BAILEYS
          </h2>
        </div>
        <p className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "1px" }}>
          DUAL MODE: QR SCAN & PAIRING CODE — ASLI SERVER WHATSAPP
        </p>
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #ff0040, #fff, transparent)", margin: "10px auto", width: "80%", boxShadow: "0 0 8px #ff0040" }} />
      </div>

      {/* Method Selector - Dual Options */}
      {!isFullyConnected && (
        <div className="flex gap-2 mb-4">
          {[
            { id: "qr", label: "📷 QR SCAN", desc: "Scan QR asli WA" },
            { id: "pairing", label: "🔢 PAIRING CODE", desc: "Kode 8 digit" },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as any)}
              style={{
                flex: 1,
                padding: "12px 10px",
                borderRadius: "10px",
                border: method === m.id ? "1.5px solid #ff0040" : "1px solid rgba(255,255,255,0.1)",
                background: method === m.id 
                  ? "linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.8))"
                  : "rgba(0,0,0,0.4)",
                color: method === m.id ? "#ffffff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                textAlign: "center" as const,
                boxShadow: method === m.id ? "0 0 15px rgba(255,0,64,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: "800", margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: "10px", margin: "3px 0 0", opacity: 0.7 }}>{m.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Warning */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,0,64,0.08), rgba(0,0,0,0.6))",
        border: "1px solid rgba(255,0,64,0.3)",
        borderRadius: "10px",
        padding: "10px 12px",
        marginBottom: "18px",
        position: "relative",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "#ff0040", borderRadius: "10px 0 0 10px", boxShadow: "0 0 8px #ff0040" }} />
        <p className="digital-font" style={{ color: "#ff5566", fontSize: "10px", margin: 0, fontWeight: "600", lineHeight: 1.6, paddingLeft: "8px" }}>
          ⚠️ HARAP TAUTKAN NOMOR PENGIRIM WA DULU! Koneksi menggunakan Baileys @whiskeysockets v6.7.18 asli, terdeteksi rapi di daftar perangkat tertaut WA, 100% nyata terkirim ke server WA resmi bukan simulasi! Vercel-ready persistent auth!
        </p>
      </div>

      {/* Connection Status */}
      {isFullyConnected && (
        <div style={{
          borderRadius: "12px",
          padding: "24px",
          border: "1.5px solid #ff0040",
          background: "linear-gradient(135deg, rgba(255,0,64,0.1), rgba(0,0,0,0.8))",
          boxShadow: "0 0 30px rgba(255,0,64,0.2)",
          textAlign: "center",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "52px", marginBottom: "8px", filter: "drop-shadow(0 0 15px #ff0040)" }}>✅</div>
          <h3 className="digital-font" style={{ color: "#ffffff", fontSize: "16px", fontWeight: "800", marginBottom: "6px", textShadow: "0 0 10px #ff0040" }}>
            🟢 TERHUBUNG SUKSES! REAL BAILEYS
          </h3>
          <p style={{ color: "#ff0040", fontSize: "12px", marginBottom: "4px", fontWeight: "700" }}>
            Nomor: <span style={{ color: "#fff" }}>{connectedPhone || status?.phone || "Connected"}</span>
          </p>
          <p className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", marginBottom: "16px" }}>
            Sesi tersimpan aman di baileys_auth • Ter-enkripsi • Vercel persistent • Siap serang!
          </p>
          <div style={{
            background: "rgba(255,0,64,0.1)",
            border: "1px solid rgba(255,0,64,0.3)",
            borderRadius: "8px",
            padding: "8px",
            marginBottom: "14px",
          }}>
            <p className="digital-font" style={{ color: "#ffffff", fontSize: "10px", margin: 0, fontWeight: "600" }}>
              🛡️ REAL WA CONNECTED — SEMUA FITUR SERANGAN AKTIF! SIAP GAS!
            </p>
          </div>
          <button
            onClick={disconnect}
            style={{
              padding: "8px 20px",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "600",
            }}
          >
            🔌 CABUT KONEKSI & HAPUS SESI
          </button>
        </div>
      )}

      {/* QR Display */}
      {!isFullyConnected && method === "qr" && (qrImage || status?.qrImage) && (
        <div className="glass-card-black-red" style={{ borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "16px" }}>
          <p className="digital-font" style={{ color: "#ff0040", fontSize: "11px", marginBottom: "12px", letterSpacing: "1px", fontWeight: "700" }}>
            📷 SCAN QR CODE ASLI DARI SERVER WA:
          </p>
          <div style={{
            background: "#ffffff",
            padding: "12px",
            borderRadius: "12px",
            display: "inline-block",
            boxShadow: "0 0 25px rgba(255,0,64,0.5), 0 0 50px rgba(255,0,64,0.2)",
          }}>
            <img src={qrImage || status?.qrImage} alt="WA QR" style={{ width: 220, height: 220, display: "block" }} />
          </div>
          <div style={{
            background: "rgba(0,0,0,0.6)",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "16px",
            textAlign: "left",
          }}>
            <p style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", marginBottom: "8px" }}>📱 CARA SCAN (REAL):</p>
            {[
              "Buka WhatsApp di HP (pastikan update terbaru)",
              "Setelan → Perangkat Tertaut",
              "Klik 'Tautkan Perangkat'",
              "Arahkan kamera ke QR di atas",
              "Tunggu sampai status jadi CONNECTED",
            ].map((step, i) => (
              <p key={i} style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: "4px 0" }}>
                <span style={{ color: "#ff0040", fontWeight: "800" }}>{i + 1}.</span> {step}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff0040", animation: "blink-checkmark 1s infinite", boxShadow: "0 0 8px #ff0040" }} />
            <span className="digital-font" style={{ color: "#ff0040", fontSize: "10px" }}>POLLING REAL-TIME EVERY 2.5s — MENUNGGU SCAN...</span>
          </div>

          <button
            onClick={requestPairCode}
            disabled={!phone.trim()}
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "10px",
              background: phone.trim() ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: phone.trim() ? "#fff" : "rgba(255,255,255,0.3)",
              fontSize: "11px",
              fontWeight: "600",
              cursor: phone.trim() ? "pointer" : "not-allowed",
            }}
          >
            🔢 Atau request pairing code jika QR susah → isi nomor di bawah dulu
          </button>
        </div>
      )}

      {/* Pairing Code Display */}
      {!isFullyConnected && (method === "pairing" || pairingCode || status?.pairingCode) && (pairingCode || status?.pairingCode) && (
        <div className="glass-card-black-red text-center" style={{ borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <p className="digital-font" style={{ color: "#ffffff", fontSize: "11px", marginBottom: "12px", letterSpacing: "1px" }}>🔑 PAIRING CODE 8-DIGIT ASLI DARI SERVER WA:</p>
          <div
            style={{
              fontSize: "clamp(28px, 8vw, 38px)",
              fontWeight: "900",
              letterSpacing: "8px",
              color: "#ffffff",
              background: "linear-gradient(135deg, #000, #1a0005)",
              border: "2px solid #ff0040",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              fontFamily: "monospace",
              boxShadow: "0 0 25px rgba(255,0,64,0.4), inset 0 0 20px rgba(255,0,64,0.05)",
              textShadow: "0 0 15px #ff0040",
            }}
          >
            {pairingCode || status?.pairingCode}
          </div>

          <div style={{
            background: "rgba(255,0,64,0.06)",
            borderRadius: "8px",
            padding: "12px",
            textAlign: "left",
            border: "1px solid rgba(255,0,64,0.15)",
          }}>
            <p style={{ color: "#ff0040", fontSize: "11px", fontWeight: "700", marginBottom: "8px" }}>📱 CARA PAKAI PAIRING CODE (REAL BAILEYS):</p>
            {[
              "Buka WA → Setelan → Perangkat Tertaut",
              "Klik 'Tautkan Perangkat'",
              "Pilih 'Tautkan dengan nomor telepon' (di bawah)",
              "Masukkan 8 digit kode di atas",
              "HP akan otomatis terhubung dalam 5 detik!",
            ].map((step, i) => (
              <p key={i} style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "5px 0" }}>
                <span style={{ color: "#ff0040", fontWeight: "800" }}>{i + 1}.</span> {step}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff0040", animation: "blink-checkmark 1s infinite" }} />
            <span className="digital-font" style={{ color: "rgba(255,255,255,0.6)", fontSize: "9px" }}>KODE BERLAKU 60 DETIK — REQUEST ULANG JIKA EXPIRED</span>
          </div>
        </div>
      )}

      {/* Input Form - Show when not connected and no QR yet, or for pairing method */}
      {!isFullyConnected && !(method === "qr" && (qrImage || status?.qrImage)) && !(pairingCode || status?.pairingCode) && (
        <div className="glass-card-black-white" style={{ borderRadius: "12px", padding: "20px" }}>
          <label className="digital-font" style={{ color: "#ffffff", fontSize: "10px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            {method === "pairing" ? "NOMOR WA PENGIRIM UNTUK PAIRING CODE (628xxxxxxx)" : "NOMOR WA (OPSIONAL UNTUK QR — BISA LANGSUNG START)"}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={method === "pairing" ? "6281234567890 WAJIB" : "6281234567890 (opsional)"}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.6)",
              border: "1.5px solid rgba(255,0,64,0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#fff",
              fontSize: "15px",
              marginBottom: "14px",
              letterSpacing: "1px",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            }}
          />

          {error && (
            <div style={{
              background: "rgba(255,0,64,0.12)",
              border: "1px solid rgba(255,0,64,0.4)",
              borderRadius: "8px",
              padding: "10px",
              color: "#ff4466",
              fontSize: "12px",
              marginBottom: "12px",
              textAlign: "center",
            }}>
              {error}
            </div>
          )}

          <button
            onClick={startConnection}
            disabled={loading || (method === "pairing" && !phone.trim())}
            style={{
              width: "100%",
              background: loading
                ? "rgba(255,0,64,0.2)"
                : method === "pairing" && !phone.trim()
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg, #000, #ff0040)",
              border: "1.5px solid #ff0040",
              borderRadius: "10px",
              padding: "14px",
              color: loading || (method === "pairing" && !phone.trim()) ? "rgba(255,255,255,0.4)" : "#ffffff",
              fontSize: "13px",
              fontWeight: "800",
              cursor: loading || (method === "pairing" && !phone.trim()) ? "not-allowed" : "pointer",
              letterSpacing: "1px",
              boxShadow: loading ? "none" : "0 0 20px rgba(255,0,64,0.3)",
            }}
          >
            {loading ? "⏳ MEMBUAT SESI BAILEYS REAL..." : method === "qr" ? "📷 BUAT QR CODE ASLI — REAL BAILEYS" : "🔢 BUAT PAIRING CODE 8 DIGIT — REAL"}
          </button>

          <p className="digital-font" style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px", textAlign: "center", marginTop: "10px", lineHeight: 1.5 }}>
            Menggunakan @whiskeysockets/baileys v6.7.18<br />
            Real WA WebSocket • MultiFileAuthState • Vercel Ready • Bukan simulasi!
          </p>
        </div>
      )}

      {/* Phone input for QR mode when QR already shown */}
      {!isFullyConnected && method === "qr" && (qrImage || status?.qrImage) && (
        <div style={{ marginTop: "12px" }}>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="628xxx untuk pairing alternatif"
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 14px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
            <button
              onClick={requestPairCode}
              disabled={loading || !phone.trim()}
              style={{
                padding: "10px 14px",
                background: phone.trim() ? "linear-gradient(135deg, #1a0005, #ff0040)" : "rgba(255,255,255,0.05)",
                border: "1px solid #ff0040",
                borderRadius: "8px",
                color: phone.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                fontSize: "11px",
                fontWeight: "700",
                cursor: phone.trim() ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
              }}
            >
              🔢 COD
            </button>
          </div>
        </div>
      )}

      {/* Refresh */}
      {!isFullyConnected && (
        <button
          onClick={() => fetchStatus()}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "8px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          🔄 REFRESH STATUS REAL-TIME
        </button>
      )}
    </div>
  );
}
