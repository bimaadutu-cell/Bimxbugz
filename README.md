# BimxZ BugXZ V2 — Black Red White Neon Ultimate 120FPS

Platform Super All-in-One by BimzOfficial — Real Baileys v6.7.18, 25 Bug Brutal V2, Kill Group Invisible, Cinema HD 150+, AI Arena Gemini, 120FPS Ultra Smooth.

## 🚀 Fitur V2 Ultimate

- **25 Bug Attack V2**: Payload 20k-50k+ invisible chars, real Baileys, heavy brutal
- **Kill Group V2**: Invisible 10k ZWSP, tak kasat mata, suspend permanen
- **Dual Sender**: QR Scan & Pairing Code 8 digit, asli server WA resmi, Vercel-ready persistent auth
- **Cinema HD V2**: 150+ film real TMDB ID, 8 servers (VidLink Pro, VidSrc To/CC V2, EmbedSU, SuperEmbed, AutoEmbed, P-Stream, Videasy 4K)
- **Background Global**: Support foto/video hingga 2GB, real-time 8s polling, Vercel Blob + /tmp fallback, range requests 206 for smooth video
- **Tema**: Black Red White Neon Digital + 120FPS ultra smooth tanpa patah
- **AI Arena**: Support Gemini (AQ format), Flaz, OpenRouter, Groq, Together, OpenAI
- **PWA**: Install sebagai APK Android 120FPS

## 🔧 Fix GitHub Push Protection Error

Jika kamu dapat error:
```
remote: error: GH013: Repository rule violations found
remote: - Push cannot contain secrets
remote: — GCP API Key Bound to a Service Account
```

**Solusi:**

1. **Jangan pernah commit `.env` dengan API key asli!** File `.env` sudah di-ignore di `.gitignore` baru.

2. **Hapus secret dari history:**
```bash
# Di folder project kamu di HP/PC:
git rm --cached .env
git rm -r --cached .next
git rm -r --cached node_modules
git rm -r --cached baileys_auth

# Buat .env baru dari .env.example
cp .env.example .env
# Edit .env isi dengan key kamu yang asli, tapi jangan di-commit!

# Commit fix
git add .gitignore .env.example
git add public/logo-bimxz.png public/icon*.png public/manifest.json
git add src/ next.config.ts package.json
git commit -m "fix: remove secrets, add gitignore, optimize icons, fix background 2GB Vercel"

# Push paksa jika perlu (karena history ada secret)
git push origin main --force
# Atau jika repo baru:
# git push -u origin main
```

3. **Alternatif: Allow secret di GitHub (tidak disarankan tapi jika mau cepat):**
- Buka: https://github.com/bimaadutu-cell/Bimxbugz/security/secret-scanning/unblock-secret/3HZhjRxnuJa3wTk8TmdR8RnGQ
- Klik Allow secret

4. **Yang benar: Set API key di Vercel Env Vars, bukan di kode:**
- Di Vercel Dashboard → Project → Settings → Environment Variables
- Tambah:
```
GEMINI_API_KEY=your real key (AQ.xxx...)
DATABASE_URL=your postgres url
TMDB_API_KEY=...
BLOB_READ_WRITE_TOKEN=... (dari Vercel Blob)
```

## 🌐 Fix Logo Hilang di Vercel

**Penyebab:**
- File logo 3MB tidak ter-commit karena push gagal
- `.next` folder ter-commit (seharusnya di-ignore)
- `public/uploads/*` di-ignore tapi `.gitkeep` tidak ada

**Fix sudah diterapkan:**
- Icons di-optimize: `icon-192.png` 83KB, `icon-512.png` 510KB, `logo-bimxz.png` 510KB (dari 3.4MB)
- `.gitignore` baru:
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
- `public/uploads/.gitkeep` ada untuk jaga folder
- `next.config.ts` headers untuk cache-control logo

**Cara deploy Vercel agar logo muncul:**
1. Pastikan push berhasil (fix secret dulu)
2. Di Vercel, import repo GitHub baru
3. Set env vars di Vercel
4. Deploy — logo akan muncul di `/logo-bimxz.png`

## 🖼️ Fix Background 2GB Tanpa Patah

**Masalah lama:** `public/uploads` read-only di Vercel, jadi writeFile gagal.

**Fix V2:**
- **Local dev:** Simpan di `public/uploads/bg-{timestamp}.ext`, serve via `/uploads/...`
- **Vercel:** 
  - Jika `BLOB_READ_WRITE_TOKEN` ada → upload ke **Vercel Blob** (support 2GB, public URL, persistent)
  - Jika tidak ada token → simpan di `/tmp/uploads/` (ephemeral tapi work untuk testing)
  - Serve via `/api/background/file/{filename}` dengan **206 Partial Content** support (range requests) → video smooth tanpa patah, buffering 120FPS
- **DB:** Simpan URL final di `app_settings` (background), type di `background_type`, timestamp di `background_updated`
- **Client:** Polling 8 detik di `AppContext` → semua user auto-refresh background real-time

**Flow upload 2GB:**
1. Admin pilih foto/video di Admin Panel → Background Global
2. File dikirim via `FormData` ke `/api/admin/background` (bodySizeLimit 2gb di next.config)
3. Server coba Blob dulu, fallback ke /tmp atau public/uploads
4. URL disimpan di DB, langsung terpasang ke semua user dalam 8 detik!

**Test lokal:**
```bash
# Upload via API
curl -X POST http://localhost:3000/api/admin/background \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@video.mp4" -F "type=video"
```

## 📦 Install & Deploy

```bash
npm install
npx drizzle-kit push
DATABASE_URL=... npx tsx src/db/seed.ts
npm run build
npm start
```

**Vercel Deploy:**
1. Fork repo ini
2. Import di Vercel
3. Set env vars
4. Deploy!

**Akun Default:**
- `admin0987 / pwnya admin?0987#$@` → Developer
- `reseller01 / reseller123` → Reseller
- `user01 / user123` → User Basic

## 🎯 120FPS Ultra Smooth

- Animasi hanya pakai `transform` & `opacity`
- StarField canvas RAF throttled 120Hz
- Glass cards backdrop-blur optimized
- Semua normal layout (tidak pakai `contain: strict` yang bikin patah)

Sikikk ayaa! Black Red White Neon V2! 🔥
