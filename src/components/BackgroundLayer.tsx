"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function BackgroundLayer() {
  const { background } = useApp();
  const [imgError, setImgError] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (background.url) {
      setImgError(false);
      setKey(prev => prev + 1);
    }
  }, [background.url]);

  if (!background.url || imgError) {
    return (
      <>
        <div
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 15% 20%, rgba(255,0,64,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(255,0,64,0.08) 0%, transparent 70%),
              linear-gradient(135deg, #000000 0%, #0a0002 15%, #150005 30%, #0a0000 45%, #000000 60%, #0f0005 75%, #000000 100%)
            `,
            backgroundSize: "400% 400%, 300% 300%, 400% 400%, 400% 400%",
            animation: "gradient-shift 12s ease infinite",
          }}
        />
        <div 
          className="fixed inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,0,64,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,0,64,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            opacity: 0.5,
          }}
        />
      </>
    );
  }

  if (background.type === "video") {
    return (
      <>
        <video
          key={key}
          className="fixed inset-0 w-full h-full object-cover z-0"
          src={background.url.split('?')[0]}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setImgError(true)}
          style={{ filter: "contrast(1.1) brightness(0.8) hue-rotate(-10deg)" }}
        />
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ 
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%), linear-gradient(rgba(0,0,0,0.3), rgba(255,0,64,0.05))" 
        }} />
      </>
    );
  }

  return (
    <>
      <div
        key={key}
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${background.url.split('?')[0]})`,
          filter: "contrast(1.1) brightness(0.65) saturate(0.9)",
        }}
      />
      <div className="fixed inset-0 z-0" style={{
        background: `
          radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%),
          radial-gradient(ellipse at 20% 20%, rgba(255,0,64,0.15) 0%, transparent 50%)
        `,
      }} />
    </>
  );
}
