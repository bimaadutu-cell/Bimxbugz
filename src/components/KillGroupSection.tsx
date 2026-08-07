"use client";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import SuccessNotification from "./SuccessNotification";
import LockedFeature from "./LockedFeature";

export default function KillGroupSection() {
  const { token, user } = useApp();
  const [groupLink, setGroupLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLocked, setShowLocked] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<any>(null);

  if (user?.role === "user") {
    return (
      <div className="p-4 max-w-lg mx-auto text-center">
        <div style={{ fontSize: "80px", marginBottom: "16px", filter: "drop-shadow(0 0 20px #ff0040)" }}>🔒</div>
        <h2 className="digital-font" style={{ color: "#ff0040", fontSize: "18px", fontWeight: "800", marginBottom: "12px", textShadow: "0 0 10px #ff0040" }}>
          FITUR TERKUNCI — BLACK RED NEON
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "20px", lineHeight: 1.6 }}>
          🔒 FITUR INI KHUSUS MEMBER RESELLER/OWNER.<br />
          SILAKAN UPGRADE AKUNMU UNTUK BUKA KEKUATAN KILL GROUP MAUT V2!
        </p>
        <a
          href={`https://wa.me/6283115955196?text=${encodeURIComponent("Halo Admin BimzOfficial, saya ingin info upgrade role & pembelian akun BimxzBugxz Kill Group")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #000, #ff0040)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "800",
            fontSize: "13px",
            border: "1.5px solid #ff0040",
            boxShadow: "0 0 20px rgba(255,0,64,0.4)",
          }}
        >
          📞 UPGRADE KE RESELLER/OWNER
        </a>
      </div>
    );
  }

  const handleKill = async () => {
    if (!groupLink.trim()) { setError("Link grup tidak boleh kosong!"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/wa/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attackType: "kill-group", groupLink }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "NOT_CONNECTED") {
          setError(`❌ ${data.error}`);
        } else if (res.status === 403) {
          setShowLocked(true);
        } else {
          setError(data.error || "Gagal mengirim serangan group");
        }
      } else {
        setLastResult(data);
        setShowSuccess(true);
        setGroupLink("");
      }
    } catch (e: any) {
      setError("Gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccess && <SuccessNotification onClose={() => setShowSuccess(false)} message={lastResult?.message} />}
      {showLocked && <LockedFeature onClose={() => setShowLocked(false)} />}

      <div className="p-4 max-w-lg mx-auto">
        <div className="text-center mb-5">
          <div style={{ fontSize: "46px", marginBottom: "8px", filter: "drop-shadow(0 0 15px #ff0040)" }}>💀</div>
          <h2 className="digital-font" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #ff0040 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "20px",
            fontWeight: "900",
            letterSpacing: "1px",
            filter: "drop-shadow(0 0 10px rgba(255,0,64,0.5))",
          }}>
            KILL GROUP V2 — INVISIBLE BUG
          </h2>
          <p className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", letterSpacing: "1px", marginTop: "4px" }}>
            REAL BAILEYS PAYLOAD • TAK KASAT MATA • SUSPEND PERMANENT • BLACK RED NEON
          </p>
        </div>

        {/* Warning */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,0,64,0.08), rgba(0,0,0,0.7))",
          border: "1px solid rgba(255,0,64,0.35)",
          borderRadius: "10px",
          padding: "12px",
          marginBottom: "16px",
          position: "relative",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: "#ff0040", borderRadius: "10px 0 0 10px", boxShadow: "0 0 8px #ff0040" }} />
          <p style={{ color: "#ff5566", fontSize: "11px", margin: 0, lineHeight: 1.6, paddingLeft: "8px" }}>
            ⚠️ <strong style={{ color: "#fff" }}>REAL WA GROUP KILL V2.</strong> Menggunakan Baileys asli — payload invisible 10k+ chars (ZWSP, ZWNJ, zero-width) yang tidak terlihat admin/anggota tapi membebani server WA hingga grup auto-terdeteksi & suspend permanen oleh sistem WA. 100% real, bukan dummy!
          </p>
        </div>

        <div className="glass-card-black-red" style={{ borderRadius: "12px", padding: "20px" }}>
          <label className="digital-font" style={{ color: "#ffffff", fontSize: "10px", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
            MASUKKAN LINK UNDANGAN GRUP WA TARGET — REAL BAILEYS
          </label>
          <input
            type="text"
            value={groupLink}
            onChange={(e) => setGroupLink(e.target.value)}
            placeholder="https://chat.whatsapp.com/xxxxxxxxxx — wajib real"
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.7)",
              border: "1.5px solid rgba(255,0,64,0.35)",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#fff",
              fontSize: "13px",
              marginBottom: "14px",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            }}
          />

          {error && (
            <div style={{
              background: "rgba(255,0,64,0.12)",
              border: "1px solid rgba(255,0,64,0.45)",
              borderRadius: "8px",
              padding: "10px",
              color: "#ff4466",
              fontSize: "12px",
              marginBottom: "14px",
              textAlign: "center",
              boxShadow: "0 0 10px rgba(255,0,64,0.15)",
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleKill}
            disabled={loading}
            className="btn-gas-black-red"
            style={{
              width: "100%",
              borderRadius: "12px",
              padding: "16px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "900",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "1px",
              opacity: loading ? 0.7 : 1,
              textShadow: "0 0 10px rgba(255,255,255,0.8)",
            }}
          >
            {loading ? "⏳ MENGIRIM INVISIBLE PAYLOAD REAL WA..." : "🔥 GAS TEKAN TOMBOL INI MBUD — KILL GROUP REAL 💀"}
          </button>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: "🎯", label: "Real Group JID", val: "Auto extract" },
              { icon: "👻", label: "Invisible", val: "10k+ ZWSP" },
              { icon: "♾️", label: "Permanent", val: "WA suspend" },
            ].map(item => (
              <div key={item.label} style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,0,64,0.15)",
                borderRadius: "8px",
                padding: "8px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "14px" }}>{item.icon}</div>
                <p className="digital-font" style={{ color: "#ff0040", fontSize: "8px", margin: "4px 0 2px", fontWeight: "700" }}>{item.label}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "8px", margin: 0 }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: "👻", title: "Tak Kasat Mata V2", desc: "10k+ invisible chars ZWSP/ZWNJ/ZWJ tidak terlihat sama sekali" },
            { icon: "♾️", title: "Suspend Permanen", desc: "Grup terdeteksi heavy corruption & di-suspend WA sistem permanen" },
            { icon: "🚀", title: "Real Baileys v6.7.18", desc: "Asli @whiskeysockets, bukan simulasi, konek langsung server WA resmi" },
            { icon: "🛡️", title: "Anti-Detect", desc: "Payload korup tapi invisible, admin tidak tahu sumber serangan" },
          ].map((item) => (
            <div key={item.title} style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "2px solid #ff0040",
              borderRadius: "10px",
              padding: "11px",
            }}>
              <div style={{ fontSize: "16px", marginBottom: "3px" }}>{item.icon}</div>
              <p className="digital-font" style={{ color: "#ffffff", fontSize: "9px", fontWeight: "700", margin: "0 0 3px" }}>{item.title}</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
