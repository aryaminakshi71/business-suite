# 🚀 Run Setup - Copy & Paste Commands

All files are ready! Just run these commands in order.

## Step 1: Install Dependencies

```bash
cd /Users/aryaminakshi/Developer/business-suite
bun install
```

**Expected:** Dependencies install successfully

---

## Step 2: Create Environment File

```bash
# Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long

# Frontend URL
VITE_PUBLIC_SITE_URL=http://localhost:5173

# Optional: Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Optional: Module APIs (for integration testing)
PROJECTS_API_URL=http://localhost:3001
CRM_API_URL=http://localhost:3002
INVOICING_API_URL=http://localhost:3003
HELPDESK_API_URL=http://localhost:3004
QUEUE_API_URL=http://localhost:3005
EOF

# Edit with your actual values
nano .env
```

**Or manually create `.env` with:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Run: `openssl rand -base64 32`
- `VITE_PUBLIC_SITE_URL` - `http://localhost:5173`

---

## Step 3: Setup Database Schema

```bash
cd /Users/aryaminakshi/Developer/business-suite
./scripts/setup-db.sh
```

**Or manually:**
```bash
cd packages/storage
bun run db:generate
bun run db:push
```

**Verify:**
```bash
bun run db:studio
# Should open Drizzle Studio showing: user, session, account, verification, organization, member tables
```

---

## Step 4: Start Development Servers

**Open Terminal 1:**
```bash
cd /Users/aryaminakshi/Developer/business-suite/apps/api
bun run dev
```
**Expected:** API starts on `http://localhost:3000`

**Open Terminal 2:**
```bash
cd /Users/aryaminakshi/Developer/business-suite/apps/web
bun run dev
```
**Expected:** Frontend starts on `http://localhost:5173`

---

## Step 5: Test Everything

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```
**Expected:** `{"status":"ok","service":"business-suite-api"}`

### Test 2: Authentication

```bash
cd /Users/aryaminakshi/Developer/business-suite
./scripts/test-auth.sh
```

**Or manually:**
```bash
# Test sign-up
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```

### Test 3: Module Integration

```bash
# First, start a module API (e.g., CRM):
# cd ../crm/apps/api && bun run dev

# Then test:
./scripts/test-modules.sh
```

### Test 4: Frontend

Open in browser: http://localhost:5173

**Expected:**
- Dashboard loads
- Navigation bar visible
- Can navigate to modules

---

## ✅ Verification Checklist

Run through this to verify everything works:

```bash
# 1. Dependencies installed
cd /Users/aryaminakshi/Developer/business-suite
test -d node_modules && echo "✅ Dependencies installed" || echo "❌ Run: bun install"

# 2. Environment file exists
test -f .env && echo "✅ .env file exists" || echo "❌ Create .env file"

# 3. Database schema created
cd packages/storage
bun run db:studio &
# Check if tables exist in browser

# 4. API running
curl -s http://localhost:3000/health | grep -q "ok" && echo "✅ API running" || echo "❌ Start API: cd apps/api && bun run dev"

# 5. Frontend running
curl -s http://localhost:5173 | grep -q "html" && echo "✅ Frontend running" || echo "❌ Start frontend: cd apps/web && bun run dev"
```

---

## 🐛 Troubleshooting

### bun install fails
```bash
# Check Bun version
bun --version

# Try force install
bun install --force

# Or clear cache
rm -rf node_modules .turbo
bun install
```

### Database connection fails
```bash
# Test connection
psql $DATABASE_URL

# Or check URL format
echo $DATABASE_URL
# Should be: postgresql://user:password@host:port/database
```

### API won't start
```bash
# Check for errors
cd apps/api
bun run dev

# Check port 3000 is free
lsof -i :3000
```

### Frontend won't start
```bash
# Check for errors
cd apps/web
bun run dev

# Check port 5173 is free
lsof -i :5173
```

---

## 📊 What Should Work

After setup, you should be able to:

1. ✅ Access API: http://localhost:3000/health
2. ✅ Access Frontend: http://localhost:5173
3. ✅ Sign up a user
4. ✅ Sign in
5. ✅ View dashboard
6. ✅ Navigate to modules (if module APIs running)

---

## 🎯 Next Steps

1. Create test user
2. Create organization
3. Test module embedding
4. Test cross-module integrations
5. Deploy to production

---

**All files are ready!** Just run the commands above. 🚀
