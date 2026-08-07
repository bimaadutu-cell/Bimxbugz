"use client";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

interface Props {
  onClose: () => void;
  message?: string;
}

export default function SuccessNotification({ onClose, message }: Props) {
  const [stars, setStars] = useState<Star[]>([]);
  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    const colors = ["#ff0040", "#ffffff", "#ffaaaa", "#ff0040", "#ffffff", "#ff3366"];
    const newStars: Star[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 6,
      delay: Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setStars(newStars);
    setTimeout(() => setCheckVisible(true), 200);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative animate-modal-in"
        style={{
          width: "min(360px, 92vw)",
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,0,5,0.9))",
          backdropFilter: "blur(30px)",
          border: "2px solid #ff0040",
          borderRadius: "18px",
          padding: "28px 22px",
          boxShadow: "0 0 50px rgba(255,0,64,0.5), 0 0 100px rgba(255,0,64,0.15), inset 0 0 30px rgba(255,0,64,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #ff0040, #ffffff, #ff0040, transparent)",
          boxShadow: "0 0 10px #ff0040",
        }} />

        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute pointer-events-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              fontSize: `${star.size}px`,
              color: star.color,
              animation: `star-twinkle ${1 + star.delay}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              textShadow: `0 0 8px ${star.color}`,
              opacity: 0.9,
            }}
          >
            ✦
          </div>
        ))}

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div
            className={`transition-all duration-700 ${checkVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
          >
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,0,64,0.2), rgba(0,0,0,0.8))",
                border: "2.5px solid #ff0040",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 25px #ff0040, 0 0 50px rgba(255,0,64,0.4), inset 0 0 20px rgba(255,0,64,0.1)",
                animation: checkVisible ? "blink-checkmark 1.8s ease-in-out infinite" : "none",
              }}
            >
              <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
                <path d="M8 20L17 29L32 12" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px #ff0040)" }}/>
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff0040", boxShadow: "0 0 10px #ff0040", animation: "blink-checkmark 1s infinite" }} />
            <span className="digital-font" style={{ color: "#ff0040", fontSize: "11px", letterSpacing: "2px", fontWeight: "700", textShadow: "0 0 8px #ff0040" }}>SUCCESS REAL WA</span>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffffff", boxShadow: "0 0 10px #fff", animation: "blink-checkmark 1s infinite 0.5s" }} />
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, rgba(255,0,64,0.08), rgba(0,0,0,0.6))",
              border: "1px solid rgba(255,0,64,0.3)",
              borderLeft: "3px solid #ff0040",
              borderRadius: "10px",
              padding: "14px 16px",
              textAlign: "center",
              boxShadow: "inset 0 0 15px rgba(255,0,64,0.03)",
              width: "100%",
            }}
          >
            <p className="digital-font" style={{ color: "#ffffff", fontSize: "12px", lineHeight: "1.6", margin: 0, letterSpacing: "0.3px", textShadow: "0 0 5px rgba(255,255,255,0.3)" }}>
              {message || "BimxBugz V1 menyatakan bahwa pengiriman bug anda Success dan insyaallah akan bekerja"}
            </p>
            <p style={{ color: "#ffaaaa", fontSize: "10px", margin: "8px 0 0", opacity: 0.8 }}>
              Real Baileys v6.7.18 • Payload V2 Brutal • {new Date().toLocaleTimeString("id-ID")}
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #000000 0%, #ff0040 100%)",
              borderRadius: "10px",
              padding: "10px 18px",
              textAlign: "center",
              boxShadow: "0 0 25px rgba(255,0,64,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              border: "1px solid #ff0040",
              width: "100%",
            }}
          >
            <p className="digital-font" style={{ color: "#fff", fontSize: "12px", fontWeight: "800", margin: 0, letterSpacing: "0.5px", textShadow: "0 0 8px rgba(255,255,255,0.8)" }}>
              🔥 BimxBugz By BimzOfficial, SIKIKKK AYAAAAA!!! 🔥
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", margin: "4px 0 0", letterSpacing: "1px" }}>
              BLACK RED WHITE NEON • V2 ULTIMATE • REAL WA
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              marginTop: 4,
              padding: "10px 28px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.6))",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "11px",
              cursor: "pointer",
              fontWeight: "700",
              letterSpacing: "1px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ff0040";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(255,0,64,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            SIKIKK — TUTUP ✓
          </button>
        </div>
      </div>
    </div>
  );
}
