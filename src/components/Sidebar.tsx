"use client";
import { useApp } from "@/contexts/AppContext";
import LogoImage from "./LogoImage";

type MenuId = "pairing" | "kill-group" | "attack" | "prank-call" | "spam-otp" | "cinema" | "chat" | "ai" | "profile" | "admin" | "logs";

interface Props {
  active: MenuId;
  onSelect: (id: MenuId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ active, onSelect, isOpen, onClose }: Props) {
  const { user, logout } = useApp();

  const menus: { id: MenuId; icon: string; label: string; roles: string[]; new?: boolean }[] = [
    { id: "pairing", icon: "📲", label: "Pairing WA V2", roles: ["user", "reseller", "owner", "developer"] },
    { id: "kill-group", icon: "💀", label: "Kill Group WA", roles: ["reseller", "owner", "developer"] },
    { id: "attack", icon: "⚡", label: "25 Bug Attack V2", roles: ["user", "reseller", "owner", "developer"] },
    { id: "prank-call", icon: "📞", label: "Prank Call", roles: ["reseller", "owner", "developer"], new: true },
    { id: "spam-otp", icon: "🔐", label: "Spam OTP", roles: ["reseller", "owner", "developer"], new: true },
    { id: "cinema", icon: "🎬", label: "Global Cinema HD", roles: ["user", "reseller", "owner", "developer"] },
    { id: "chat", icon: "🌏", label: "Global Live Chat", roles: ["user", "reseller", "owner", "developer"] },
    { id: "ai", icon: "🤖", label: "Bimzai AI Arena", roles: ["user", "reseller", "owner", "developer"] },
    { id: "profile", icon: "👤", label: "My Profile", roles: ["user", "reseller", "owner", "developer"] },
    { id: "logs", icon: "📋", label: "Activity Logs", roles: ["owner", "developer"] },
    { id: "admin", icon: "⚙️", label: "Admin Panel V2", roles: ["developer"] },
  ];

  const roleColor: Record<string, string> = {
    developer: "#ff0040",
    owner: "#ffffff",
    reseller: "#ffaaaa",
    user: "rgba(255,255,255,0.7)",
  };

  const roleLabel: Record<string, string> = {
    developer: "👑 DEVELOPER ULTIMATE",
    owner: "🔱 OWNER V2",
    reseller: "🧑‍💼 RESELLER FULL",
    user: "👤 USER BASIC",
  };

  const visibleMenus = menus.filter(m => user && m.roles.includes(user.role));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-black/75 backdrop-blur-sm" onClick={onClose} />
      )}

      <div
        className="fixed top-0 left-0 h-full z-40 flex flex-col bg-black/95 backdrop-blur-[30px] border-r border-[rgba(255,0,64,0.3)] shadow-[4px_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(255,0,64,0.15)] transition-transform duration-300"
        style={{
          width: 270,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="p-5 pb-4 border-b border-[rgba(255,0,64,0.15)] relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff0040] via-white to-transparent" />
          <div className="flex items-center gap-3">
            <LogoImage size={44} className="w-11 h-11 shrink-0" />
            <div>
              <div className="digital-font bg-gradient-to-br from-white to-[#ff0040] bg-clip-text text-transparent text-[17px] font-black leading-none tracking-tight">BimxZ BugXZ</div>
              <p className="digital-font text-white/35 text-[8px] tracking-[2px] mt-1">BLACK RED WHITE NEON • 120FPS</p>
            </div>
          </div>

          {user && (
            <div className="mt-3.5 p-2.5 bg-gradient-to-br from-[rgba(255,0,64,0.08)] to-black/50 rounded-lg border border-[rgba(255,0,64,0.2)] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: roleColor[user.role] || "#ff0040" }} />
              <p className="digital-font text-white text-xs font-bold m-0 pl-1.5">{user.username}</p>
              <p className="digital-font text-[9px] font-bold mt-1 pl-1.5" style={{ color: roleColor[user.role] || "#ff0040" }}>{roleLabel[user.role] || user.role} • 120FPS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide p-2">
          {visibleMenus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => { onSelect(menu.id); onClose(); }}
              className="flex items-center gap-2.5 w-full px-3 py-3 rounded-[9px] border-none text-left text-[13px] transition-all mb-0.5 relative"
              style={{
                background: active === menu.id ? "linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.6))" : "transparent",
                borderLeft: active === menu.id ? "3px solid #ff0040" : "3px solid transparent",
                borderRight: active === menu.id ? "1px solid rgba(255,0,64,0.3)" : "1px solid transparent",
                color: active === menu.id ? "#ffffff" : "rgba(255,255,255,0.65)",
                fontWeight: active === menu.id ? 700 : 400,
                boxShadow: active === menu.id ? "0 0 15px rgba(255,0,64,0.15), inset 0 0 10px rgba(255,0,64,0.03)" : "none",
              }}
            >
              <span className="text-[15px]" style={{ filter: active === menu.id ? "drop-shadow(0 0 5px #ff0040)" : "none", opacity: active === menu.id ? 1 : 0.7 }}>{menu.icon}</span>
              <span className={active === menu.id ? "digital-font text-[11px]" : "text-[13px]"}>{menu.label}</span>
              {menu.new && <span className="ml-auto text-[7px] font-extrabold bg-[#ff0040] text-white px-1.5 py-0.5 rounded animate-pulse">NEW</span>}
              {active === menu.id && !menu.new && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff0040] shadow-[0_0_8px_#ff0040] animate-[blink-checkmark_1s_infinite]" />}
            </button>
          ))}
        </nav>

        <div className="p-3.5 border-t border-[rgba(255,0,64,0.12)] bg-black/50">
          <div className="flex gap-2 mb-3">
            <a href="https://wa.me/6283115955196?text=Halo%20Admin%20mau%20upgrade%20BimxBugz" target="_blank" className="flex-1 p-1.5 bg-[rgba(255,0,64,0.08)] border border-[rgba(255,0,64,0.2)] rounded-md text-[#ff4466] text-[9px] font-bold text-center no-underline block">📞 DEV</a>
            <a href="https://t.me/b1mxzstore" target="_blank" className="flex-1 p-1.5 bg-white/5 border border-white/10 rounded-md text-white text-[9px] font-bold text-center no-underline block">📱 STORE</a>
          </div>
          <button onClick={logout} className="w-full p-2.5 bg-gradient-to-br from-[rgba(255,0,64,0.1)] to-black/60 border border-[rgba(255,0,64,0.3)] rounded-lg text-[#ff4466] cursor-pointer text-xs font-bold tracking-[1px] hover:bg-[rgba(255,0,64,0.2)] hover:shadow-[0_0_15px_rgba(255,0,64,0.3)] transition-all">
            🚪 KELUAR PLATFORM 120FPS
          </button>
        </div>
      </div>
    </>
  );
}
