import { NextRequest, NextResponse } from "next/server";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, signToken } from "@/lib/auth";
import { memoryDB } from "@/lib/dbMemory";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi!" }, { status: 400 });
    }

    let user: any = null;
    let usedFallback = false;

    // Try real DB first if available
    const dbStatus = getDbStatus();
    if (dbStatus.available && isDatabaseAvailable && db) {
      try {
        const [dbUser] = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (dbUser) {
          user = dbUser;
        }
      } catch (dbErr) {
        console.error("DB query failed, falling back to memory:", dbErr);
        usedFallback = true;
      }
    } else {
      usedFallback = true;
    }

    // Fallback to memory DB for Vercel or when DB fails
    if (!user || usedFallback) {
      try {
        const memUser = await memoryDB.findUserByUsername(username);
        if (memUser) {
          user = {
            id: memUser.id,
            username: memUser.username,
            password: memUser.password,
            role: memUser.role,
            expiresAt: memUser.expiresAt,
            createdAt: memUser.createdAt,
            profilePic: memUser.profilePic,
            isActive: memUser.isActive,
          };
        }
      } catch (memErr) {
        console.error("Memory DB fallback also failed:", memErr);
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Username atau Password salah / Akun sudah kadaluarsa / Akses ditolak!" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Username atau Password salah / Akun sudah kadaluarsa / Akses ditolak!" }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Username atau Password salah / Akun sudah kadaluarsa / Akses ditolak!" }, { status: 401 });
    }

    if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
      // Try to deactivate in DB, but don't fail if DB unavailable
      if (dbStatus.available && db) {
        try {
          await db.update(users).set({ isActive: false }).where(eq(users.id, user.id));
        } catch {}
      } else {
        try {
          await memoryDB.updateUser(user.id, { isActive: false });
        } catch {}
      }
      return NextResponse.json({ error: "Username atau Password salah / Akun sudah kadaluarsa / Akses ditolak!" }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt: user.expiresAt?.toISOString?.() ?? user.expiresAt ?? null,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        expiresAt: user.expiresAt?.toISOString?.() ?? user.expiresAt ?? null,
        profilePic: user.profilePic || null,
        createdAt: user.createdAt?.toISOString?.() ?? new Date().toISOString(),
      },
      fallback: usedFallback,
      dbAvailable: dbStatus.available,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error - coba lagi, jika di Vercel pastikan DATABASE_URL di-set atau gunakan fallback memory" }, { status: 500 });
  }
}
