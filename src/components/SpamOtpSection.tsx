"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

interface Job {
  id: string;
  target: string;
  count: number;
  interval: number;
  services: string[];
  status: string;
  progress: number;
  totalAttempts: number;
  successAttempts: number;
  failedAttempts: number;
  logs: { time: string; service: string; message: string; status: string }[];
  createdAt: string;
}

const SERVICES = [
  { id: "gopay", label: "💚 GoPay", cat: "E-Wallet" },
  { id: "ovo", label: "💜 OVO", cat: "E-Wallet" },
  { id: "dana", label: "💙 DANA", cat: "E-Wallet" },
  { id: "shopeepay", label: "🧡 ShopeePay", cat: "E-Wallet" },
  { id: "linkaja", label: "❤️ LinkAja", cat: "E-Wallet" },
  { id: "facebook", label: "📘 Facebook", cat: "Social" },
  { id: "instagram", label: "📷 Instagram", cat: "Social" },
  { id: "whatsapp", label: "💬 WhatsApp", cat: "Social" },
  { id: "telegram", label: "✈️ Telegram", cat: "Social" },
  { id: "tiktok", label: "🎵 TikTok", cat: "Social" },
  { id: "shopee", label: "🛒 Shopee", cat: "Marketplace" },
  { id: "tokopedia", label: "💚 Tokopedia", cat: "Marketplace" },
  { id: "lazada", label: "💙 Lazada", cat: "Marketplace" },
  { id: "ml", label: "🎮 Mobile Legends", cat: "Games" },
  { id: "ff", label: "🔥 Free Fire", cat: "Games" },
  { id: "pubg", label: "🔫 PUBG", cat: "Games" },
  { id: "aov", label: "⚔️ AOV", cat: "Games" },
  { id: "codm", label: "💀 CODM", cat: "Games" },
  { id: "google", label: "🔍 Google", cat: "Other" },
];

