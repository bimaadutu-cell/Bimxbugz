"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const colors = ["255,255,255", "255,0,64", "255,170,170", "255,100,100"];
    const stars: any[] = [];
    const count = 160;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // Throttle to ~120fps but allow browser to handle
      if (now - last < 8) return; // ~120fps = 8.33ms
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.twinkle += s.speed;
        const alpha = 0.25 + 0.75 * Math.abs(Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (s.color === "255,0,64") {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${s.color}, ${alpha})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
