"use client";
import { useState, useEffect, useCallback } from "react";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<{ id: number; message: string } | null>(null);
  const [dismissedId, setDismissedId] = useState<number | null>(null);

  const fetchAnn = useCallback(async () => {
    try {
      const res = await fetch("/api/announcement", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id !== dismissedId) {
          setAnnouncement(data);
        }
      }
    } catch {}
  }, [dismissedId]);

  useEffect(() => {
    fetchAnn();
    const interval = setInterval(fetchAnn, 25000);
    return () => clearInterval(interval);
  }, [fetchAnn]);

  if (!announcement || announcement.id === dismissedId) return null;

  return (
    <div
      className="animate-slide-down"
      style={{
        background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(255,0,64,0.9), rgba(0,0,0,0.95))",
        backdropFilter: "blur(12px)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 20px rgba(255,0,64,0.4), 0 0 30px rgba(255,0,64,0.15)",
        borderBottom: "1.5px solid #ff0040",
        position: "relative",
        zIndex: 100,
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, #fff, transparent)",
        opacity: 0.6,
      }} />
      <span style={{ fontSize: "16px", flexShrink: 0, filter: "drop-shadow(0 0 6px #fff)" }}>📢</span>
      <p className="digital-font" style={{ flex: 1, color: "#fff", fontSize: "11px", fontWeight: "600", margin: 0, letterSpacing: "0.3px", textShadow: "0 0 8px rgba(255,255,255,0.5)" }}>
        <span style={{ color: "#ffffff", background: "#ff0040", padding: "1px 6px", borderRadius: "4px", marginRight: "6px", fontSize: "9px", fontWeight: "800", boxShadow: "0 0 8px #ff0040" }}>LIVE</span>
        {announcement.message}
      </p>
      <button
        onClick={() => setDismissedId(announcement.id)}
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width: 22,
          height: 22,
          color: "#fff",
          cursor: "pointer",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
