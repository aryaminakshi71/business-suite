# Quick Setup - Run These Commands

## ✅ Pre-Setup Complete

All files are ready! The following have been prepared:
- ✅ Database schema files
- ✅ Environment variable template
- ✅ Test scripts (all executable)
- ✅ Documentation

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
cd /Users/aryaminakshi/Developer/business-suite
bun install
```

**If you get permission errors:**
- Try: `bun install --force`
- Or check Bun installation: `bun --version`

### 2. Create Environment File

```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

**Minimum required:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

### 3. Setup Database

```bash
./scripts/setup-db.sh
```

**Or manually:**
```bash
cd packages/storage
bun run db:generate
bun run db:push
```

### 4. Start Servers

**Terminal 1:**
```bash
cd apps/api
bun run dev
```

**Terminal 2:**
```bash
cd apps/web
bun run dev
```

### 5. Test

```bash
# Test auth
./scripts/test-auth.sh

# Test modules (start module APIs first)
./scripts/test-modules.sh
```

## 📋 Quick Verification

```bash
# API health
curl http://localhost:3000/health

# Frontend
open http://localhost:5173

# Database studio
cd packages/storage && bun run db:studio
```

## 🎯 Status

- ✅ All files created
- ✅ Scripts are executable
- ✅ Ready for `bun install`
- ✅ Ready for database setup
- ✅ Ready for testing

**Next:** Run the commands above in your terminal!
