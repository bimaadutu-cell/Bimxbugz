import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const BIMZAI_SYSTEM_PROMPT = `Kamu adalah Bimzai V2, asisten AI paling brutal dari BimxzBugxz by BimzOfficial — tema Black Red White Neon Digital, 120FPS ultra-smooth, payload V2 brutal real Baileys v6.7.18.

KARAKTER:
- Ramah, lucu, gaul Indonesia abis, nyeleneh, semangat 120FPS
- Pakai bahasa Indonesia santai: wkwkwk, anjay, sikikk, brutal, ganas, mantul
- Selalu sebut diri "Bimzai V2" & "BimxzBugxz by BimzOfficial Black Red Neon"
- Mood: hyper-enerjik, super smooth 120FPS no patah-patah
- Jika ditanya fitur: jelaskan dengan antusias + detail V2 upgrades (payload 20k+, dual QR & Pairing real WA, cinema HD 7 server, background global real-time)
- Ingatkan: alat hanya untuk penipu/scammer, pakai tanggung jawab
- Jangan kasih tutorial kejahatan
- Signature: 🔥 SIKIKKK AYAAAA!!! Black Red White Neon V2!`;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// Gemini key handler (Google AI Studio new format)
async function callGeminiAPI(apiKey: string, messages: ChatMessage[]): Promise<string | null> {
  // Try multiple Gemini models and endpoints
  const models = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ];

  // Convert OpenAI-style messages to Gemini format
  const systemPrompt = messages.find(m => m.role === "system")?.content || "";
  const chatMessages = messages.filter(m => m.role !== "system");

  // Build contents array for Gemini
  const contents = chatMessages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Prepend system prompt to first user message if exists
  if (systemPrompt && contents.length > 0 && contents[0].role === "user") {
    contents[0].parts[0].text = `${systemPrompt}\n\nUser: ${contents[0].parts[0].text}`;
  }

  for (const model of models) {
    try {
      // Try v1beta with API key as query param (new AQ format)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: 1200,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          ],
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        console.log(`[Gemini ${model}] failed ${res.status}: ${t.slice(0, 300)}`);
        // Try alternative endpoint with x-goog-api-key header
        if (t.includes("API_KEY_INVALID") || t.includes("API key")) {
          continue;
        }
        
        // Try with header instead of query param for AQ tokens
        try {
          const res2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                maxOutputTokens: 1200,
              },
            }),
          });
          if (res2.ok) {
            const data2 = await res2.json();
            const text = data2.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              console.log(`[Gemini ${model}] success via x-goog-api-key header`);
              return text;
            }
          }
        } catch {}
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`[Gemini] success with ${model} via key param`);
        return text;
      }
    } catch (err: any) {
      console.log(`[Gemini ${model}] error:`, err?.message);
      continue;
    }
  }

  // Try Google AI Studio OpenAI-compatible endpoint (if AQ tokens work there)
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash",
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        max_tokens: 1000,
        temperature: 0.9,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        console.log("[Gemini OpenAI compat] success");
        return reply;
      }
    } else {
      console.log("[Gemini OpenAI compat] failed", await res.text().then(t=>t.slice(0,300)));
    }
  } catch (e: any) {
    console.log("[Gemini OpenAI compat] error", e?.message);
  }

  return null;
}

