"use client";
import { useState, useEffect } from "react";
import BackgroundLayer from "./BackgroundLayer";
import StarField from "./StarField";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => {
      setPhase(4);
      setTimeout(onDone, 600);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        opacity: phase === 4 ? 0 : 1,
        transition: "opacity 0.6s ease-out",
        background: "#000",
      }}
    >
      <BackgroundLayer />
      <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.55)" }} />
      <StarField />
      <div className="scanline-overlay" />

      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center">
        {/* Logo Image */}
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.4) translateY(-50px)",
            transition: "all 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >
          <div style={{ position: "relative" }}>
            <img 
              src="/logo-bimxz.png" 
              alt="BimxzBugxz"
              style={{
                width: "min(280px, 75vw)",
                height: "min(280px, 75vw)",
                objectFit: "contain",
                filter: "drop-shadow(0 0 20px rgba(255,0,64,0.8)) drop-shadow(0 0 40px rgba(255,0,64,0.4))",
                borderRadius: "50%",
              }}
              onError={(e) => {
                // Fallback to text if image fails
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Fallback text logo */}
            <div
              id="fallback-logo"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(circle, #1a0005 0%, #000 70%)",
                borderRadius: "50%",
                border: "3px solid #ff0040",
                boxShadow: "0 0 40px #ff0040, 0 0 80px rgba(255,0,64,0.3)",
              }}
            >
              <div style={{
                background: "linear-gradient(135deg, #ffffff 0%, #ff0040 50%, #ffffff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "clamp(32px, 9vw, 52px)",
                fontWeight: "900",
                letterSpacing: "-1px",
                lineHeight: 1,
                filter: "drop-shadow(0 0 15px rgba(255,0,64,0.8))",
              }}>
                BimxZ
              </div>
              <div style={{
                color: "#ffffff",
                fontSize: "clamp(28px, 8vw, 44px)",
                fontWeight: "900",
                letterSpacing: "-1px",
                marginTop: "-6px",
                textShadow: "0 0 10px #ff0040, 0 0 20px #ff0040",
              }}>
                BugXZ
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(25px)",
            transition: "all 0.7s ease-out",
          }}
        >
          <p className="digital-font" style={{
            color: "#ffffff",
            fontSize: "clamp(11px, 3vw, 14px)",
            letterSpacing: "4px",
            fontWeight: "400",
            textShadow: "0 0 10px #ff0040",
          }}>
            BIMXZBUGXZ BY BIMZOFFICIAL
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff0040", display: "inline-block", boxShadow: "0 0 10px #ff0040", animation: "blink-checkmark 1s infinite" }} />
            <span className="digital-font" style={{ color: "#ff0040", fontSize: "10px", letterSpacing: "4px", textShadow: "0 0 8px #ff0040" }}>BLACK RED NEON ULTIMATE v2</span>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffffff", display: "inline-block", boxShadow: "0 0 10px #fff", animation: "blink-checkmark 1s infinite 0.5s" }} />
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col gap-3 w-full"
          style={{
            maxWidth: 320,
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease-out",
          }}
        >
          <a
            href={`https://wa.me/6283115955196?text=${encodeURIComponent("Halo Admin BimzOfficial, saya ingin tanya kendala teknis / info upgrade role & pembelian akun BimxzBugxz, mohon bantuannya ya")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #000, #1a0005, #ff0040)",
              color: "#fff",
              padding: "13px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "800",
              border: "1.5px solid #ff0040",
              boxShadow: "0 0 20px rgba(255,0,64,0.4), 0 4px 15px rgba(0,0,0,0.8)",
              letterSpacing: "0.5px",
            }}
          >
            📞 CHAT DEVELOPER (KENDALA/BELI ROLE)
          </a>

          <a
            href="https://t.me/b1mxzstore"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #000, #0a0a0f, #ffffff)",
              color: "#fff",
              padding: "13px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "800",
              border: "1.5px solid #ffffff",
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            📱 TELEGRAM STORE
          </a>
        </div>

        {/* Progress */}
        <div style={{
          width: "220px",
          height: "2px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "2px",
          overflow: "hidden",
          border: "1px solid rgba(255,0,64,0.2)",
        }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #ff0040, #ffffff, #ff0040)",
              width: phase >= 3 ? "100%" : "12%",
              transition: "width 2.6s linear",
              boxShadow: "0 0 10px #ff0040",
            }}
          />
        </div>

        <p className="digital-font" style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "2px", marginTop: "-10px" }}>
          BLACK NEON • WHITE NEON • RED NEON DIGITAL • 120FPS
        </p>
      </div>

      <style jsx>{`
        #fallback-logo { display: none; }
        img[src="/logo-bimxz.png"]:not([style*="display: none"]) + #fallback-logo { display: none; }
      `}</style>
    </div>
  );
}
