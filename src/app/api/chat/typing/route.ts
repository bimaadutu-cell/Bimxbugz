import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

type TypingUser = {
  userId: number;
  username: string;
  timestamp: number;
};

const globalStore = globalThis as unknown as {
  __typingUsers?: Map<number, TypingUser>;
};

if (!globalStore.__typingUsers) {
  globalStore.__typingUsers = new Map();
}

const typingUsers = globalStore.__typingUsers!;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ typing: [] });
  
  // Clean old typing users (older than 5 seconds)
  const now = Date.now();
  for (const [userId, user] of typingUsers.entries()) {
    if (now - user.timestamp > 5000) {
      typingUsers.delete(userId);
    }
  }

  return NextResponse.json({
    typing: Array.from(typingUsers.values()),
  });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(auth.slice(7));
  if (!payload) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

  try {
    typingUsers.set(payload.userId, {
      userId: payload.userId,
      username: payload.username,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
