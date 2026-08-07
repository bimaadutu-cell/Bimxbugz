"use client";
import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";

interface UserRow {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const DURATION_OPTIONS = [
  { label: "7 Hari", value: 7 },
  { label: "14 Hari", value: 14 },
  { label: "30 Hari", value: 30 },
  { label: "90 Hari", value: 90 },
  { label: "Seumur Hidup", value: -1 },
];

export default function AdminSection() {
  const { token, setBackground, refreshBackground } = useApp();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [tab, setTab] = useState<"users" | "background" | "announcement">("users");
  const [form, setForm] = useState({ username: "", password: "", role: "user", duration: 30 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgType, setBgType] = useState<"image" | "video">("image");
  const [bgLoading, setBgLoading] = useState(false);
  const [bgData, setBgData] = useState<any>(null);
  const [announcement, setAnnouncement] = useState("");
  const [annMsg, setAnnMsg] = useState("");

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) setUsers(await res.json());
  }, [token]);

  const fetchBg = useCallback(async () => {
    const res = await fetch("/api/admin/background", { cache: "no-store" });
    if (res.ok) setBgData(await res.json());
  }, []);

  useEffect(() => { fetchUsers(); fetchBg(); }, [fetchUsers, fetchBg]);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: form.role,
          durationDays: form.duration,
        }),
      });
      if (res.ok) {
        setMsg("✅ Akun V2 berhasil dibuat! Black Red Neon active!");
        setForm({ username: "", password: "", role: "user", duration: 30 });
        await fetchUsers();
      } else {
        const d = await res.json();
        setMsg(`❌ ${d.error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Hapus akun ini permanen? Black Red Edition?")) return;
    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchUsers();
  };

  const extendUser = async (id: number, days: number) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ extendDays: days }),
    });
    await fetchUsers();
  };

  const uploadBackground = async () => {
    if (!bgFile) return;
    setBgLoading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", bgFile);
      fd.append("type", bgType);
      const res = await fetch("/api/admin/background", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setBackground({ url: data.url, type: data.type as any });
        await refreshBackground();
        await fetchBg();
        setMsg(`✅ ${data.message} • ${((data.size || 0) / 1024 / 1024).toFixed(2)}MB • REAL-TIME GLOBAL!`);
        setBgFile(null);
      } else {
        setMsg(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setMsg(`❌ Upload error: ${e.message}`);
    } finally {
      setBgLoading(false);
    }
  };

  const deleteBackground = async () => {
    if (!confirm("Hapus background global? Kembali ke black red default?")) return;
    const res = await fetch("/api/admin/background", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setBackground({ url: null, type: "image" });
      await refreshBackground();
      await fetchBg();
      setMsg("✅ Background dihapus — kembali ke black red neon digital default!");
    }
  };

  const sendAnnouncement = async () => {
    if (!announcement.trim()) return;
    const res = await fetch("/api/announcement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: announcement }),
    });
    if (res.ok) {
      setAnnMsg("✅ Pengumuman V2 terkirim ke semua user online real-time!");
      setAnnouncement("");
    } else {
      setAnnMsg("❌ Gagal kirim");
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "∞ Lifetime";
    return new Date(iso).toLocaleDateString("id-ID");
  };

  const roleColor: Record<string, string> = {
    developer: "#ff0040",
    owner: "#ffffff",
    reseller: "#ffaaaa",
    user: "rgba(255,255,255,0.6)",
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/logo-bimxz.png" alt="logo" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #ff0040" }} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
          <h2 className="digital-font" style={{
            background: "linear-gradient(135deg, #ffffff, #ff0040)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "18px",
            fontWeight: "900",
            filter: "drop-shadow(0 0 8px rgba(255,0,64,0.4))",
          }}>
            ⚙️ ADMIN PANEL V2 — BLACK RED
          </h2>
        </div>
        <p className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "1px" }}>
          REAL BAILEYS CONTROL • BACKGROUND GLOBAL FIX • 120FPS • VERCEL READY
        </p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: "users", label: "👥 Kelola Akun V2" },
          { id: "background", label: "🖼️ Latar Global FIX" },
          { id: "announcement", label: "📢 Pengumuman Live" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: "8px",
              border: tab === t.id ? "1.5px solid #ff0040" : "1px solid rgba(255,255,255,0.1)",
              background: tab === t.id
                ? "linear-gradient(135deg, #000, #ff0040)"
                : "rgba(0,0,0,0.5)",
              color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)",
              fontSize: "11px",
              fontWeight: tab === t.id ? "800" : "400",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: tab === t.id ? "0 0 12px rgba(255,0,64,0.3)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div style={{
          background: msg.startsWith("✅") ? "rgba(0,255,136,0.08)" : "rgba(255,0,64,0.12)",
          border: `1px solid ${msg.startsWith("✅") ? "rgba(0,255,136,0.3)" : "rgba(255,0,64,0.4)"}`,
          borderRadius: "8px",
          padding: "10px 12px",
          color: msg.startsWith("✅") ? "#00ff88" : "#ff5566",
          fontSize: "11px",
          marginBottom: "12px",
          textAlign: "center",
        }}>
          {msg}
        </div>
      )}

      {tab === "users" && (
        <div>
          <div className="glass-card-black-red" style={{ borderRadius: "12px", padding: "18px", marginBottom: "14px" }}>
            <h3 className="digital-font" style={{ color: "#ffffff", fontSize: "12px", fontWeight: "700", marginBottom: "14px", textShadow: "0 0 8px #ff0040" }}>
              ➕ BUAT AKUN BARU V2 — BLACK RED NEON
            </h3>
            <form onSubmit={createUser} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                  placeholder="Username baru V2"
                  required
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,0,64,0.3)", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13px" }}
                />
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Password baru"
                  required
                  style={{ width: "100%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,0,64,0.3)", borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13px" }}
                />
              </div>

              <div>
                <p className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", marginBottom: "6px" }}>PILIH ROLE V2:</p>
                <div className="flex gap-2">
                  {["user", "reseller", "owner"].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, role: r }))}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: form.role === r ? "1px solid #ff0040" : "1px solid rgba(255,255,255,0.1)",
                        background: form.role === r ? "linear-gradient(135deg, #000, #ff0040)" : "rgba(0,0,0,0.4)",
                        color: form.role === r ? "#fff" : "rgba(255,255,255,0.5)",
                        fontSize: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {r === "user" ? "👤 User" : r === "reseller" ? "🧑‍💼 Reseller" : "🔱 Owner"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", marginBottom: "6px" }}>MASA AKTIF V2:</p>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, duration: d.value }))}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: form.duration === d.value ? "1px solid #ff0040" : "1px solid rgba(255,255,255,0.08)",
                        background: form.duration === d.value ? "#ff0040" : "rgba(0,0,0,0.4)",
                        color: form.duration === d.value ? "#fff" : "rgba(255,255,255,0.5)",
                        fontSize: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #000, #ff0040)",
                  border: "1.5px solid #ff0040",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#fff",
                  fontWeight: "800",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  boxShadow: "0 0 15px rgba(255,0,64,0.3)",
                  letterSpacing: "1px",
                }}
              >
                {loading ? "⏳ Membuat..." : "✅ BUAT AKUN V2 — BLACK RED"}
              </button>
            </form>
          </div>

          <div className="glass-card-black-white" style={{ borderRadius: "12px", padding: "16px" }}>
            <h3 className="digital-font" style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", marginBottom: "12px" }}>
              📋 DAFTAR AKUN ({users.length}) — REAL DATABASE
            </h3>
            <div className="flex flex-col gap-2">
              {users.map(u => (
                <div key={u.id} style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `2px solid ${roleColor[u.role] || "#fff"}`,
                  borderRadius: "8px",
                  padding: "10px 12px",
                }}>
                  <div className="flex items-start justify-between gap-2">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="digital-font" style={{ color: "#fff", fontSize: "11px", fontWeight: "700", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.username} {u.id === 1 ? "👑" : ""}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span style={{
                          color: roleColor[u.role] || "#fff",
                          fontSize: "8px",
                          fontWeight: "700",
                          background: `${roleColor[u.role]}22`,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          border: `1px solid ${roleColor[u.role]}44`,
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                        <span style={{ color: u.isActive ? "#00ff88" : "#ff4466", fontSize: "9px" }}>
                          {u.isActive ? "● Aktif" : "● Non-aktif"}
                        </span>
                        <span className="digital-font" style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px" }}>
                          Exp: {formatDate(u.expiresAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => extendUser(u.id, 30)}
                        title="+30 hari"
                        style={{
                          padding: "4px 7px",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "4px",
                          color: "#fff",
                          fontSize: "9px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        +30D
                      </button>
                      {u.id !== 1 && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          style={{
                            padding: "4px 7px",
                            background: "rgba(255,0,64,0.12)",
                            border: "1px solid rgba(255,0,64,0.3)",
                            borderRadius: "4px",
                            color: "#ff4466",
                            fontSize: "9px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "background" && (
        <div className="glass-card-black-red" style={{ borderRadius: "12px", padding: "20px" }}>
          <h3 className="digital-font" style={{ color: "#ffffff", fontSize: "12px", fontWeight: "700", marginBottom: "12px", textShadow: "0 0 8px #ff0040" }}>
            🖼️ ATUR LATAR BELAKANG GLOBAL — FIX REAL-TIME V2
          </h3>

          {bgData?.url && (
            <div style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,0,64,0.2)",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "12px",
            }}>
              <p className="digital-font" style={{ color: "#00ff88", fontSize: "9px", margin: "0 0 6px" }}>✅ SAAT INI AKTIF — TERPASANG KE SEMUA USER:</p>
              <p style={{ color: "#fff", fontSize: "11px", margin: 0, wordBreak: "break-all" }}>{bgData.url}</p>
              <p className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "8px", margin: "4px 0 0" }}>
                Type: {bgData.type?.toUpperCase()} • {bgData.exists ? "File exists ✅" : "File missing ❌"} • Updated: {bgData.updatedAt ? new Date(bgData.updatedAt).toLocaleString("id-ID") : "-"}
              </p>
              <div style={{ marginTop: "8px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,0,64,0.2)", maxHeight: 120 }}>
                {bgData.type === "video" ? (
                  <video src={bgData.url} style={{ width: "100%", maxHeight: 120, objectFit: "cover" }} muted loop autoPlay />
                ) : (
                  <img src={bgData.url} style={{ width: "100%", maxHeight: 120, objectFit: "cover" }} alt="current bg" />
                )}
              </div>
            </div>
          )}

          <p className="digital-font" style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px", marginBottom: "14px", lineHeight: 1.5 }}>
            Background akan otomatis refresh tiap 8 detik ke semua client via AppContext polling. Vercel-ready, cache-busted, persistent uploads folder.
          </p>

          <div className="flex gap-2 mb-4">
            {(["image", "video"] as const).map(t => (
              <button
                key={t}
                onClick={() => setBgType(t)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: bgType === t ? "1.5px solid #ff0040" : "1px solid rgba(255,255,255,0.1)",
                  background: bgType === t ? "linear-gradient(135deg, #000, #ff0040)" : "rgba(0,0,0,0.5)",
                  color: bgType === t ? "#fff" : "rgba(255,255,255,0.5)",
                  fontWeight: "700",
                  fontSize: "11px",
                  cursor: "pointer",
                  boxShadow: bgType === t ? "0 0 12px rgba(255,0,64,0.3)" : "none",
                }}
              >
                {t === "image" ? "🖼️ Gambar" : "🎬 Video"}
              </button>
            ))}
          </div>

          <div
            style={{
              border: `2px dashed ${bgFile ? "#00ff88" : "rgba(255,0,64,0.3)"}`,
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              marginBottom: "12px",
              cursor: "pointer",
              position: "relative",
              background: bgFile ? "rgba(0,255,136,0.05)" : "rgba(0,0,0,0.3)",
              transition: "all 0.2s",
            }}
            onClick={() => document.getElementById("bgFileInput")?.click()}
          >
            <input
              id="bgFileInput"
              type="file"
              accept={bgType === "image" ? "image/*" : "video/*"}
              style={{ display: "none" }}
              onChange={(e) => setBgFile(e.target.files?.[0] || null)}
            />
            {bgFile ? (
              <div>
                <p style={{ color: "#00ff88", fontSize: "12px", fontWeight: "700", margin: "0 0 4px" }}>
                  ✅ {bgFile.name}
                </p>
                <p className="digital-font" style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", margin: 0 }}>
                  {(bgFile.size / 1024 / 1024).toFixed(2)} MB • Type: {bgType.toUpperCase()} • Siap upload!
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>📁</div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: 0 }}>
                  Klik untuk pilih {bgType === "image" ? "gambar" : "video"}<br />
                  <span className="digital-font" style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>Maks 2GB • JPG/PNG/MP4/WEBM</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={uploadBackground}
              disabled={!bgFile || bgLoading}
              style={{
                flex: 1,
                background: bgFile ? "linear-gradient(135deg, #000, #ff0040)" : "rgba(255,255,255,0.06)",
                border: bgFile ? "1.5px solid #ff0040" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "12px",
                color: bgFile ? "#fff" : "rgba(255,255,255,0.3)",
                fontWeight: "800",
                cursor: bgFile ? "pointer" : "not-allowed",
                fontSize: "11px",
                letterSpacing: "1px",
                boxShadow: bgFile ? "0 0 15px rgba(255,0,64,0.3)" : "none",
              }}
            >
              {bgLoading ? "⏳ UPLOADING..." : "🚀 UPLOAD & PASANG GLOBAL REAL-TIME"}
            </button>
            {bgData?.url && (
              <button
                onClick={deleteBackground}
                style={{
                  padding: "12px 14px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                🗑️ HAPUS
              </button>
            )}
          </div>
        </div>
      )}

      {tab === "announcement" && (
        <div className="glass-card-black-red" style={{ borderRadius: "12px", padding: "20px" }}>
          <h3 className="digital-font" style={{ color: "#ffffff", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
            📢 KIRIM PENGUMUMAN GLOBAL — REAL-TIME POPUP
          </h3>
          <p className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", marginBottom: "12px" }}>
            PENGUMUMAN AKAN MUNCUL SEBAGAI POP-UP BANNER DI SEMUA USER ONLINE (POLLING 30s)
          </p>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Ketik pengumuman penting V2 black red neon di sini..."
            rows={4}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.6)",
              border: "1.5px solid rgba(255,0,64,0.3)",
              borderRadius: "8px",
              padding: "12px",
              color: "#fff",
              fontSize: "13px",
              marginBottom: "12px",
              resize: "vertical",
            }}
          />
          {annMsg && (
            <p style={{ color: annMsg.startsWith("✅") ? "#00ff88" : "#ff5566", fontSize: "11px", marginBottom: "12px", textAlign: "center" }}>
              {annMsg}
            </p>
          )}
          <button
            onClick={sendAnnouncement}
            disabled={!announcement.trim()}
            style={{
              width: "100%",
              background: announcement.trim() ? "linear-gradient(135deg, #000, #ff0040)" : "rgba(255,255,255,0.06)",
              border: announcement.trim() ? "1.5px solid #ff0040" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "12px",
              color: announcement.trim() ? "#fff" : "rgba(255,255,255,0.3)",
              fontWeight: "800",
              cursor: announcement.trim() ? "pointer" : "not-allowed",
              fontSize: "11px",
              letterSpacing: "1px",
              boxShadow: announcement.trim() ? "0 0 15px rgba(255,0,64,0.3)" : "none",
            }}
          >
            📢 KIRIM KE SEMUA PENGGUNA ONLINE V2
          </button>
        </div>
      )}
    </div>
  );
}
