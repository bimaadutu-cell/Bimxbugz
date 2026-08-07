"use client";
import { useState, useEffect } from "react";
import { LOGO_BASE64 } from "@/lib/logoBase64";

// Fallback SVG if even base64 fails (black red neon)
const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a0005"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="url(#bg)" stroke="#ff0040" stroke-width="6" />
  <circle cx="256" cy="256" r="230" fill="none" stroke="#ff0040" stroke-width="2" opacity="0.5"/>
  <text x="256" y="210" text-anchor="middle" font-family="monospace" font-weight="900" font-size="64" fill="white">BIMXZ</text>
  <text x="256" y="280" text-anchor="middle" font-family="monospace" font-weight="900" font-size="56" fill="#ff0040">BUGXZ</text>
  <text x="256" y="310" text-anchor="middle" font-family="monospace" font-size="12" fill="white" opacity="0.7">BLACK RED WHITE NEON</text>
  <text x="256" y="330" text-anchor="middle" font-family="monospace" font-size="10" fill="#ff0040">V2.1 ULTRA • 120FPS</text>
</svg>
`)}`;

interface Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export default function LogoImage({ size = 110, className = "", style = {}, alt = "BimxZ BugXZ" }: Props) {
  const [src, setSrc] = useState(LOGO_BASE64);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Try to load from public folder first for better performance, fallback to base64
    const publicSources = ["/logo-bimxz.png", "/icon.png", "/icon-512.png"];
    
    const tryNext = (index: number) => {
      if (index >= publicSources.length) {
        // All public files failed, use base64 (already set)
        setSrc(LOGO_BASE64);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setSrc(publicSources[index]);
      };
      img.onerror = () => {
        tryNext(index + 1);
      };
      img.src = publicSources[index];
    };

    // Start with base64 immediately to show instantly, then try public files in background
    // This ensures logo is always visible even on Vercel if public 404
    tryNext(0);
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
        border: "2.5px solid #ff0040",
        boxShadow: "0 0 25px rgba(255,0,64,0.6), 0 0 50px rgba(255,0,64,0.2)",
        background: "#000",
        ...style,
      }}
      onError={() => {
        if (attempt === 0) {
          setSrc("/icon.png");
          setAttempt(1);
        } else if (attempt === 1) {
          setSrc(LOGO_BASE64);
          setAttempt(2);
        } else if (attempt === 2) {
          setSrc(FALLBACK_SVG);
          setAttempt(3);
        }
      }}
      loading="eager"
      decoding="sync"
    />
  );
}
