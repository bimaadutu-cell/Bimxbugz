import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const TMP_UPLOAD_DIR = path.join("/tmp", "uploads");
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch {}
}

function isVercel(): boolean {
  return process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
}

export async function GET() {
  try {
    const [bg] = await db.select().from(appSettings).where(eq(appSettings.key, "background")).limit(1);
    const [bgType] = await db.select().from(appSettings).where(eq(appSettings.key, "background_type")).limit(1);
    const [updated] = await db.select().from(appSettings).where(eq(appSettings.key, "background_updated")).limit(1);

    let exists = false;
    if (bg?.value) {
      const cleanPath = bg.value.replace(/\?.*$/, "");
      if (cleanPath.startsWith("/api/background/file/")) {
        exists = true; // API served file, assume exists if DB has it
      } else if (cleanPath.startsWith("/uploads/")) {
        const localPath = path.join(process.cwd(), "public", cleanPath.replace(/^\//, ""));
        const tmpPath = path.join("/tmp", cleanPath.replace(/^\//, ""));
        exists = fs.existsSync(localPath) || fs.existsSync(tmpPath);
      } else if (cleanPath.startsWith("https://")) {
        exists = true; // External Blob URL
      }
    }

    return NextResponse.json({
      url: bg?.value ?? null,
      type: bgType?.value ?? "image",
      updatedAt: updated?.value ? new Date(parseInt(updated.value)).toISOString() : bg?.updatedAt || null,
      exists,
      isVercel: isVercel(),
      timestamp: updated?.value || null,
    });
  } catch (err) {
    console.error("Background GET error", err);
    return NextResponse.json({ url: null, type: "image", error: "Failed to fetch background" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload || payload.role !== "developer") return NextResponse.json({ error: "Hanya developer yang bisa ubah background!" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";

    if (!file) return NextResponse.json({ error: "File tidak ditemukan. Pilih gambar/video!" }, { status: 400 });

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File terlalu besar! Maks 2GB, file kamu ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split(".").pop() || (type === "video" ? "mp4" : "jpg");
    const timestamp = Date.now();
    const filename = `bg-${timestamp}.${ext}`;

    let finalUrl = "";
    let blobUrl: string | null = null;

    // Try Vercel Blob if token available and on Vercel
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (isVercel() && blobToken) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`backgrounds/${filename}`, buffer, {
          access: "public",
          contentType: file.type || (type === "video" ? "video/mp4" : "image/jpeg"),
        });
        blobUrl = blob.url;
        finalUrl = blob.url;
        console.log(`Background uploaded to Vercel Blob: ${blob.url} - ${buffer.length} bytes`);
      } catch (blobErr) {
        console.error("Vercel Blob upload failed, fallback to tmp:", blobErr);
      }
    }

    // Fallback to filesystem (local or /tmp on Vercel)
    if (!blobUrl) {
      const targetDir = isVercel() ? TMP_UPLOAD_DIR : UPLOAD_DIR;
      await ensureDir(targetDir);

      // Clean old backgrounds (keep only latest 3)
      try {
        const files = await readdir(targetDir);
        const bgFiles = files.filter(f => f.startsWith("bg-")).sort();
        if (bgFiles.length > 2) {
          for (let i = 0; i < bgFiles.length - 2; i++) {
            try { await unlink(path.join(targetDir, bgFiles[i])); } catch {}
          }
        }
      } catch {}

      const fullPath = path.join(targetDir, filename);
      await writeFile(fullPath, buffer);
      
      // For Vercel, serve via API route; for local, serve via /uploads/
      if (isVercel()) {
        finalUrl = `/api/background/file/${filename}?v=${timestamp}`;
      } else {
        finalUrl = `/uploads/${filename}?v=${timestamp}`;
      }

      console.log(`Background uploaded to FS: ${fullPath} - ${buffer.length} bytes - URL: ${finalUrl}`);
    }

    // Store clean URL without cache buster in DB for checking, but serve with cache buster
    const cleanUrlForDB = blobUrl || finalUrl.split("?")[0];

    // Upsert background setting
    const [existing] = await db.select().from(appSettings).where(eq(appSettings.key, "background")).limit(1);
    if (existing) {
      await db.update(appSettings).set({ value: finalUrl, updatedAt: new Date() }).where(eq(appSettings.key, "background"));
    } else {
      await db.insert(appSettings).values({ key: "background", value: finalUrl });
    }

    const [existingType] = await db.select().from(appSettings).where(eq(appSettings.key, "background_type")).limit(1);
    if (existingType) {
      await db.update(appSettings).set({ value: type, updatedAt: new Date() }).where(eq(appSettings.key, "background_type"));
    } else {
      await db.insert(appSettings).values({ key: "background_type", value: type });
    }

    const [existingTime] = await db.select().from(appSettings).where(eq(appSettings.key, "background_updated")).limit(1);
    const timeStr = timestamp.toString();
    if (existingTime) {
      await db.update(appSettings).set({ value: timeStr, updatedAt: new Date() }).where(eq(appSettings.key, "background_updated"));
    } else {
      await db.insert(appSettings).values({ key: "background_updated", value: timeStr });
    }

    return NextResponse.json({ 
      url: finalUrl,
      cleanUrl: cleanUrlForDB,
      blobUrl: blobUrl || null,
      type,
      size: buffer.length,
      isVercel: isVercel(),
      usedBlob: !!blobUrl,
      message: "✅ Background berhasil diupload & langsung terpasang ke SEMUA pengguna! Vercel & Local fix!",
      timestamp
    });

  } catch (err: any) {
    console.error("Background upload error:", err);
    return NextResponse.json({ error: `Upload gagal: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(auth.slice(7));
    if (!payload || payload.role !== "developer") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Delete DB settings
    await db.delete(appSettings).where(eq(appSettings.key, "background"));
    await db.delete(appSettings).where(eq(appSettings.key, "background_type"));
    await db.delete(appSettings).where(eq(appSettings.key, "background_updated"));

    // Clean files from both dirs
    for (const dir of [UPLOAD_DIR, TMP_UPLOAD_DIR]) {
      try {
        const files = await readdir(dir);
        for (const f of files) {
          if (f.startsWith("bg-")) {
            try { await unlink(path.join(dir, f)); } catch {}
          }
        }
      } catch {}
    }

    // Try delete from Vercel Blob if token exists and URL is blob
    try {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (blobToken && isVercel()) {
        const { del, list } = await import("@vercel/blob");
        const { blobs } = await list({ prefix: "backgrounds/" });
        for (const blob of blobs) {
          try { await del(blob.url); } catch {}
        }
      }
    } catch {}

    return NextResponse.json({ success: true, message: "Background dihapus, kembali ke default black red neon 120FPS!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
