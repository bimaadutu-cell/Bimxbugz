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
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="digital-font text-[#ff0040] text-lg font-extrabold mb-3">FITUR TERKUNCI — BLACK RED NEON ONE-KILL</h2>
        <p className="text-white/60 text-sm mb-5">🔒 KILL GROUP ONE-KILL KHUSUS RESELLER/OWNER. UPGRADE!</p>
        <a href="https://wa.me/6283115955196?text=Halo%20mau%20upgrade%20Kill%20Group%20One-Kill" target="_blank" className="inline-block bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] text-white px-6 py-3 rounded-xl font-bold text-sm">📞 UPGRADE KE RESELLER/OWNER</a>
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ attackType: "kill-group", groupLink }),
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server return HTML bukan JSON: ${text.slice(0, 300)} - Kemungkinan session WA belum pairing atau server error. Cek Vercel logs.`);
      }

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
      setError("❌ Gagal total: " + e.message);
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
          <div className="text-[46px] mb-2 filter drop-shadow-[0_0_15px_#ff0040]">💀</div>
          <h2 className="digital-font text-[20px] font-black bg-gradient-to-br from-white to-[#ff0040] bg-clip-text text-transparent">KILL GROUP V3 — ONE-KILL LANGSUNG TANGGUH PERMANEN</h2>
          <p className="digital-font text-white/50 text-[9px] tracking-[1px] mt-1">REAL BAILEYS PAYLOAD ONE-KILL • 30x HEAVY 100K CHARS • SUSPEND INSTAN • BLACK RED NEON</p>
        </div>

        <div className="bg-[rgba(255,0,64,0.08)] border border-[rgba(255,0,64,0.35)] rounded-[10px] p-3 mb-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff0040] rounded-l-[10px]" />
          <p className="text-[#ff5566] text-[11px] m-0 leading-[1.6] pl-2">⚠️ <strong className="text-white">ONE-KILL V3 UPGRADE:</strong> Sekarang 30x payload 100K+ chars invisible (total 3 JUTA+ chars) dikirim rapid 0.3s interval — langsung overload server WA grup & auto-terdeteksi sebagai spam berat → suspend permanen INSTAN! Real Baileys v6.7.18, bukan simulasi!</p>
        </div>

        <div className="glass-card-black-red rounded-xl p-5">
          <label className="digital-font text-white text-[10px] tracking-[1px] block mb-2">MASUKKAN LINK UNDANGAN GRUP WA TARGET — ONE-KILL REAL</label>
          <input value={groupLink} onChange={e => setGroupLink(e.target.value)} placeholder="https://chat.whatsapp.com/xxxxxxxxxx — wajib real" className="w-full bg-black/70 border border-[rgba(255,0,64,0.35)] rounded-lg px-4 py-3 text-white text-[13px] mb-3.5" />

          {error && <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.45)] rounded-lg p-3 text-[#ff4466] text-xs mb-3.5 text-left leading-[1.5] whitespace-pre-wrap break-words">{error}</div>}

          <button onClick={handleKill} disabled={loading} className="btn-gas-black-red w-full rounded-xl py-4 text-white text-sm font-black tracking-[1px] disabled:opacity-70">
            {loading ? "⏳ MENGIRIM ONE-KILL PAYLOAD 30x 100K CHARS REAL WA..." : "🔥 GAS TEKAN TOMBOL INI MBUD — ONE-KILL LANGSUNG TANGGUH PERMANEN 💀☠️"}
          </button>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: "🎯", label: "One-Kill", val: "30x 100K" },
              { icon: "⚡", label: "Rapid", val: "0.3s interval" },
              { icon: "💀", label: "Suspend", val: "Permanen" },
            ].map(item => (
              <div key={item.label} className="bg-black/60 border border-[rgba(255,0,64,0.15)] rounded-lg p-2 text-center">
                <div className="text-sm">{item.icon}</div>
                <p className="digital-font text-[#ff0040] text-[8px] m-1 font-bold">{item.label}</p>
                <p className="text-white/60 text-[8px] m-0">{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: "💀", title: "One-Kill V3", desc: "30x payload 100K+ chars = 3 JUTA+ chars invisible, kirim 0.3s interval, grup langsung overload & suspend!" },
            { icon: "👻", title: "Invisible Total", desc: "Semua pakai ZWSP, ZWNJ, ZWJ 10k+ — admin & anggota tidak lihat sama sekali!" },
            { icon: "⚡", title: "Real Baileys v6.7.18", desc: "Asli server WA resmi, terdeteksi rapi di perangkat tertaut, bukan simulasi!" },
            { icon: "♾️", title: "Suspend Permanen", desc: "WA system auto-detect sebagai heavy spam/corruption → grup mati total tidak bisa balik!" },
          ].map((item) => (
            <div key={item.title} className="bg-black/50 border border-white/5 border-l-2 border-l-[#ff0040] rounded-[10px] p-3">
              <div className="text-base mb-1">{item.icon}</div>
              <p className="digital-font text-white text-[9px] font-bold m-0 mb-1">{item.title}</p>
              <p className="text-white/45 text-[9px] m-0 leading-[1.4]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
