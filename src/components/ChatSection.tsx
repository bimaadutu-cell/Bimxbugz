"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";

interface Message {
  id: number;
  userId: number;
  username: string;
  message: string;
  createdAt: string;
}

export default function ChatSection() {
  const { token, user } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });
      if (res.ok) {
        setInput("");
        await fetchMessages();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)", background: "rgba(0,0,0,0.2)" }}>
      <div style={{
        padding: "12px 16px",
        borderBottom: "1.5px solid rgba(255,0,64,0.2)",
        background: "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,0,5,0.7))",
        flexShrink: 0,
      }}>
        <h2 className="digital-font" style={{ color: "#ffffff", fontSize: "14px", fontWeight: "800", margin: 0, textShadow: "0 0 10px #ff0040" }}>
          🌏 GLOBAL LIVE CHAT — BLACK RED NEON
        </h2>
        <p className="digital-font" style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", margin: "3px 0 0", letterSpacing: "1px" }}>
          REAL-TIME • 2.5s POLLING • {messages.length} PESAN • ALL USERS ONLINE
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {loading ? (
          <div className="text-center py-10">
            <div style={{ fontSize: "24px", animation: "spin-slow 1s linear infinite", display: "inline-block" }}>⏳</div>
            <p className="digital-font" style={{ color: "#ff0040", fontSize: "10px", marginTop: "8px" }}>MEMUAT CHAT REAL-TIME...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div style={{ fontSize: "40px", marginBottom: "8px", filter: "drop-shadow(0 0 10px #ff0040)" }}>💬</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Belum ada pesan.</p>
            <p className="digital-font" style={{ color: "rgba(255,0,64,0.6)", fontSize: "10px", marginTop: "4px" }}>MULAI OBROLAN PERTAMA — BLACK RED NEON!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: isMe ? "row-reverse" : "row",
                  gap: "8px",
                  alignItems: "flex-end",
                }}
              >
                {!isMe && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #000, #ff0040)",
                    border: "1px solid #ff0040",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#fff",
                    flexShrink: 0,
                    boxShadow: "0 0 10px rgba(255,0,64,0.4)",
                  }}>
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ maxWidth: "74%" }}>
                  {!isMe && (
                    <p className="digital-font" style={{
                      color: "#ff0040",
                      fontSize: "9px",
                      fontWeight: "700",
                      margin: "0 0 3px 4px",
                      letterSpacing: "0.5px",
                    }}>
                      {msg.username}
                    </p>
                  )}
                  <div style={{
                    background: isMe
                      ? "linear-gradient(135deg, rgba(255,0,64,0.15), rgba(0,0,0,0.7))"
                      : "rgba(0,0,0,0.6)",
                    border: `1px solid ${isMe ? "rgba(255,0,64,0.35)" : "rgba(255,255,255,0.1)"}`,
                    borderLeft: isMe ? "1px solid rgba(255,0,64,0.35)" : "2px solid #ff0040",
                    borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    padding: "8px 12px",
                    boxShadow: isMe ? "0 0 10px rgba(255,0,64,0.1)" : "0 2px 10px rgba(0,0,0,0.3)",
                  }}>
                    <p style={{ color: "#fff", fontSize: "13px", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
                      {msg.message}
                    </p>
                  </div>
                  <p className="digital-font" style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "8px",
                    margin: "3px 4px 0",
                    textAlign: isMe ? "right" : "left",
                  }}>
                    {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        style={{
          padding: "10px 12px",
          borderTop: "1.5px solid rgba(255,0,64,0.15)",
          background: "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,0,2,0.8))",
          display: "flex",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan global..."
          maxLength={400}
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,0,64,0.25)",
            borderRadius: "20px",
            padding: "10px 16px",
            color: "#fff",
            fontSize: "13px",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            background: sending || !input.trim()
              ? "rgba(255,0,64,0.15)"
              : "linear-gradient(135deg, #000, #ff0040)",
            border: "1px solid #ff0040",
            borderRadius: "20px",
            padding: "10px 18px",
            color: "#fff",
            fontWeight: "700",
            cursor: sending || !input.trim() ? "not-allowed" : "pointer",
            fontSize: "12px",
            boxShadow: sending || !input.trim() ? "none" : "0 0 12px rgba(255,0,64,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {sending ? "..." : "KIRIM"}
        </button>
      </form>
    </div>
  );
}