export default function SpamOtpSection() {
  const { token, user } = useApp();
  const [target, setTarget] = useState("");
  const [count, setCount] = useState(15);
  const [interval, setIntervalVal] = useState(4);
  const [selectedServices, setSelectedServices] = useState<string[]>(["gopay","ovo","dana","shopee","whatsapp"]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/spam-otp", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const data = await res.json();
      if (res.ok) setJobs(data.jobs || []);
    } catch {}
  };

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => {
    // @ts-ignore
    const id = setInterval(() => fetchJobs(), 3000);
    return () => clearInterval(id as any);
  }, []);

  useEffect(() => {
    if (activeJobId) {
      // @ts-ignore
      const poll = setInterval(async () => {
        try {
          const res = await fetch(`/api/spam-otp/${activeJobId}`, { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          if (res.ok) {
            setJobs(prev => prev.map(j => j.id === activeJobId ? data : j));
            if (data.status === "completed" || data.status === "stopped") setActiveJobId(null);
          }
        } catch {}
      }, 2000);
      return () => clearInterval(poll as any);
    }
  }, [activeJobId]);

  if (user?.role === "user") {
    return (
      <div className="p-4 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="digital-font text-[#ff0040] text-lg font-extrabold mb-3">FITUR TERKUNCI</h2>
        <p className="text-white/60 text-sm mb-5">🔒 SPAM OTP KHUSUS RESELLER/OWNER. UPGRADE!</p>
        <a href="https://wa.me/6283115955196?text=Halo%20mau%20upgrade%20BimxBugz" target="_blank" className="inline-block bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] text-white px-6 py-3 rounded-xl font-bold text-sm">📞 UPGRADE</a>
      </div>
    );
  }

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const startSpam = async () => {
    if (!target.trim()) { setError("Nomor target wajib!"); return; }
    if (selectedServices.length === 0) { setError("Pilih minimal 1 layanan OTP!"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/spam-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ target, count, interval, services: selectedServices }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Gagal");
      else {
        setJobs(prev => [data.job, ...prev]);
        setActiveJobId(data.job.id);
        setTarget("");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const stopJob = async (id: string) => {
    await fetch(`/api/spam-otp/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
    setActiveJobId(null);
  };

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs.find(j => j.status === "running");

  const grouped = SERVICES.reduce((acc: any, s) => {
    if (!acc[s.cat]) acc[s.cat] = [];
    acc[s.cat].push(s);
    return acc;
  }, {});

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <div className="text-[44px] mb-2">🔐</div>
        <h2 className="digital-font text-[19px] font-black bg-gradient-to-br from-white to-[#ff0040] bg-clip-text text-transparent">BimxzBugxz Spam OTP V2 120FPS</h2>
        <p className="digital-font text-white/50 text-[9px] tracking-[1px] mt-1">SPAM OTP ALL PLATFORM • GOPAY • DANA • OVO • FB • GAMES • STOP KAPAN SAJA • BLACK RED</p>
      </div>

      <div className="bg-[rgba(255,0,64,0.08)] border border-[rgba(255,0,64,0.35)] rounded-[10px] p-3 mb-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff0040] rounded-l-[10px]" />
        <p className="text-[#ff5566] text-[11px] m-0 leading-[1.6] pl-2">⚠️ <strong className="text-white">KHUSUS PENIPU/SCAMMER!</strong> Spam OTP untuk bikin penipu kewalahan OTP. Bisa stop kapan saja dengan tombol STOP. Gunakan bertanggung jawab! Support e-wallet, sosmed, marketplace, games.</p>
      </div>

      <div className="glass-card-black-red rounded-xl p-5 mb-4">
        <label className="digital-font text-white text-[10px] tracking-[1px] block mb-2">NOMOR TARGET SPAM OTP (628xxxx)</label>
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder="6281234567890" className="w-full bg-black/70 border border-[rgba(255,0,64,0.35)] rounded-lg px-4 py-3 text-white text-[15px] tracking-[1px] mb-4" />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="digital-font text-white/70 text-[9px] block mb-1">JUMLAH SPAM (1-200)</label>
            <div className="flex items-center gap-2">
              <input type="range" min={5} max={100} value={count} onChange={e => setCount(parseInt(e.target.value))} className="flex-1 accent-[#ff0040]" />
              <span className="digital-font bg-black/60 border border-[#ff0040]/30 rounded px-2 py-1 text-white text-xs font-bold min-w-[45px] text-center">{count}x</span>
            </div>
          </div>
          <div>
            <label className="digital-font text-white/70 text-[9px] block mb-1">INTERVAL DETIK (2-30)</label>
            <div className="flex items-center gap-2">
              <input type="range" min={2} max={15} value={interval} onChange={e => setIntervalVal(parseInt(e.target.value))} className="flex-1 accent-[#ff0040]" />
              <span className="digital-font bg-black/60 border border-white/20 rounded px-2 py-1 text-white text-xs font-bold min-w-[45px] text-center">{interval}s</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="digital-font text-white/70 text-[9px]">PILIH LAYANAN OTP ({selectedServices.length} dipilih)</label>
            <div className="flex gap-1">
              <button onClick={() => setSelectedServices(SERVICES.map(s => s.id))} className="text-[8px] bg-white/10 border border-white/20 rounded px-2 py-1 text-white">ALL</button>
              <button onClick={() => setSelectedServices([])} className="text-[8px] bg-white/5 border border-white/10 rounded px-2 py-1 text-white/60">CLEAR</button>
            </div>
          </div>
          {Object.entries(grouped).map(([cat, services]: any) => (
            <div key={cat} className="mb-3">
              <p className="digital-font text-[#ff0040] text-[8px] tracking-[1px] mb-1.5">{cat.toUpperCase()}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {services.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className="text-left px-2.5 py-2 rounded-lg border text-[11px] transition-all"
                    style={{
                      background: selectedServices.includes(s.id) ? "linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.7))" : "rgba(0,0,0,0.4)",
                      borderColor: selectedServices.includes(s.id) ? "#ff0040" : "rgba(255,255,255,0.08)",
                      color: selectedServices.includes(s.id) ? "#fff" : "rgba(255,255,255,0.5)",
                      boxShadow: selectedServices.includes(s.id) ? "0 0 8px rgba(255,0,64,0.15)" : "none",
                    }}
                  >
                    {selectedServices.includes(s.id) ? "✅ " : "☐ "}{s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.4)] rounded-lg p-2.5 text-[#ff5566] text-xs mb-3 text-center">{error}</div>}

        <button onClick={startSpam} disabled={loading} className="btn-gas-black-red w-full rounded-xl py-4 text-white text-sm font-black tracking-[1px] disabled:opacity-50">
          {loading ? "⏳ MEMULAI SPAM..." : `🔐 GAS SPAM OTP ${count}x VIA ${selectedServices.length} LAYANAN — BLACK RED`}
        </button>
      </div>

      {activeJob && (
        <div className="glass-card-black-red rounded-xl p-4 mb-4 border-[1.5px] border-[#ff0040] shadow-[0_0_20px_rgba(255,0,64,0.2)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="digital-font text-white text-xs font-bold">🔴 LIVE SPAM OTP: {activeJob.target} — {activeJob.progress}%</h3>
            <button onClick={() => stopJob(activeJob.id)} className="bg-black border border-[#ff0040] rounded px-3 py-1.5 text-[#ff0040] text-[10px] font-bold shadow-[0_0_10px_rgba(255,0,64,0.2)]">⏹️ STOP SPAM</button>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 mb-3 overflow-hidden border border-[rgba(255,0,64,0.2)]">
            <div className="bg-gradient-to-r from-black via-[#ff0040] to-white h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#ff0040]" style={{ width: `${activeJob.progress}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Total", val: `${activeJob.totalAttempts}/${activeJob.count}` },
              { label: "Sukses", val: `${activeJob.successAttempts}`, color: "#00ff88" },
              { label: "Gagal", val: `${activeJob.failedAttempts}`, color: "#ff4466" },
            ].map(item => (
              <div key={item.label} className="bg-black/60 border border-[rgba(255,0,64,0.15)] rounded-lg p-2 text-center">
                <p className="digital-font text-white/40 text-[8px] m-0">{item.label}</p>
                <p className="text-xs font-bold m-0" style={{ color: (item as any).color || "#fff" }}>{item.val}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {activeJob.services.slice(0, 8).map((sid: string) => (
              <span key={sid} className="text-[8px] bg-[rgba(255,0,64,0.1)] border border-[rgba(255,0,64,0.2)] rounded px-1.5 py-0.5 text-[#ffaaaa]">{SERVICES.find(s => s.id === sid)?.label || sid}</span>
            ))}
            {activeJob.services.length > 8 && <span className="text-[8px] text-white/40">+{activeJob.services.length - 8} lainnya</span>}
          </div>
          <div className="max-h-[220px] overflow-y-auto scrollbar-hide bg-black/40 rounded-lg p-2 border border-white/5">
            {activeJob.logs.map((log: any, i: number) => (
              <p key={i} className="text-[11px] m-0 py-1 border-b border-white/5 last:border-0" style={{ color: log.status === "success" ? "#00ff88" : "#ff4466" }}>
                <span className="digital-font text-white/30 text-[9px]">[{log.time}]</span> {log.message}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card-black-white rounded-xl p-4">
        <h3 className="digital-font text-white text-xs font-bold mb-3">📋 RIWAYAT SPAM OTP ({jobs.length})</h3>
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto scrollbar-hide">
          {jobs.map(job => (
            <div key={job.id} className="bg-black/50 border border-white/5 border-l-2 border-l-[#ff0040] rounded-lg p-2.5">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="digital-font text-white text-[10px] font-bold m-0 truncate">🔐 {job.target} • {job.count}x • {job.services.length} layanan</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.services.slice(0, 4).map((sid: string) => (
                      <span key={sid} className="text-[7px] bg-black/60 border border-white/10 rounded px-1 py-0.5 text-white/50">{SERVICES.find(s => s.id === sid)?.label.split(" ")[0] || sid}</span>
                    ))}
                    {job.services.length > 4 && <span className="text-[7px] text-white/30">+{job.services.length - 4}</span>}
                  </div>
                  <p className="text-white/40 text-[9px] m-0 mt-1">{job.progress}% • {job.totalAttempts}/{job.count} • {new Date(job.createdAt).toLocaleTimeString("id-ID")}</p>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded ml-2 shrink-0" style={{ background: job.status === "running" ? "rgba(255,0,64,0.15)" : job.status === "completed" ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.1)", color: job.status === "running" ? "#ff0040" : job.status === "completed" ? "#00ff88" : "#fff", border: `1px solid ${job.status === "running" ? "rgba(255,0,64,0.3)" : "rgba(255,255,255,0.1)"}` }}>{job.status.toUpperCase()}</span>
              </div>
              {job.status === "running" && <button onClick={() => stopJob(job.id)} className="mt-2 w-full bg-gradient-to-br from-black to-[rgba(255,0,64,0.2)] border border-[#ff0040]/30 rounded px-2 py-1.5 text-[#ff0040] text-[9px] font-bold">⏹️ STOP SPAM OTP INI</button>}
            </div>
          ))}
          {jobs.length === 0 && <p className="text-white/30 text-xs text-center py-4">Belum ada spam OTP. Mulai spam pertama!</p>}
        </div>
      </div>
    </div>
  );
}
