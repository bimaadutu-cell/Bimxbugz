"use client";
import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";

interface Log {
  id: number;
  userId: number;
  username: string;
  attackType: string;
  target: string;
  status: string;
  createdAt: string;
}

export default function LogsSection() {
  const { token } = useApp();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) setLogs(await res.json());
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const attackLabel: Record<string, string> = {
    "kill-group": "💀 KILL GROUP REAL",
    "delay-attack": "⏳ Delay V2",
    "c1-chaos": "💀 C1 Chaos V2",
    "force-close": "🧲 Force Close V2",
    "doomsday-ultimate": "☠️ DOOMSDAY V2",
    "massive-emoji-storm": "⚡ Emoji Storm V2",
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <h2 className="digital-font" style={{
          background: "linear-gradient(135deg, #ffffff, #ff0040)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "18px",
          fontWeight: "900",
          filter: "drop-shadow(0 0 8px rgba(255,0,64,0.4))",
        }}>
          📋 ACTIVITY LOGS V2 — REAL BAILEYS
        </h2>
        <p className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "1px", marginTop: "4px" }}>
          SEMUA SERANGAN REAL WA TERCATAT • BLACK RED NEON • V2 BRUTAL
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="digital-font" style={{ color: "#ff0040", fontSize: "11px" }}>⏳ MEMUAT LOGS REAL...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ fontSize: "40px", marginBottom: "8px", opacity: 0.5 }}>📋</p>
          <p className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Belum ada aktivitas tercatat</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 12px",
            background: "rgba(255,0,64,0.06)",
            borderRadius: "6px",
            border: "1px solid rgba(255,0,64,0.15)",
            marginBottom: "4px",
          }}>
            <span className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px" }}>TOTAL: {logs.length} ATTACKS REAL</span>
            <span className="digital-font" style={{ color: "#ff0040", fontSize: "8px" }}>BLACK RED V2</span>
          </div>

          {logs.map(log => (
            <div
              key={log.id}
              style={{
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `2.5px solid ${log.status === "success" ? "#ff0040" : "#ffaa00"}`,
                borderRadius: "8px",
                padding: "10px 12px",
                boxShadow: log.status === "success" ? "0 0 10px rgba(255,0,64,0.08)" : "none",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="digital-font" style={{ color: "#fff", fontSize: "10px", fontWeight: "700", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {attackLabel[log.attackType] || `⚡ ${log.attackType.toUpperCase()} V2`}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    👤 <span style={{ color: "#ff0040", fontWeight: "700" }}>{log.username}</span> → 🎯 {log.target}
                  </p>
                  <p className="digital-font" style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px", margin: 0 }}>
                    🕒 {formatDate(log.createdAt)} • REAL BAILEYS v6.7.18 • V2 BRUTAL
                  </p>
                </div>
                <span style={{
                  padding: "3px 7px",
                  borderRadius: "4px",
                  background: log.status === "success" ? "rgba(255,0,64,0.12)" : "rgba(255,170,0,0.12)",
                  border: `1px solid ${log.status === "success" ? "rgba(255,0,64,0.3)" : "rgba(255,170,0,0.3)"}`,
                  color: log.status === "success" ? "#ff4466" : "#ffaa00",
                  fontSize: "8px",
                  fontWeight: "800",
                  flexShrink: 0,
                  letterSpacing: "0.5px",
                }}>
                  {log.status === "success" ? "✓ REAL SUCCESS" : log.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
