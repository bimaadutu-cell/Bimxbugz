# Fix Vercel Deployment - Logo Hilang & Server Error

## Masalah 1: Server Error saat Login di bimxbugz.vercel.app

**Screenshot:** `Server error` merah di atas tombol login.

**Penyebab:**
- `DATABASE_URL` tidak di-set di Vercel Environment Variables
- `src/db/index.ts` lama throw Error jika `DATABASE_URL` tidak ada → API `/api/auth/login` return 500 → UI tampil "Server error"
- Vercel tidak punya Postgres local seperti `127.0.0.1:5432/app_db`

**Fix V5 yang sudah diterapkan:**
1. `src/db/index.ts` baru: Jika `DATABASE_URL` tidak ada, tidak throw error, tapi fallback ke memory DB
   ```ts
   if (!databaseUrl) {
     console.warn("DATABASE_URL not set, using memory fallback");
     isDatabaseAvailable = false;
   }
   ```
2. `src/lib/dbMemory.ts`: In-memory DB dengan 3 user default (admin0987, reseller01, user01) dengan password hashed, chat, announcements, logs semua in-memory dengan `globalThis`
3. Semua API routes (`login`, `me`, `chat`, `announcement`, `admin/users`, `logs`, `wa/send`) sekarang pakai try/catch: coba real DB dulu, jika gagal fallback ke memoryDB
4. Login tetap work bahkan tanpa Postgres: cek hardcoded users di memory

**Cara deploy benar di Vercel:**

**Opsi A: Pakai Memory Fallback (demo, data hilang setiap cold start)**
- Tidak perlu set DATABASE_URL
- Login tetap work dengan akun default:
  - `admin0987 / pwnya admin?0987#$@` (developer)
  - `reseller01 / reseller123`
  - `user01 / user123`
- Tapi data chat, users baru, logs akan hilang saat Vercel cold start

**Opsi B: Pakai Vercel Postgres / Neon (recommended, persistent)**
1. Di Vercel Dashboard → Storage → Create Database → Postgres (Neon)
2. Copy `DATABASE_URL` (misal `postgres://...@.../verceldb?sslmode=require`)
3. Vercel Project → Settings → Environment Variables → Add:
   ```
   DATABASE_URL=postgres://...
   GEMINI_API_KEY=your_key
   BLOB_READ_WRITE_TOKEN=your_blob_token (optional untuk background 2GB)
   ```
4. Di local, push schema ke Vercel DB:
   ```bash
   DATABASE_URL="your_vercel_postgres_url" npx drizzle-kit push
   DATABASE_URL="your_vercel_postgres_url" npx tsx src/db/seed.ts
   ```
5. Redeploy di Vercel

**Opsi C: Pakai Neon.tech gratis**
1. Daftar neon.tech → create project → copy connection string
2. Set di Vercel env vars seperti di atas

## Masalah 2: Logo Hilang di Vercel

**Screenshot:** Login page hanya tampil teks "BimxZ BugXZ" tanpa gambar anime boy.

**Penyebab:**
- File logo 3.4MB terlalu besar, push ke GitHub gagal karena secret, jadi file tidak ada di repo → Vercel tidak deploy logo
- `.next` folder ter-commit (harusnya di-ignore) → build Vercel rusak
- `public/uploads/*` di-ignore tapi `.gitkeep` hilang

**Fix V5:**
1. Optimasi logo: `icon-192.png` 83KB, `icon-512.png` 510KB, `logo-bimxz.png` 510KB (dari 3.4MB) pakai Jimp resize + quality 80-85
2. `.gitignore` baru yang benar:
   ```
   .next/
   node_modules/
   baileys_auth/
   .env
   public/uploads/*
   !public/uploads/.gitkeep
   !public/logo-bimxz.png
   !public/icon*.png
   ```
3. `public/uploads/.gitkeep` ada
4. **Baru:** `src/components/LogoImage.tsx` — component dengan fallback:
   - Coba load `/logo-bimxz.png`
   - Jika 404, coba `/icon.png`
   - Jika masih 404, fallback ke inline SVG data URL (black red neon design)
   - Jadi logo TIDAK PERNAH hilang, minimal ada SVG fallback!
5. `next.config.ts` headers cache-control untuk logo agar Vercel serve dengan immutable cache

**Test logo serve:**
```bash
curl https://yourdomain.vercel.app/logo-bimxz.png -o logo.png && ls -lh logo.png
# Harus 500KB+ dan bukan 404
```

## Masalah 3: Background 2GB Tidak Bisa

**Fix:** Sudah dijelaskan di README.md — Vercel Blob + /tmp fallback + 206 Partial Content

## Fitur Baru V5

### 📞 BimxBugz Prank Call
- Prank call ke target, atur jumlah (1-100x), interval (3-60 detik), script (10 pilihan: polisi, hadiah, bank, kurir, keluarga, operator, reverse scam, horor, pinjol, custom), voice (male, female, robot, ghost)
- Real-time progress, logs, bisa stop kapan saja
- Jika `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` di-set di env, akan call real via Twilio, jika tidak simulasi
- Role: reseller, owner, developer only (user basic terkunci)

### 🔐 BimxzBugxz Spam OTP
- Spam OTP dari semua layanan: GoPay, OVO, DANA, ShopeePay, LinkAja, Facebook, Instagram, WhatsApp, Telegram, TikTok, Shopee, Tokopedia, Lazada, ML, Free Fire, PUBG, AOV, CODM, Google, Email
- Atur jumlah (1-200x), interval (2-30 detik), pilih layanan (checkbox per kategori: e-wallet, social, marketplace, games, other)
- Real-time progress per layanan, success/failed counts, logs, bisa stop kapan saja
- Support pilih ALL atau CLEAR, lihat 8 layanan pertama + count lainnya
- Role: reseller, owner, developer only

Kedua fitur pakai in-memory jobs dengan `globalThis` Maps + `setInterval` untuk Vercel compatibility.

## Deploy Checklist Vercel

- [ ] Fix GitHub push protection (hapus secret, buat .gitignore baru)
- [ ] Push ke GitHub berhasil tanpa error GH013
- [ ] Set env vars di Vercel: `DATABASE_URL` (Vercel Postgres/Neon), `GEMINI_API_KEY`, `BLOB_READ_WRITE_TOKEN` (optional)
- [ ] Vercel Blob Storage: Create Blob store di Vercel Dashboard → Storage → Blob → Copy token ke env `BLOB_READ_WRITE_TOKEN`
- [ ] Deploy → Test login `admin0987 / pwnya admin?0987#$@` → harus tidak Server error
- [ ] Test logo: buka `https://yourdomain.vercel.app/logo-bimxz.png` harus muncul
- [ ] Test new features: menu Prank Call & Spam OTP muncul di sidebar (reseller/owner/developer)
- [ ] Test background: Admin Panel → Latar Global → upload foto/video → harus muncul di semua user dalam 8 detik

Sikikk ayaa! V5 Black Red White Neon 120FPS Normal Layout + No Server Error + Logo Fixed + 2 New Features! 🔥
