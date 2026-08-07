"use client";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import StarField from "./StarField";
import BackgroundLayer from "./BackgroundLayer";
import LogoImage from "./LogoImage";

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
      } else {
        login(data.token, data.user);
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-black">
      <BackgroundLayer />
      <div className="absolute inset-0 bg-black/70" />
      <StarField />
      <div className="scanline-overlay" />

      <div className="relative z-10 w-full max-w-[430px] animate-fade-slide">
        <div className="glass-card-black-red rounded-[18px] p-[28px_22px] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0040] via-white to-transparent shadow-[0_0_10px_#ff0040]" />

          {/* Logo - Fixed for Vercel with fallback */}
          <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
              <LogoImage size={110} className="w-[110px] h-[110px]" />
            </div>
            <div className="digital-font bg-gradient-to-br from-white via-[#ff0040] to-white bg-clip-text text-transparent text-[32px] font-black leading-none tracking-tight drop-shadow-[0_0_12px_rgba(255,0,64,0.8)]">
              BimxZ BugXZ
            </div>
            <div className="w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#ff0040] via-white to-transparent mx-auto mt-2 mb-2 shadow-[0_0_8px_#ff0040]" />
            <p className="digital-font text-[#ff0040] text-[10px] tracking-[3px] drop-shadow-[0_0_8px_#ff0040]">
              BLACK • WHITE • RED NEON DIGITAL • V2 ULTIMATE 120FPS
            </p>
            <p className="text-white/35 text-[10px] tracking-[2px] mt-1">SUPER ALL-IN-ONE PLATFORM</p>
          </div>

          {/* Warning */}
          <div className="bg-[rgba(255,0,64,0.08)] border border-[rgba(255,0,64,0.35)] rounded-[10px] p-3 mb-5 text-center relative shadow-[0_0_15px_rgba(255,0,64,0.1),inset_0_0_10px_rgba(255,0,64,0.03)]">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff0040] rounded-l-[10px] shadow-[0_0_8px_#ff0040]" />
            <p className="digital-font text-[#ff3366] text-[10px] font-semibold leading-[1.6] m-0 pl-2">
              ⚠️ ALAT KHUSUS TINDAK PENIPU & KEJAHATAN — PEMAKAI BERTANGGUNG JAWAB PENUH ATAS SEGALA RISIKO & HUKUM
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="digital-font text-white/80 text-[10px] tracking-[1.5px] block mb-1.5">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                required
                className="w-full bg-black/60 border border-white/15 rounded-lg px-4 py-3 text-white text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] focus:border-[#ff0040] focus:shadow-[0_0_15px_rgba(255,0,64,0.3),inset_0_0_10px_rgba(0,0,0,0.5)] transition-all"
              />
            </div>

            <div>
              <label className="digital-font text-white/80 text-[10px] tracking-[1.5px] block mb-1.5">PASSWORD</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-4 py-3 pr-11 text-white text-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] focus:border-[#ff0040] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 cursor-pointer text-base"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.5)] rounded-lg p-3 text-[#ff4466] text-xs text-center shadow-[0_0_15px_rgba(255,0,64,0.15)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] rounded-[10px] py-3.5 text-white text-sm font-extrabold tracking-[2px] shadow-[0_0_20px_rgba(255,0,64,0.5),0_4px_15px_rgba(0,0,0,0.8)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(255,0,64,0.7)] transition-all"
            >
              {loading ? "⏳ MEMPROSES..." : "🔓 MASUK PLATFORM 120FPS"}
            </button>
          </form>

          <div className="flex gap-2 mt-4">
            <a
              href={`https://wa.me/6283115955196?text=${encodeURIComponent("Halo Admin BimzOfficial, saya ingin tanya kendala teknis / info upgrade role & pembelian akun BimxzBugxz, mohon bantuannya ya")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 block bg-[rgba(255,0,64,0.06)] border border-[rgba(255,0,64,0.3)] rounded-lg p-2 text-[#ff4466] text-[10px] font-bold text-center no-underline tracking-[0.5px]"
            >
              📞 CHAT DEV
            </a>
            <a
              href="https://t.me/b1mxzstore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 block bg-[rgba(255,255,255,0.06)] border border-white/20 rounded-lg p-2 text-white text-[10px] font-bold text-center no-underline tracking-[0.5px]"
            >
              📱 TELE STORE
            </a>
          </div>

          <div className="text-center mt-4">
            <p className="digital-font text-white/25 text-[8px] tracking-[1px]">ADMIN0987 • RESELLER01 • USER01 — UJI COBA V2 120FPS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
