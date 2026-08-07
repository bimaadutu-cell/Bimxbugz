#!/bin/bash
# Fix GitHub Push Protection - Remove secrets from repo
# Jalankan di folder /sdcard/Bimzbugz di HP kamu

echo "🔧 Fixing GitHub push protection error..."

# 1. Backup .env yang ada secret
if [ -f .env ]; then
  cp .env .env.backup.secret
  echo "✅ Backup .env ke .env.backup.secret"
fi

# 2. Buat .env baru tanpa secret (hanya local DB)
cat > .env <<'EOF'
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
EOF
echo "✅ Buat .env baru tanpa secret"

# 3. Buat .env.example (template tanpa secret)
cat > .env.example <<'EOF'
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
GEMINI_API_KEY=your_gemini_api_key_here
AI_ARENA_API_KEY=your_ai_arena_key_here
FLAZ_API_KEY=your_flaz_key_here
TMDB_API_KEY=your_tmdb_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
EOF
echo "✅ Buat .env.example template"

# 4. Buat .gitignore yang benar
cat > .gitignore <<'EOF'
node_modules/
.next/
out/
build/
dist/
.env
.env.local
.vercel
baileys_auth/
auth_info_baileys/
public/uploads/*
!public/uploads/.gitkeep
*.log
.DS_Store
EOF
echo "✅ Buat .gitignore baru"

# 5. Buat .gitkeep untuk uploads
mkdir -p public/uploads
touch public/uploads/.gitkeep

# 6. Remove cached files yang mengandung secret
git rm --cached .env 2>/dev/null || true
git rm -r --cached .next 2>/dev/null || true
git rm -r --cached node_modules 2>/dev/null || true
git rm -r --cached baileys_auth 2>/dev/null || true

echo "✅ Remove cached secret files dari git"

# 7. Bersihkan src/app/api/ai/route.ts dari hardcoded secret
# Cek jika masih ada hardcoded AQ key
if grep -q "AQ.Ab8RN6" src/app/api/ai/route.ts 2>/dev/null; then
  echo "⚠️  Masih ada hardcoded secret di src/app/api/ai/route.ts!"
  echo "    Ganti baris yang mengandung AQ.Ab8 dengan env var:"
  echo '    const aqKey = process.env.GEMINI_API_KEY || "";'
  # Auto fix dengan sed
  sed -i 's/const aqKey = process.env.GEMINI_API_KEY || process.env.AI_ARENA_API_KEY || "AQ.Ab8.*/const aqKey = process.env.GEMINI_API_KEY || process.env.AI_ARENA_API_KEY || "";/' src/app/api/ai/route.ts
  sed -i 's/AQ\.Ab8RN6IOsnEh9lKVdgUi95koyTtt_H4IK5UXyUP5QEwZkRiiow//g' src/app/api/ai/route.ts
  echo "✅ Auto-fix hardcoded secret"
else
  echo "✅ Tidak ada hardcoded secret di ai route"
fi

# 8. Add dan commit fix
git add .gitignore .env.example public/uploads/.gitkeep
git add src/app/api/ai/route.ts 2>/dev/null || true
git add public/logo-bimxz.png public/icon*.png public/manifest.json 2>/dev/null || true
git add next.config.ts README.md 2>/dev/null || true
git add src/app/api/admin/background/route.ts src/app/api/background/file/ 2>/dev/null || true

git commit -m "fix: remove secrets, fix github push protection GH013, fix logo vercel, fix background 2GB vercel blob + 120fps normal layout" 2>/dev/null || echo "No changes to commit or already committed"

echo ""
echo "🎉 Fix selesai!"
echo ""
echo "Langkah selanjutnya:"
echo "1. Push paksa: git push origin main --force"
echo "   Atau jika repo baru: git push -u origin main"
echo ""
echo "2. Jika tetap error, allow secret di GitHub:"
echo "   Buka: https://github.com/bimaadutu-cell/Bimxbugz/security/secret-scanning/unblock-secret/3HZhjRxnuJa3wTk8TmdR8RnGQ"
echo "   Klik Allow"
echo ""
echo "3. Untuk Vercel, set env vars di Vercel Dashboard:"
echo "   GEMINI_API_KEY=your_real_key"
echo "   DATABASE_URL=your_db_url"
echo "   BLOB_READ_WRITE_TOKEN=your_blob_token (dari Vercel Blob storage)"
echo ""
echo "4. Deploy ulang di Vercel, logo akan muncul!"
echo ""
echo "Backup secret lama ada di .env.backup.secret - JANGAN di-commit!"
echo "Sikikk ayaa! 🔥"
