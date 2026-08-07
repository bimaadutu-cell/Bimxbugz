import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import * as path from "path";
import pino from "pino";
import QRCode from "qrcode";

// Global singleton storage for WA connections per user
type WAState = {
  sock?: any;
  qr?: string;
  qrImage?: string;
  pairingCode?: string;
  isConnected: boolean;
  phone?: string;
  status: "idle" | "qr" | "pairing" | "connecting" | "open" | "close" | "error";
  lastError?: string;
  saveCreds?: () => Promise<void>;
};

const globalStore = globalThis as unknown as {
  __waConnections?: Map<string, WAState>;
  __waLogger?: any;
};

if (!globalStore.__waConnections) {
  globalStore.__waConnections = new Map<string, WAState>();
}

if (!globalStore.__waLogger) {
  globalStore.__waLogger = pino({ level: "silent" });
}

const connections = globalStore.__waConnections!;
const logger = globalStore.__waLogger;

function getAuthDir(userId: string): string {
  const dir = path.join(process.cwd(), "baileys_auth", `user_${userId}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function createWAConnection(userId: string, phoneNumber?: string, method: "qr" | "pairing" = "qr") {
  const authDir = getAuthDir(userId);
  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] as any }));

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: Browsers.ubuntu("Chrome"),
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  const waState: WAState = {
    sock,
    isConnected: false,
    status: "connecting",
    saveCreds,
    phone: phoneNumber,
  };

  connections.set(userId, waState);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update: any) => {
    const { connection, lastDisconnect, qr } = update;
    const current = connections.get(userId);
    if (!current) return;

    if (qr && method === "qr") {
      current.qr = qr;
      current.status = "qr";
      try {
        current.qrImage = await QRCode.toDataURL(qr, { width: 300, margin: 1 });
      } catch {}
      connections.set(userId, current);
    }

    if (qr && method === "pairing" && phoneNumber && !current.pairingCode) {
      try {
        // Need to wait a bit for socket to be ready
        await new Promise(r => setTimeout(r, 2000));
        if (!sock.authState.creds.registered) {
          const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ""));
          current.pairingCode = code;
          current.status = "pairing";
          connections.set(userId, current);
        }
      } catch (err: any) {
        current.lastError = err?.message || "Failed to get pairing code - ensure phone number is correct and WA not already linked";
        current.status = "error";
        connections.set(userId, current);
      }
    }

    if (connection === "open") {
      current.isConnected = true;
      current.status = "open";
      current.qr = undefined;
      current.qrImage = undefined;
      current.pairingCode = undefined;
      connections.set(userId, current);
    }

    if (connection === "close") {
      const boom = lastDisconnect?.error as Boom;
      const statusCode = boom?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      current.isConnected = false;
      current.status = statusCode === DisconnectReason.loggedOut ? "close" : "connecting";
      current.lastError = boom?.message;

      if (statusCode === DisconnectReason.loggedOut) {
        // Clean up auth files
        try {
          fs.rmSync(authDir, { recursive: true, force: true });
        } catch {}
        connections.delete(userId);
      } else if (shouldReconnect) {
        // Auto reconnect after delay
        setTimeout(() => {
          createWAConnection(userId, phoneNumber, method).catch(() => {});
        }, 3000);
      }
    }
  });

  return waState;
}

export function getWAConnection(userId: string): WAState | undefined {
  return connections.get(userId);
}

export async function requestPairingCodeForExisting(userId: string, phoneNumber: string): Promise<string> {
  const wa = connections.get(userId);
  if (!wa?.sock) throw new Error("No active connection. Create QR connection first.");

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  try {
    const code = await wa.sock.requestPairingCode(cleanPhone);
    wa.pairingCode = code;
    wa.phone = cleanPhone;
    wa.status = "pairing";
    connections.set(userId, wa);
    return code;
  } catch (err: any) {
    throw new Error(err?.message || "Failed to request pairing code");
  }
}

export async function disconnectWA(userId: string) {
  const wa = connections.get(userId);
  if (wa?.sock) {
    try {
      await wa.sock.logout();
    } catch {}
  }
  const authDir = getAuthDir(userId);
  try {
    fs.rmSync(authDir, { recursive: true, force: true });
  } catch {}
  connections.delete(userId);
}

export function isWAConnected(userId: string): boolean {
  return connections.get(userId)?.isConnected || false;
}
