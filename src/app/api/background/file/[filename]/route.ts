import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { stat, readFile } from "fs/promises";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: only allow bg- files
    if (!filename.startsWith("bg-")) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    // Try multiple locations: /tmp/uploads, public/uploads, baileys workaround
    const possiblePaths = [
      path.join("/tmp", "uploads", filename),
      path.join(process.cwd(), "public", "uploads", filename),
      path.join("/tmp", filename),
      path.join(process.cwd(), "uploads", filename),
    ];

    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileStat = await stat(filePath);
    const fileBuffer = await readFile(filePath);

    // Determine content type from extension
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
    };
    const contentType = mimeMap[ext] || "application/octet-stream";

    // For videos, support range requests for smooth playback without lag
    const range = req.headers.get("range");
    if (range && contentType.startsWith("video/")) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1;
      const chunkSize = end - start + 1;
      const chunk = fileBuffer.slice(start, end + 1);

      return new NextResponse(chunk as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse(fileBuffer as any, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err: any) {
    console.error("Background file serve error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
