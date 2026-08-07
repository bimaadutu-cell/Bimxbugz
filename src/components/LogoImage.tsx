"use client";
import { useState, useEffect } from "react";

interface Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

// Fallback logo as inline SVG data URL if file fails - black red neon design
const FALLBACK_LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a0005"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff0040"/>
      <stop offset="100%" stop-color="#cc0033"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#bg)" stroke="#ff0040" stroke-width="6" />
  <circle cx="256" cy="256" r="230" fill="none" stroke="#ff0040" stroke-width="2" opacity="0.5"/>
  <text x="256" y="220" text-anchor="middle" font-family="monospace" font-weight="900" font-size="72" fill="white" filter="drop-shadow(0 0 10px #ff0040)">BIMXZ</text>
  <text x="256" y="290" text-anchor="middle" font-family="monospace" font-weight="900" font-size="64" fill="#ff0040" filter="drop-shadow(0 0 10px #ff0040)">BUGXZ</text>
  <text x="256" y="330" text-anchor="middle" font-family="monospace" font-size="14" fill="white" opacity="0.8">BLACK RED WHITE NEON</text>
  <path d="M 100 100 L 120 80 L 140 100 L 120 120 Z" fill="#ff0040" />
  <path d="M 392 100 L 412 80 L 432 100 L 412 120 Z" fill="#ff0040" />
  <path d="M 100 412 L 120 392 L 140 412 L 120 432 Z" fill="#ff0040" />
  <path d="M 392 412 L 412 392 L 432 412 L 412 432 Z" fill="#ff0040" />
</svg>
`)}`;

export default function LogoImage({ size = 110, className = "", style = {}, alt = "BimxZ BugXZ" }: Props) {
  const [src, setSrc] = useState("/logo-bimxz.png");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Preload check if logo exists, if not use fallback
    const img = new Image();
    img.onload = () => {
      setSrc("/logo-bimxz.png");
      setFailed(false);
    };
    img.onerror = () => {
      // Try icon.png as secondary
      const img2 = new Image();
      img2.onload = () => {
        setSrc("/icon.png");
        setFailed(false);
      };
      img2.onerror = () => {
        setSrc(FALLBACK_LOGO_SVG);
        setFailed(true);
      };
      img2.src = "/icon.png";
    };
    img.src = "/logo-bimxz.png";
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: "cover",
        borderRadius: "50%",
        border: failed ? "2px solid #ff0040" : "2.5px solid #ff0040",
        boxShadow: "0 0 25px rgba(255,0,64,0.6), 0 0 50px rgba(255,0,64,0.2)",
        ...style,
      }}
      onError={() => {
        if (src === "/logo-bimxz.png") {
          setSrc("/icon.png");
        } else if (src === "/icon.png") {
          setSrc(FALLBACK_LOGO_SVG);
          setFailed(true);
        }
      }}
    />
  );
}
