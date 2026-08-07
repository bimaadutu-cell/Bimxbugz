"use client";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import BackgroundLayer from "./BackgroundLayer";
import StarField from "./StarField";
import Sidebar from "./Sidebar";
import AnnouncementBanner from "./AnnouncementBanner";
import PairingSection from "./PairingSection";
import KillGroupSection from "./KillGroupSection";
import AttackSection from "./AttackSection";
import PrankCallSection from "./PrankCallSection";
import SpamOtpSection from "./SpamOtpSection";
import CinemaSection from "./CinemaSection";
import ChatSection from "./ChatSection";
import AISection from "./AISection";
import ProfileSection from "./ProfileSection";
import AdminSection from "./AdminSection";
import LogsSection from "./LogsSection";

type MenuId = "pairing" | "kill-group" | "attack" | "prank-call" | "spam-otp" | "cinema" | "chat" | "ai" | "profile" | "admin" | "logs";

export default function Dashboard() {
  const { user } = useApp();
  const [activeMenu, setActiveMenu] = useState<MenuId>("pairing");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuComponents: Record<MenuId, React.ReactNode> = {
    pairing: <PairingSection />,
    "kill-group": <KillGroupSection />,
    attack: <AttackSection />,
    "prank-call": <PrankCallSection />,
    "spam-otp": <SpamOtpSection />,
    cinema: <CinemaSection />,
    chat: <ChatSection />,
    ai: <AISection />,
    profile: <ProfileSection />,
    admin: <AdminSection />,
    logs: <LogsSection />,
  };

  const menuTitles: Record<MenuId, string> = {
    pairing: "📲 Pairing WA V2 REAL",
    "kill-group": "💀 Kill Group REAL",
    attack: "⚡ 25 Bug V2 Brutal",
    "prank-call": "📞 Prank Call V2 NEW",
    "spam-otp": "🔐 Spam OTP V2 NEW",
    cinema: "🎬 Cinema HD 150+",
    chat: "🌏 Live Chat",
    ai: "🤖 Bimzai AI Arena V2",
    profile: "👤 My Profile V2",
    admin: "⚙️ Admin V2",
    logs: "📋 Logs V2",
  };

  const isFullHeight = ["chat", "ai", "cinema", "prank-call", "spam-otp"].includes(activeMenu);

  return (
    <div className="fixed inset-0 flex bg-black">
      <BackgroundLayer />
      <div className="absolute inset-0 z-0 bg-black/55 backdrop-blur-[1px]" />
      <StarField />
      <div className="scanline-overlay" />

      <Sidebar
        active={activeMenu}
        onSelect={(id: MenuId) => setActiveMenu(id)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <AnnouncementBanner />

        <div className="h-14 bg-gradient-to-br from-black/90 to-[#140005]/80 backdrop-blur-[25px] border-b border-[rgba(255,0,64,0.25)] flex items-center px-3 gap-2.5 shrink-0 z-20 shadow-[0_2px_24px_rgba(0,0,0,0.85),0_0_18px_rgba(255,0,64,0.12)]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-black/60 border border-[rgba(255,0,64,0.25)] rounded-lg p-2 text-white cursor-pointer flex flex-col gap-[3px] shrink-0 shadow-[0_0_12px_rgba(255,0,64,0.18)]"
          >
            {[0, 1, 2].map(i => (
              <span key={i} className="block w-[18px] h-[2px] rounded-sm" style={{ background: i === 1 ? "#ff0040" : "#fff", boxShadow: i === 1 ? "0 0 5px #ff0040" : "none" }} />
            ))}
          </button>

          <img src="/logo-bimxz.png" alt="logo" className="w-8 h-8 rounded-full border border-[#ff0040] shadow-[0_0_12px_rgba(255,0,64,0.45)] shrink-0" onError={(e)=>{(e.target as HTMLImageElement).src="/icon.png"}} />

          <div className="flex-1 min-w-0">
            <p className="digital-font text-[#ff0040] text-[9px] font-extrabold tracking-[1px] m-0 drop-shadow-[0_0_6px_#ff0040]">
              BIMXZBUGXZ V2 • 120FPS ULTRA • BLACK RED NEON
            </p>
            <p className="digital-font text-white text-[11px] font-bold m-0 overflow-hidden text-ellipsis whitespace-nowrap tracking-[0.5px]">
              {menuTitles[activeMenu]}
            </p>
          </div>

          {user && (
            <div className="bg-gradient-to-br from-black/80 to-[rgba(255,0,64,0.12)] border border-[rgba(255,0,64,0.28)] rounded-md px-2 py-1 shrink-0 text-center">
              <p className="digital-font text-white text-[9px] font-bold m-0">{user.username}</p>
              <p className="digital-font text-[#ff0040] text-[7px] m-0 tracking-[1px]">{user.role.toUpperCase()} • 120FPS</p>
            </div>
          )}
        </div>

        <div className={`flex-1 relative ${isFullHeight ? "" : "overflow-y-auto"} scrollbar-hide`}>
          {menuComponents[activeMenu]}
        </div>
      </div>
    </div>
  );
}
