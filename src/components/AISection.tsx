"use client";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: string;
}

export default function AISection() {
  const { token, user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Halooo kak ${user?.username || "Bosku"}! 👋 Aku Bimzai V2 Black Red Neon dari BimxzBugxz by BimzOfficial! 🤖❤️‍🔥\n\nPlatform kita udah UPGRADE TOTAL nih!\n\n✨ **Yang baru di V2:**\n• Payload bug jauh lebih brutal 20k+ invisible chars\n• Dual sender: QR Scan & Pairing Code ASLI dari server WA resmi (bukan simulasi!)\n• Tema hitam-merah-putih neon digital super ganas 🔥\n• Cinema HD fix dengan 7 server (VidLink, VidSrc To/CC, EmbedSU, SuperEmbed, dll)\n• Background global fix — langsung berubah real-time ke semua user!\n• AI Arena ready — support Flaz, OpenRouter, Groq, Together, OpenAI!\n\nMau tanya apa nih? Atau mau aku jelasin fitur brutal kita? 😎 Sikikk aya!`,
      source: "bimzai-v2-intro",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        role: "assistant",
        content: data.reply || "Maaf, Bimzai lagi error. Coba lagi!",
        source: data.source || "unknown",
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Maaf, koneksi Bimzai bermasalah. Coba lagi! 😅", source: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    "Jelaskan fitur Kill Group V2 real WA",
    "Bedanya QR dan Pairing Code?",
    "List 25 bug attack paling brutal",
    "Cara nonton film HD di cinema?",
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)", background: "rgba(0,0,0,0.15)" }}>
      <div style={{
        padding: "12px 14px",
        borderBottom: "1.5px solid rgba(255,0,64,0.2)",
        background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,0,5,0.8))",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #000, #ff0040)",
          border: "1.5px solid #ff0040",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
          boxShadow: "0 0 15px rgba(255,0,64,0.5)",
        }}>
          🤖
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="digital-font" style={{ color: "#ffffff", fontSize: "13px", fontWeight: "800", margin: 0, textShadow: "0 0 8px #ff0040" }}>Bimzai AI Arena V2 — Black Red Neon</h2>
          <p className="digital-font" style={{ color: "#ff0040", fontSize: "9px", margin: "2px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff0040", display: "inline-block", boxShadow: "0 0 6px #ff0040", animation: "blink-checkmark 1s infinite" }} />
            AI ARENA READY — FLAZ • OPENROUTER • GROQ • TOGETHER • OPENAI • LIVE!
          </p>
        </div>
        <img src="/logo-bimxz.png" alt="logo" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #ff0040", opacity: 0.8 }} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #000, #ff0040)",
                border: "1px solid #ff0040",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                flexShrink: 0,
                boxShadow: "0 0 10px rgba(255,0,64,0.3)",
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: "78%",
              background: msg.role === "user"
                ? "linear-gradient(135deg, rgba(255,0,64,0.12), rgba(0,0,0,0.7))"
                : "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,0,5,0.5))",
              border: msg.role === "user"
                ? "1px solid rgba(255,0,64,0.25)"
                : "1px solid rgba(255,255,255,0.08)",
              borderLeft: msg.role === "assistant" ? "2px solid #ff0040" : undefined,
              borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "10px 12px",
              boxShadow: msg.role === "user" ? "0 0 10px rgba(255,0,64,0.1)" : "0 2px 10px rgba(0,0,0,0.3)",
              position: "relative",
            }}>
              <p style={{
                color: "#ffffff",
                fontSize: "13px",
                margin: 0,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {msg.content}
              </p>
              {msg.source && (
                <p className="digital-font" style={{ color: msg.source.includes("live") ? "#00ff88" : "rgba(255,255,255,0.3)", fontSize: "7px", margin: "6px 0 0", letterSpacing: "1px" }}>
                  SRC: {msg.source.toUpperCase()} • V2 BLACK RED
                </p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #000, #ff0040)",
              border: "1px solid #ff0040",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", boxShadow: "0 0 10px rgba(255,0,64,0.3)",
            }}>🤖</div>
            <div style={{
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,0,64,0.2)",
              borderRadius: "12px 12px 12px 2px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#ff0040",
                    boxShadow: "0 0 6px #ff0040",
                    animation: `blink-checkmark 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <span className="digital-font" style={{ color: "#ff0040", fontSize: "9px", marginLeft: "6px" }}>BIMZAI V2 THINKING — AI ARENA...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 3 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 pb-2" style={{ flexShrink: 0 }}>
          {quickReplies.map(qr => (
            <button
              key={qr}
              onClick={() => { setInput(qr); }}
              style={{
                flexShrink: 0,
                padding: "6px 10px",
                background: "rgba(255,0,64,0.08)",
                border: "1px solid rgba(255,0,64,0.25)",
                borderRadius: "20px",
                color: "#ffaaaa",
                fontSize: "10px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={sendMessage}
        style={{
          padding: "10px 12px",
          borderTop: "1.5px solid rgba(255,0,64,0.15)",
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(10,0,2,0.9))",
          display: "flex",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya Bimzai V2 apa saja — AI Arena ready..."
          maxLength={600}
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,0,64,0.25)",
            borderRadius: "20px",
            padding: "10px 14px",
            color: "#fff",
            fontSize: "13px",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim()
              ? "rgba(255,0,64,0.15)"
              : "linear-gradient(135deg, #000, #ff0040)",
            border: "1px solid #ff0040",
            borderRadius: "20px",
            padding: "10px 16px",
            color: "#fff",
            fontWeight: "700",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontSize: "12px",
            boxShadow: loading || !input.trim() ? "none" : "0 0 12px rgba(255,0,64,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "..." : "KIRIM"}
        </button>
      </form>
    </div>
  );
}
