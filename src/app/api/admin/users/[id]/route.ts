import { NextRequest, NextResponse } from "next/server";
import { db, getDbStatus, isDatabaseAvailable } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken, hashPassword } from "@/lib/auth";
import { memoryDB } from "@/lib/dbMemory";

function requireDev(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const payload = verifyToken(auth.slice(7));
  if (!payload || payload.role !== "developer") return null;
  return payload;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const dev = requireDev(req);
  if (!dev) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const numId = parseInt(id);

  if (numId === 1) {
    return NextResponse.json({ error: "Tidak bisa hapus developer utama!" }, { status: 400 });
  }

  const dbStatus = getDbStatus();
  if (dbStatus.available && isDatabaseAvailable && db) {
    try {
      await db.delete(users).where(eq(users.id, numId));
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error("DB delete failed, fallback:", e);
    }
  }

  await memoryDB.deleteUser(numId);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const dev = requireDev(req);
  if (!dev) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const numId = parseInt(id);
  const body = await req.json();

  const dbStatus = getDbStatus();
  if (dbStatus.available && isDatabaseAvailable && db) {
    try {
      const updateData: Record<string, unknown> = {};
      if (body.role) updateData.role = body.role;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
      if (body.password) updateData.password = await hashPassword(body.password);
      if (body.extendDays) {
        const [user] = await db.select().from(users).where(eq(users.id, numId)).limit(1);
        const base = user?.expiresAt && user.expiresAt > new Date() ? user.expiresAt : new Date();
        const newExp = new Date(base);
        newExp.setDate(newExp.getDate() + Number(body.extendDays));
        updateData.expiresAt = newExp;
      }
      await db.update(users).set(updateData).where(eq(users.id, numId));
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error("DB patch failed, fallback:", e);
    }
  }

  // Fallback memory
  const updateData: any = {};
  if (body.role) updateData.role = body.role;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.password) updateData.password = await hashPassword(body.password);
  if (body.extendDays) {
    const user = await memoryDB.findUserById(numId);
    const base = user?.expiresAt && user.expiresAt > new Date() ? user.expiresAt : new Date();
    const newExp = new Date(base);
    newExp.setDate(newExp.getDate() + Number(body.extendDays));
    updateData.expiresAt = newExp;
  }
  await memoryDB.updateUser(numId, updateData);
  return NextResponse.json({ success: true });
}
