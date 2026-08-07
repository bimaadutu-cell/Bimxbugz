import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi!" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
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

    if (user.expiresAt && user.expiresAt < new Date()) {
      // Deactivate expired account
      await db.update(users).set({ isActive: false }).where(eq(users.id, user.id));
      return NextResponse.json({ error: "Username atau Password salah / Akun sudah kadaluarsa / Akses ditolak!" }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt: user.expiresAt?.toISOString() ?? null,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        expiresAt: user.expiresAt?.toISOString() ?? null,
        profilePic: user.profilePic,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