async function callAllProviders(apiKey: string, messages: ChatMessage[]): Promise<string | null> {
  // 1. Try Gemini with AQ key (primary for this key format)
  const geminiResult = await callGeminiAPI(apiKey, messages);
  if (geminiResult) return geminiResult;

  // 2. Try Flaz / AI Arena (old sk- format, but try anyway)
  const providers = [
    {
      name: "Flaz/AI Arena",
      url: process.env.AI_ARENA_BASE_URL || "https://ai.flaz.id/v1/chat/completions",
      key: process.env.FLAZ_API_KEY || process.env.AI_ARENA_API_KEY || apiKey,
      models: ["gemini-2.5-flash", "claude-haiku-4-5", "gpt-4o-mini", "deepseek-chat", "gemini-2.0-flash"],
    },
    {
      name: "OpenRouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: process.env.OPENROUTER_API_KEY || apiKey,
      models: ["google/gemini-flash-1.5-8b", "openai/gpt-4o-mini", "anthropic/claude-3-haiku"],
    },
    {
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.GROQ_API_KEY || apiKey,
      models: ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"],
    },
  ];

  for (const provider of providers) {
    if (!provider.key) continue;
    for (const model of provider.models) {
      try {
        const controller = new AbortController();
        const to = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.key}`,
            ...(provider.name === "OpenRouter" ? {
              "HTTP-Referer": "https://bimxzbugxz-v2.com",
              "X-Title": "BimxzBugxz V2",
            } : {}),
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: 900,
            temperature: 0.88,
          }),
          signal: controller.signal,
        });
        clearTimeout(to);
        if (!res.ok) continue;
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          console.log(`[${provider.name}] success ${model}`);
          return reply;
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  const { message, history } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Pesan tidak boleh kosong" }, { status: 400 });

  const chatMessages: ChatMessage[] = [
    { role: "system", content: BIMZAI_SYSTEM_PROMPT },
    ...((history || []).slice(-14).map((m: any) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))),
    { role: "user", content: message },
  ];

  // Use API key from env only - never hardcode! Set GEMINI_API_KEY in Vercel env vars
  const aqKey = process.env.GEMINI_API_KEY || process.env.AI_ARENA_API_KEY || process.env.FLAZ_API_KEY || "";
  
  const aiReply = aqKey ? await callAllProviders(aqKey, chatMessages) : null;

  if (aiReply) {
    return NextResponse.json({ reply: aiReply, source: "gemini-aq-live-v2", model: "bimzai-v2-black-red" });
  }

  // Fallback ultra-smart when all providers fail (should still happen if AQ key invalid for current endpoints)
  const lower = message.toLowerCase();
  let fallback = "";

  if (lower.includes("apa itu") && lower.includes("bimxz")) {
    fallback = `Woy kak ${payload.username}! 🔥 BimxZ BugXZ V2 Black Red White Neon ini platform paling BRUTAL anti-scammer sedunia! 

🚀 **V2 UPGRADE 120FPS:**
• 25 Bug Attack V2 payload 20k-50k+ invisible chars — bikin WA penipu nge-freeze, force close, lag parah
• Kill Group V2 Real Baileys — invisible 10k ZWSP, tak kasat mata, grup auto suspend permanen
• Dual sender: QR Scan & Pairing Code 8 digit — ASLI dari server WA resmi pakai @whiskeysockets/baileys v6.7.18!
• Cinema HD V2: 150+ film real TMDB ID, 7 server (VidLink Pro, VidSrc To/CC V2, EmbedSU, SuperEmbed, AutoEmbed, P-Stream) — semua working 1080p
• Background global real-time 8s polling — admin upload langsung ke semua user
• AI Arena V2: support Gemini (new format), Flaz, OpenRouter, Groq — 46+ models
• Tema hitam-merah-putih neon digital + 120FPS ultra-smooth tanpa patah!

Sikikkk ayyyy! BimxZ BugXZ V2 the best! 💀🚀❤️‍🔥`;
  } else if (lower.includes("film") || lower.includes("cinema") || lower.includes("nonton") || lower.includes("movie")) {
    fallback = `Nah untuk film nih kak ${payload.username} 🎬🍿

Di V2 kita sudah FIX TOTAL:

📽️ **150+ Film Real TMDB ID** — semua ID asli (299536 Avengers IW, 299534 Endgame, 155 Dark Knight, 27205 Inception, 157336 Interstellar, 603 Matrix, dll) — tidak perlu TMDB API key, langsung pakai ID real yang tested di server streaming!

🎞️ **7 Server HD 1080p Working:**
1. VidLink Pro — https://vidlink.pro/movie/{id}
2. VidSrc To — https://vidsrc.to/embed/movie/{id}
3. VidSrc CC V2 — https://vidsrc.cc/v2/embed/movie/{id}
4. Embed SU — https://embed.su/embed/movie/{id}
5. SuperEmbed/MultiEmbed
6. AutoEmbed CC
7. P-Stream

Jika TMDB_API_KEY di-set di .env, akan fetch live dari TMDB API popular/trending/top_rated dll. Jika tidak ada key, fallback ke 150 film real yang tetap bisa di-stream 100% work!

Coba klik film mana aja — player akan langsung load HD tanpa iklan berat! Sikikkk! 🔥`;
  } else if (lower.includes("fps") || lower.includes("120") || lower.includes("patah") || lower.includes("smooth") || lower.includes("optimasi")) {
    fallback = `Oke soal 120FPS nih kak! 🚀💨

BimxZ V2 sekarang udah **ULTRA-SMOOTH 120FPS TANPA PATAH** karena:

⚡ **Optimasi V2:**
• Semua animasi pakai \`transform: translateZ(0)\` & \`will-change: transform\` biar GPU-accelerated
• \`backface-visibility: hidden\` + \`perspective: 1000px\` untuk compositing layer
• StarField canvas pakai \`requestAnimationFrame\` 120Hz, bukan setInterval
• Glass cards pakai \`backdrop-filter\` tapi di-optimized dengan \`contain: layout style paint\`
• Scrollbar-hide + content-visibility auto
• Semua transition pakai \`cubic-bezier(0.175, 0.885, 0.32, 1.275)\` yang smooth di 120Hz
• Background layer pakai \`will-change: transform\` + filter contrast/brightness GPU
• CSS keyframes di-hardware accelerate, tidak pakai top/left tapi transform

Hasilnya: splash 5 detik, login, dashboard, cinema scrolling — semua smooth 120FPS di HP flagship! Di HP kentang tetap 60FPS stabil tanpa jank!

Black Red White Neon Digital tetap menyala! 🔥 Sikikkk!`;
  } else if (lower.includes("ai") || lower.includes("bimzai") || lower.includes("arena") || lower.includes("gemini") || lower.includes("apikey")) {
    fallback = `Yooo soal AI nih kak ${payload.username}! 🤖❤️‍🔥

**API Key Gemini:** Format baru dari Google AI Studio! V2 udah support full!

🔑 **Format Gemini API Key:**
• Endpoint: \`generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY\`
• Atau pakai header \`x-goog-api-key: YOUR_KEY\`
• Model yang dicoba: gemini-2.0-flash-exp, 1.5-flash, 2.5-flash, dll
• Fallback ke Flaz/AI Arena, OpenRouter, Groq jika Gemini fail

Di .env / Vercel env sudah di-set:
\`\`\`
GEMINI_API_KEY=your_gemini_key_here
AI_ARENA_API_KEY=your_key_here
FLAZ_API_KEY=your_key_here
\`\`\`

Jika key valid dan Google project-nya billing enabled, harusnya langsung live! Kalau masih fail mungkin project Google kamu perlu enable Generative Language API atau pakai API key format lama AIza... di https://aistudio.google.com/app/apikey

Sementara ini aku pakai otak fallback super-smart dulu — tetap jawab keren! Bimzai V2 Black Red Neon ready! 🚀`;
  } else {
    fallback = `Yo ${payload.username}! 😎 Bimzai V2 Black Red Neon 120FPS di sini!

Kamu bilang: "${message}"

BimxZ BugXZ V2 sekarang:
• 25 Bug V2 brutal 20k-50k chars real Baileys ✅
• Dual QR & Pairing Code asli server WA ✅
• 150+ film HD real TMDB ID + 7 server working ✅
• Background global real-time fix ✅
• Tema hitam-merah-putih neon digital + 120FPS smooth ✅
• AI Arena ready pakai Gemini key (set di env) ✅

Mau dibahas yang mana dulu kak? Tanya aja bebas — aku siap jawab se-brutal mungkin! Sikikkk ayaa! 🔥💀❤️‍🔥`;
  }

  // Slight delay to feel natural
  await new Promise(r => setTimeout(r, 500));

  return NextResponse.json({ reply: fallback, source: "bimzai-v2-fallback-ultra-smart", note: "Set GEMINI_API_KEY or OPENAI_API_KEY in Vercel env vars for live AI" });
}
