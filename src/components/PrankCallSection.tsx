"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

interface Job {
  id: string;
  target: string;
  count: number;
  interval: number;
  script: string;
  voice: string;
  status: string;
  progress: number;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  logs: { time: string; message: string; status: string }[];
  createdAt: string;
}

const SCRIPTS = [
  { id: "police", label: "👮 Polisi - Laporan penipuan" },
  { id: "prize", label: "🎉 Menang Hadiah 100jt" },
  { id: "bank", label: "🏦 Bank - Akun terblokir" },
  { id: "delivery", label: "📦 Kurir - Paket tertahan" },
  { id: "family", label: "👨‍👩‍👧 Keluarga - Minta transfer" },
  { id: "telecom", label: "📱 Operator - Bonus pulsa" },
  { id: "scammer_reverse", label: "💀 Reverse Scam - Kena BimxBugz" },
  { id: "ghost", label: "👻 Horor - Suara hantu" },
  { id: "loan", label: "💸 Pinjol - Tagihan" },
];

export default function PrankCallSection() {
  const { token, user } = useApp();
  const [target, setTarget] = useState("");
  const [count, setCount] = useState(5);
  const [interval, setInterval] = useState(10);
  const [script, setScript] = useState("police");
  const [voice, setVoice] = useState("male");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/prank-call", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) setJobs(data.jobs || []);
    } catch {}
  };

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => {
    // @ts-ignore
    const intervalId = setInterval(() => { fetchJobs(); }, 3000);
    return () => clearInterval(intervalId as any);
  }, []);

  useEffect(() => {
    if (activeJobId) {
      // @ts-ignore
      const poll = setInterval(async () => {
        try {
          const res = await fetch(`/api/prank-call/${activeJobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setJobs(prev => prev.map(j => j.id === activeJobId ? data : j));
            if (data.status === "completed" || data.status === "stopped") {
              setActiveJobId(null);
            }
          }
        } catch {}
      // @ts-ignore
      }, 2000);
      return () => clearInterval(poll as any);
    }
  }, [activeJobId]);

  if (user?.role === "user") {
    return (
      <div className="p-4 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="digital-font text-[#ff0040] text-lg font-extrabold mb-3">FITUR TERKUNCI</h2>
        <p className="text-white/60 text-sm mb-5">🔒 FITUR PRANK CALL KHUSUS RESELLER/OWNER. UPGRADE AKUNMU!</p>
        <a href="https://wa.me/6283115955196?text=Halo%20Admin%20mau%20upgrade%20BimxBugz" target="_blank" className="inline-block bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] text-white px-6 py-3 rounded-xl font-bold text-sm">📞 UPGRADE</a>
      </div>
    );
  }

  const startPrank = async () => {
    if (!target.trim()) { setError("Nomor target wajib!"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/prank-call", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ target, count, interval, script, voice }),
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
    await fetch(`/api/prank-call/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
    setActiveJobId(null);
  };

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs.find(j => j.status === "running");

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <div className="text-[44px] mb-2">📞</div>
        <h2 className="digital-font text-[20px] font-black bg-gradient-to-br from-white to-[#ff0040] bg-clip-text text-transparent">BimxBugz Prank Call V2 120FPS</h2>
        <p className="digital-font text-white/50 text-[9px] tracking-[1px] mt-1">PRANK CALL REAL • ATUR JUMLAH • VOICE & SCRIPT • STOP KAPAN SAJA • BLACK RED</p>
      </div>

      <div className="bg-[rgba(255,0,64,0.08)] border border-[rgba(255,0,64,0.35)] rounded-[10px] p-3 mb-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff0040] rounded-l-[10px]" />
        <p className="text-[#ff5566] text-[11px] m-0 leading-[1.6] pl-2">⚠️ <strong className="text-white">KHUSUS PENIPU/SCAMMER!</strong> Fitur prank call ini untuk ngerjain penipu biar kapok. Gunakan dengan tanggung jawab. Jika ada Twilio credentials di env, akan call real, jika tidak simulasi log.</p>
      </div>

      <div className="glass-card-black-red rounded-xl p-5 mb-4">
        <label className="digital-font text-white text-[10px] tracking-[1px] block mb-2">NOMOR TARGET PRANK CALL (628xxxx)</label>
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder="6281234567890" className="w-full bg-black/70 border border-[rgba(255,0,64,0.35)] rounded-lg px-4 py-3 text-white text-[15px] tracking-[1px] mb-4" />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="digital-font text-white/70 text-[9px] block mb-1">JUMLAH PRANK (1-100)</label>
            <div className="flex items-center gap-2">
              <input type="range" min={1} max={50} value={count} onChange={e => setCount(parseInt(e.target.value))} className="flex-1 accent-[#ff0040]" />
              <span className="digital-font bg-black/60 border border-[#ff0040]/30 rounded px-2 py-1 text-white text-xs font-bold min-w-[40px] text-center">{count}x</span>
            </div>
          </div>
          <div>
            <label className="digital-font text-white/70 text-[9px] block mb-1">INTERVAL DETIK (3-60)</label>
            <div className="flex items-center gap-2">
              <input type="range" min={3} max={30} value={interval} onChange={e => setInterval(parseInt(e.target.value))} className="flex-1 accent-[#ff0040]" />
              <span className="digital-font bg-black/60 border border-white/20 rounded px-2 py-1 text-white text-xs font-bold min-w-[40px] text-center">{interval}s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="digital-font text-white/70 text-[9px] block mb-1">SCRIPT PRANK</label>
            <select value={script} onChange={e => setScript(e.target.value)} className="w-full bg-black/70 border border-white/15 rounded-lg px-3 py-2.5 text-white text-xs">
              {SCRIPTS.map(s => <option key={s.id} value={s.id} className="bg-black text-white">{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="digital-font text-white/70 text-[9px] block mb-1">VOICE TYPE</label>
            <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full bg-black/70 border border-white/15 rounded-lg px-3 py-2.5 text-white text-xs">
              <option value="male" className="bg-black">👨 Male</option>
              <option value="female" className="bg-black">👩 Female</option>
              <option value="robot" className="bg-black">🤖 Robot</option>
              <option value="ghost" className="bg-black">👻 Ghost</option>
            </select>
          </div>
        </div>

        {error && <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.4)] rounded-lg p-2.5 text-[#ff5566] text-xs mb-3 text-center">{error}</div>}

        <button onClick={startPrank} disabled={loading} className="btn-gas-black-red w-full rounded-xl py-4 text-white text-sm font-black tracking-[1px] disabled:opacity-50">
          {loading ? "⏳ MEMULAI PRANK..." : `📞 GAS PRANK CALL ${count}x — INTERVAL ${interval}s — BLACK RED`}
        </button>
      </div>

      {activeJob && (
        <div className="glass-card-black-red rounded-xl p-4 mb-4 border-[1.5px] border-[#ff0040] shadow-[0_0_20px_rgba(255,0,64,0.2)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="digital-font text-white text-xs font-bold">🔴 LIVE PRANK: {activeJob.target} — {activeJob.progress}%</h3>
            <button onClick={() => stopJob(activeJob.id)} className="bg-black border border-white/20 rounded px-3 py-1 text-white text-[10px] font-bold">⏹️ STOP</button>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 mb-3 overflow-hidden border border-[rgba(255,0,64,0.2)]">
            <div className="bg-gradient-to-r from-black to-[#ff0040] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#ff0040]" style={{ width: `${activeJob.progress}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Total", val: `${activeJob.totalCalls}/${activeJob.count}` },
              { label: "Sukses", val: `${activeJob.successCalls}`, color: "#00ff88" },
              { label: "Gagal", val: `${activeJob.failedCalls}`, color: "#ff4466" },
            ].map(item => (
              <div key={item.label} className="bg-black/60 border border-[rgba(255,0,64,0.15)] rounded-lg p-2 text-center">
                <p className="digital-font text-white/40 text-[8px] m-0">{item.label}</p>
                <p className="text-xs font-bold m-0" style={{ color: (item as any).color || "#fff" }}>{item.val}</p>
              </div>
            ))}
          </div>
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide bg-black/40 rounded-lg p-2 border border-white/5">
            {activeJob.logs.map((log, i) => (
              <p key={i} className="text-[11px] m-0 py-1 border-b border-white/5 last:border-0" style={{ color: log.status === "success" ? "#00ff88" : log.status === "failed" ? "#ff4466" : "#ffaa00" }}>
                <span className="digital-font text-white/30 text-[9px]">[{log.time}]</span> {log.message}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card-black-white rounded-xl p-4">
        <h3 className="digital-font text-white text-xs font-bold mb-3">📋 RIWAYAT PRANK CALL ({jobs.length})</h3>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-hide">
          {jobs.map(job => (
            <div key={job.id} className="bg-black/50 border border-white/5 border-l-2 border-l-[#ff0040] rounded-lg p-2.5">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="digital-font text-white text-[10px] font-bold m-0 truncate">📞 {job.target} • {job.count}x • {job.script}</p>
                  <p className="text-white/50 text-[10px] m-0 mt-1">Progress: {job.progress}% • {job.totalCalls}/{job.count} • {new Date(job.createdAt).toLocaleTimeString("id-ID")}</p>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded ml-2" style={{ background: job.status === "running" ? "rgba(255,0,64,0.15)" : job.status === "completed" ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.1)", color: job.status === "running" ? "#ff0040" : job.status === "completed" ? "#00ff88" : "#fff", border: `1px solid ${job.status === "running" ? "rgba(255,0,64,0.3)" : "rgba(255,255,255,0.1)"}` }}>{job.status.toUpperCase()}</span>
              </div>
              {job.status === "running" && <button onClick={() => stopJob(job.id)} className="mt-2 w-full bg-black/60 border border-white/15 rounded px-2 py-1 text-white text-[9px]">⏹️ STOP JOB INI</button>}
            </div>
          ))}
          {jobs.length === 0 && <p className="text-white/30 text-xs text-center py-4">Belum ada prank call. Mulai prank pertama!</p>}
        </div>
      </div>
    </div>
  );
}
