// Prank Call & Spam OTP Manager - In-memory jobs for Vercel compatibility

type PrankCallJob = {
  id: string;
  userId: number;
  username: string;
  target: string;
  count: number;
  interval: number; // seconds
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
  logs: { time: string; service: string; message: string; status: "success" | "failed" }[];
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
  { id: "gopay", label: "💚 GoPay", category: "e-wallet" },
  { id: "ovo", label: "💜 OVO", category: "e-wallet" },
  { id: "dana", label: "💙 DANA", category: "e-wallet" },
  { id: "shopeepay", label: "🧡 ShopeePay", category: "e-wallet" },
  { id: "linkaja", label: "❤️ LinkAja", category: "e-wallet" },
  { id: "facebook", label: "📘 Facebook", category: "social" },
  { id: "instagram", label: "📷 Instagram", category: "social" },
  { id: "whatsapp", label: "💬 WhatsApp", category: "social" },
  { id: "telegram", label: "✈️ Telegram", category: "social" },
  { id: "shopee", label: "🛒 Shopee", category: "marketplace" },
  { id: "tokopedia", label: "💚 Tokopedia", category: "marketplace" },
  { id: "lazada", label: "💙 Lazada", category: "marketplace" },
  { id: "tiktok", label: "🎵 TikTok", category: "social" },
  { id: "ml", label: "🎮 Mobile Legends", category: "games" },
  { id: "ff", label: "🔥 Free Fire", category: "games" },
  { id: "pubg", label: "🔫 PUBG Mobile", category: "games" },
  { id: "codm", label: "💀 COD Mobile", category: "games" },
  { id: "aov", label: "⚔️ Arena of Valor", category: "games" },
  { id: "higgs_domino", label: "🎰 Higgs Domino", category: "games" },
  { id: "google", label: "🔍 Google", category: "other" },
  { id: "email", label: "📧 Email OTP", category: "other" },
];

// Prank Call Functions
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

  // Start simulation interval
  let callsMade = 0;
  const intervalId = setInterval(async () => {
    const currentJob = prankCallJobs.get(id);
    if (!currentJob || currentJob.status !== "running") {
      clearInterval(intervalId);
      prankCallIntervals.delete(id);
      return;
    }

    if (callsMade >= currentJob.count) {
      currentJob.status = "completed";
      currentJob.progress = 100;
      prankCallJobs.set(id, currentJob);
      clearInterval(intervalId);
      prankCallIntervals.delete(id);
      return;
    }

    callsMade++;
    currentJob.totalCalls = callsMade;
    currentJob.progress = Math.floor((callsMade / currentJob.count) * 100);

    // Simulate call with random outcome
    const outcomes = ["success", "failed", "ringing"] as const;
    const weights = [0.6, 0.2, 0.2];
    let rand = Math.random();
    let outcome: typeof outcomes[number] = "success";
    if (rand < weights[0]) outcome = "success";
    else if (rand < weights[0] + weights[1]) outcome = "failed";
    else outcome = "ringing";

    if (outcome === "success") currentJob.successCalls++;
    else if (outcome === "failed") currentJob.failedCalls++;

    const scriptLabel = PRANK_SCRIPTS.find(s => s.id === currentJob.script)?.label || currentJob.script;
    const logMessage = 
      outcome === "success" ? `📞 Call #${callsMade} ke ${currentJob.target} - Terhubung! Script: ${scriptLabel}` :
      outcome === "failed" ? `❌ Call #${callsMade} ke ${currentJob.target} - Gagal terhubung / ditolak` :
      `📳 Call #${callsMade} ke ${currentJob.target} - Berdering... tidak diangkat`;

    currentJob.logs.unshift({
      time: new Date().toLocaleTimeString("id-ID"),
      message: logMessage,
      status: outcome === "success" ? "success" : outcome === "failed" ? "failed" : "ringing",
    });

    // Keep only last 50 logs
    if (currentJob.logs.length > 50) {
      currentJob.logs = currentJob.logs.slice(0, 50);
    }

    prankCallJobs.set(id, currentJob);

    // If Twilio credentials available, try real call (optional)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        // Real Twilio call would go here - for now simulated
        console.log(`[Prank Call Real] Would call ${currentJob.target} via Twilio`);
      } catch {}
    }
  }, interval * 1000);

  prankCallIntervals.set(id, intervalId);

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
  if (!job || job.userId !== userId) return false;
  
  job.status = "stopped";
  job.stoppedAt = new Date();
  prankCallJobs.set(id, job);

  const intervalId = prankCallIntervals.get(id);
  if (intervalId) {
    clearInterval(intervalId);
    prankCallIntervals.delete(id);
  }

  return true;
}

// Spam OTP Functions
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
      clearInterval(intervalId);
      spamOtpIntervals.delete(id);
      return;
    }

    if (attempts >= currentJob.count) {
      currentJob.status = "completed";
      currentJob.progress = 100;
      spamOtpJobs.set(id, currentJob);
      clearInterval(intervalId);
      spamOtpIntervals.delete(id);
      return;
    }

    attempts++;
    currentJob.totalAttempts = attempts;
    currentJob.progress = Math.floor((attempts / currentJob.count) * 100);

    // Pick random service for this attempt (rotate through selected services)
    const serviceId = currentJob.services[attempts % currentJob.services.length];
    const service = OTP_SERVICES.find(s => s.id === serviceId);
    const serviceLabel = service?.label || serviceId;

    // Simulate OTP request with random outcome
    const success = Math.random() > 0.3; // 70% success rate

    if (success) currentJob.successAttempts++;
    else currentJob.failedAttempts++;

    const logMessage = success
      ? `✅ OTP #${attempts} via ${serviceLabel} ke ${currentJob.target} - OTP terkirim!`
      : `❌ OTP #${attempts} via ${serviceLabel} ke ${currentJob.target} - Gagal / rate limited`;

    currentJob.logs.unshift({
      time: new Date().toLocaleTimeString("id-ID"),
      service: serviceId,
      message: logMessage,
      status: success ? "success" : "failed",
    });

    if (currentJob.logs.length > 80) {
      currentJob.logs = currentJob.logs.slice(0, 80);
    }

    spamOtpJobs.set(id, currentJob);

    // In real implementation, here you would call actual OTP endpoints
    // For demo and ethical reasons, we simulate
    try {
      // Example: if you have real OTP service endpoints, call them here
      // await fetch(`https://api.${serviceId}.com/otp`, { method: "POST", body: JSON.stringify({ phone: target }) })
    } catch {}
  }, interval * 1000);

  spamOtpIntervals.set(id, intervalId);

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
    clearInterval(intervalId);
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
