"use client";
import { useApp } from "@/contexts/AppContext";

export default function ProfileSection() {
  const { user, logout } = useApp();

  if (!user) return null;

  const roleLabel: Record<string, string> = {
    developer: "👑 DEVELOPER ULTIMATE",
    owner: "🔱 OWNER V2",
    reseller: "🧑‍💼 RESELLER FULL",
    user: "👤 USER BASIC",
  };

  const roleColor: Record<string, string> = {
    developer: "#ff0040",
    owner: "#ffffff",
    reseller: "#ffaaaa",
    user: "rgba(255,255,255,0.6)",
  };

  const expiresText = () => {
    if (!user.expiresAt) return "Seumur Hidup ∞";
    const exp = new Date(user.expiresAt);
    const now = new Date();
    const diff = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "KADALUARSA ❌";
    if (diff === 0) return "Hari ini (< 24 jam) ⚠️";
    return `${diff} hari lagi ✅`;
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-5">
        <h2 className="digital-font" style={{
          background: "linear-gradient(135deg, #ffffff, #ff0040)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "20px",
          fontWeight: "900",
          filter: "drop-shadow(0 0 10px rgba(255,0,64,0.5))",
        }}>
          👤 MY PROFILE V2 — BLACK RED
        </h2>
      </div>

      <div className="glass-card-black-red" style={{ borderRadius: "16px", padding: "22px", marginBottom: "14px" }}>
        <div className="flex items-center gap-4 mb-5">
          <div style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: `linear-gradient(135deg, #000, ${roleColor[user.role]})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            border: `2px solid ${roleColor[user.role] || "#ff0040"}`,
            boxShadow: `0 0 20px ${roleColor[user.role] || "#ff0040"}66`,
            flexShrink: 0,
            position: "relative",
          }}>
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: "#fff", fontWeight: "900" }}>{user.username.charAt(0).toUpperCase()}</span>
            )}
            <div style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#00ff88",
              border: "2px solid #000",
              boxShadow: "0 0 8px #00ff88",
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="digital-font" style={{ color: "#fff", fontSize: "16px", fontWeight: "800", margin: 0, textShadow: "0 0 8px rgba(255,255,255,0.3)" }}>{user.username}</p>
            <p className="digital-font" style={{
              color: roleColor[user.role] || "#ff0040",
              fontSize: "11px",
              fontWeight: "700",
              margin: "4px 0 0",
              textShadow: `0 0 8px ${roleColor[user.role]}`,
            }}>
              {roleLabel[user.role] || user.role}
            </p>
            <p className="digital-font" style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", margin: "4px 0 0", letterSpacing: "1px" }}>
              BLACK RED WHITE NEON V2 • ID: {user.id}
            </p>
          </div>
          <img src="/logo-bimxz.png" alt="logo" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #ff0040", opacity: 0.7 }} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Status Akun", value: "🟢 Aktif V2", color: "#00ff88" },
            { label: "Masa Aktif", value: expiresText(), color: user.expiresAt && new Date(user.expiresAt) < new Date() ? "#ff0040" : "#ffffff" },
            { label: "Bergabung", value: formatDate(user.createdAt), color: "#ffaaaa" },
            { label: "Role Level", value: user.role.toUpperCase(), color: roleColor[user.role] },
            { label: "Payload Access", value: user.role === "user" ? "1 / 25" : "25 / 25 + Kill Group", color: user.role === "user" ? "#ffaa00" : "#ff0040" },
            { label: "V2 Features", value: "✅ ALL UNLOCKED", color: "#ffffff" },
          ].map(item => (
            <div key={item.label} style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,0,64,0.15)",
              borderLeft: `2px solid ${item.color}`,
              borderRadius: "8px",
              padding: "10px",
            }}>
              <p className="digital-font" style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", margin: "0 0 3px", letterSpacing: "1px" }}>
                {item.label.toUpperCase()}
              </p>
              <p style={{ color: item.color, fontSize: "11px", fontWeight: "700", margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card-black-white" style={{ borderRadius: "12px", padding: "16px", marginBottom: "14px" }}>
        <h3 className="digital-font" style={{ color: "#ff0040", fontSize: "11px", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px" }}>
          🔧 INFORMASI PLATFORM V2 ULTIMATE
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { k: "Engine", v: "Baileys v6.7.18 Real" },
            { k: "Theme", v: "Black • White • Red Neon Digital" },
            { k: "Bug Payload", v: "V2 Brutal 20k+ chars" },
            { k: "Cinema", v: "7 Servers HD Real" },
            { k: "AI", v: "Arena Ready • 46+ Models" },
            { k: "PWA", v: "APK Android 120FPS" },
          ].map(item => (
            <div key={item.k} className="flex justify-between" style={{ padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>{item.k}</span>
              <span style={{ color: "#fff", fontSize: "10px", fontWeight: "600" }}>{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={`https://wa.me/6283115955196?text=${encodeURIComponent("Halo Admin BimzOfficial, saya ingin info upgrade role & pembelian akun BimxzBugxz V2 Black Red Neon")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            display: "block",
            background: "linear-gradient(135deg, #000, #ff0040)",
            border: "1px solid #ff0040",
            borderRadius: "8px",
            padding: "11px",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "800",
            textAlign: "center",
            textDecoration: "none",
            boxShadow: "0 0 15px rgba(255,0,64,0.3)",
            letterSpacing: "0.5px",
          }}
        >
          📞 UPGRADE V2
        </a>
        <button
          onClick={logout}
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            padding: "11px",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          🚪 KELUAR
        </button>
      </div>

      <div style={{
        marginTop: "14px",
        background: "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,0,5,0.6))",
        border: "1px solid rgba(255,0,64,0.25)",
        borderRadius: "12px",
        padding: "14px",
        textAlign: "center",
      }}>
        <p className="digital-font" style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", margin: "0 0 6px" }}>
          📱 DOWNLOAD APK BLACK RED NEON V2
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px", margin: "0 0 10px", lineHeight: 1.4 }}>
          Install sebagai APK Android native via PWA — 120FPS ultra smooth<br />
          Black • White • Red Neon Digital • Real Baileys • All Features Work
        </p>
        <button
          onClick={() => {
            if ('serviceWorker' in navigator) {
              alert("📲 Untuk install APK:\n1. Buka menu browser (titik 3 di kanan atas)\n2. Pilih 'Tambahkan ke Layar Utama' / 'Install App'\n3. Atau buka di Chrome Android dan akan muncul prompt install otomatis!\n\nLogo akan pakai logo BimxZ BugXZ hitam-merah keren! 🔥");
            }
          }}
          style={{
            background: "linear-gradient(135deg, #000, #ff0040)",
            border: "1.5px solid #ff0040",
            borderRadius: "8px",
            padding: "10px 18px",
            color: "#fff",
            fontWeight: "800",
            cursor: "pointer",
            fontSize: "11px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 0 15px rgba(255,0,64,0.3)",
          }}
        >
          ⬇️ INSTALL PWA → APK
        </button>
      </div>
    </div>
  );
}
