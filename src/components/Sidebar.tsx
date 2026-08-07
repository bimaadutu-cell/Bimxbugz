"use client";
import { useApp } from "@/contexts/AppContext";

type MenuId = "pairing" | "kill-group" | "attack" | "cinema" | "chat" | "ai" | "profile" | "admin" | "logs";

interface Props {
  active: MenuId;
  onSelect: (id: MenuId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ active, onSelect, isOpen, onClose }: Props) {
  const { user, logout } = useApp();

  const menus: { id: MenuId; icon: string; label: string; roles: string[]; color: string }[] = [
    { id: "pairing", icon: "📲", label: "Pairing WA V2", roles: ["user", "reseller", "owner", "developer"], color: "#00ff88" },
    { id: "kill-group", icon: "💀", label: "Kill Group WA", roles: ["reseller", "owner", "developer"], color: "#ff0040" },
    { id: "attack", icon: "⚡", label: "25 Bug Attack V2", roles: ["user", "reseller", "owner", "developer"], color: "#ff0040" },
    { id: "cinema", icon: "🎬", label: "Global Cinema HD", roles: ["user", "reseller", "owner", "developer"], color: "#ffd700" },
    { id: "chat", icon: "🌏", label: "Global Live Chat", roles: ["user", "reseller", "owner", "developer"], color: "#ffffff" },
    { id: "ai", icon: "🤖", label: "Bimzai AI Arena", roles: ["user", "reseller", "owner", "developer"], color: "#bf00ff" },
    { id: "profile", icon: "👤", label: "My Profile", roles: ["user", "reseller", "owner", "developer"], color: "#00d4ff" },
    { id: "logs", icon: "📋", label: "Activity Logs", roles: ["owner", "developer"], color: "#00d4ff" },
    { id: "admin", icon: "⚙️", label: "Admin Panel V2", roles: ["developer"], color: "#ffd700" },
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
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 left-0 h-full z-40 flex flex-col"
        style={{
          width: 260,
          background: "rgba(0,0,0,0.96)",
          backdropFilter: "blur(30px)",
          borderRight: "1.5px solid rgba(255,0,64,0.3)",
          boxShadow: "4px 0 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,0,64,0.15)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.1)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,0,64,0.15)", position: "relative" }}>
          <div style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, #ff0040, #fff, transparent)",
          }} />
          <div className="flex items-center gap-3">
            <img 
              src="/logo-bimxz.png" 
              alt="logo"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "2px solid #ff0040",
                boxShadow: "0 0 15px rgba(255,0,64,0.5)",
              }}
              onError={(e) => {(e.target as HTMLImageElement).style.display='none'}}
            />
            <div>
              <div className="digital-font" style={{
                background: "linear-gradient(135deg, #ffffff, #ff0040)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "17px",
                fontWeight: "900",
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}>
                BimxZ BugXZ
              </div>
              <p className="digital-font" style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", letterSpacing: "2px", margin: "3px 0 0" }}>
                BLACK RED WHITE NEON
              </p>
            </div>
          </div>

          {user && (
            <div
              style={{
                marginTop: "14px",
                padding: "10px 12px",
                background: "linear-gradient(135deg, rgba(255,0,64,0.08), rgba(0,0,0,0.5))",
                borderRadius: "8px",
                border: "1px solid rgba(255,0,64,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: roleColor[user.role] || "#ff0040" }} />
              <p className="digital-font" style={{ color: "#fff", fontSize: "12px", fontWeight: "700", margin: 0, paddingLeft: "6px" }}>{user.username}</p>
              <p className="digital-font" style={{ color: roleColor[user.role] || "#ff0040", fontSize: "9px", margin: "3px 0 0", fontWeight: "700", paddingLeft: "6px" }}>
                {roleLabel[user.role] || user.role}
              </p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: "10px 8px" }}>
          {visibleMenus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => { onSelect(menu.id); onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "12px 12px",
                borderRadius: "9px",
                border: "none",
                background: active === menu.id
                  ? `linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.6))`
                  : "transparent",
                borderLeft: active === menu.id ? `3px solid #ff0040` : "3px solid transparent",
                borderRight: active === menu.id ? `1px solid rgba(255,0,64,0.3)` : "1px solid transparent",
                color: active === menu.id ? "#ffffff" : "rgba(255,255,255,0.65)",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: active === menu.id ? "700" : "400",
                transition: "all 0.2s",
                marginBottom: "3px",
                boxShadow: active === menu.id ? "0 0 15px rgba(255,0,64,0.15), inset 0 0 10px rgba(255,0,64,0.03)" : "none",
                position: "relative",
              }}
            >
              {active === menu.id && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  bottom: "20%",
                  width: "2px",
                  background: "#ff0040",
                  boxShadow: "0 0 8px #ff0040",
                  borderRadius: "1px",
                }} />
              )}
              <span style={{ 
                fontSize: "15px", 
                filter: active === menu.id ? "drop-shadow(0 0 5px #ff0040)" : "none",
                opacity: active === menu.id ? 1 : 0.7,
              }}>{menu.icon}</span>
              <span className={active === menu.id ? "digital-font" : ""} style={{ fontSize: active === menu.id ? "11px" : "13px", letterSpacing: active === menu.id ? "0.5px" : "0" }}>{menu.label}</span>
              {active === menu.id && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#ff0040", boxShadow: "0 0 8px #ff0040", animation: "blink-checkmark 1s infinite" }} />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,0,64,0.12)", background: "rgba(0,0,0,0.5)" }}>
          <div className="flex gap-2 mb-3">
            <a
              href={`https://wa.me/6283115955196?text=${encodeURIComponent("Halo Admin BimzOfficial, saya ingin info upgrade role BimxzBugxz")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "7px",
                background: "rgba(255,0,64,0.08)",
                border: "1px solid rgba(255,0,64,0.2)",
                borderRadius: "6px",
                color: "#ff4466",
                fontSize: "9px",
                fontWeight: "700",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
            >
              📞 DEV
            </a>
            <a
              href="https://t.me/b1mxzstore"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "7px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "6px",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: "700",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
            >
              📱 STORE
            </a>
          </div>

          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px",
              background: "linear-gradient(135deg, rgba(255,0,64,0.1), rgba(0,0,0,0.6))",
              border: "1px solid rgba(255,0,64,0.3)",
              borderRadius: "8px",
              color: "#ff4466",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "700",
              transition: "all 0.2s",
              letterSpacing: "1px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,0,64,0.2)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(255,0,64,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,0,64,0.1), rgba(0,0,0,0.6))";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            🚪 KELUAR PLATFORM
          </button>
        </div>
      </div>
    </>
  );
}
