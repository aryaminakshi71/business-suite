# Business Suite Setup Guide

Complete setup instructions for the Business Suite platform.

## 📋 Prerequisites

- Bun installed (v1.3.5+)
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Upstash Redis account (optional, for caching)
- Node.js 18+ (if not using Bun)

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd business-suite
bun install
```

### 2. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random secret (min 32 chars)
- `VITE_PUBLIC_SITE_URL` - Frontend URL

**Optional but recommended:**
- `UPSTASH_REDIS_REST_URL` - Redis for caching
- `UPSTASH_REDIS_REST_TOKEN` - Redis token
- Module API URLs (if testing module integration)

### 3. Setup Database Schema

```bash
# Make script executable
chmod +x scripts/setup-db.sh

# Run database setup
./scripts/setup-db.sh

# Or manually:
cd packages/storage
bun run db:generate  # Generate migrations
bun run db:push       # Push to database
```

**Verify schema:**
```bash
cd packages/storage
bun run db:studio     # Opens Drizzle Studio
```

### 4. Start Development Servers

**Terminal 1: API Gateway**
```bash
cd apps/api
bun run dev
# API runs on http://localhost:3000
```

**Terminal 2: Frontend**
```bash
cd apps/web
bun run dev
# Frontend runs on http://localhost:5173
```

**Terminal 3: Module APIs (for testing)**
```bash
# Start each module API in separate terminals
cd ../projects && bun run dev    # Port 3001
cd ../crm && bun run dev         # Port 3002
cd ../invoicing && bun run dev   # Port 3003
cd ../helpdesk && bun run dev    # Port 3004
cd ../queue && bun run dev       # Port 3005
```

## 🧪 Testing

### Test Authentication

```bash
# Make script executable
chmod +x scripts/test-auth.sh

# Run auth tests
./scripts/test-auth.sh

# Or with custom API URL
API_URL=http://localhost:3000 ./scripts/test-auth.sh
```

**Manual testing:**
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test auth endpoint
curl http://localhost:3000/api/auth/sign-in

# Sign up a user
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```

### Test Module Integration

```bash
# Make script executable
chmod +x scripts/test-modules.sh

# Run module tests
./scripts/test-modules.sh
```

**Expected output:**
- ✅ Module proxies working (if module APIs are running)
- ⚠️  Module not available (if module APIs are not running - this is OK)

### Test Cross-Module Integrations

```bash
# Make script executable
chmod +x scripts/test-integrations.sh

# First, get a session token by signing in
SESSION_TOKEN=$(curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}' \
  -c - | grep "better-auth.session_token" | awk '{print $7}')

# Run integration tests
SESSION_TOKEN=$SESSION_TOKEN ./scripts/test-integrations.sh
```

## 📊 Database Schema

The suite uses the following tables:

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth account connections
- `verification` - Email verification tokens
- `organization` - Multi-tenant organizations
- `member` - User-organization relationships

**View schema:**
```bash
cd packages/storage
bun run db:studio
```

## 🔧 Configuration

### Database Connection

**Neon (Recommended):**
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

**Supabase:**
```bash
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**Local PostgreSQL:**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/business_suite
```

### Redis (Optional)

**Upstash:**
1. Create account at https://upstash.com
2. Create Redis database
3. Copy REST URL and token
4. Add to `.env`:
   ```bash
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```

### Module API URLs

For development, use localhost:
```bash
PROJECTS_API_URL=http://localhost:3001
CRM_API_URL=http://localhost:3002
INVOICING_API_URL=http://localhost:3003
HELPDESK_API_URL=http://localhost:3004
QUEUE_API_URL=http://localhost:3005
```

For production, use your deployed URLs:
```bash
PROJECTS_API_URL=https://projects-api.yourdomain.com
CRM_API_URL=https://crm-api.yourdomain.com
# etc.
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall/network settings

**Error: "Schema not found"**
- Run `bun run db:push` in `packages/storage`
- Verify schema files exist in `packages/storage/src/db/schema/`

### Authentication Issues

**Error: "BETTER_AUTH_SECRET must be at least 32 characters"**
- Generate a longer secret: `openssl rand -base64 32`
- Update `.env` file

**Error: "Session not found"**
- Clear browser cookies
- Check session table in database
- Verify BETTER_AUTH_SECRET matches

### Module Integration Issues

**Error: "Module not configured"**
- Check module API URLs in `.env`
- Verify module APIs are running
- Check CORS configuration on module APIs

**Error: "502 Bad Gateway"**
- Module API is not running
- Module API URL is incorrect
- Network/firewall blocking connection

## ✅ Verification Checklist

- [ ] Dependencies installed (`bun install`)
- [ ] Environment variables configured (`.env` file)
- [ ] Database schema created (`bun run db:push`)
- [ ] API gateway running (`http://localhost:3000/health`)
- [ ] Frontend running (`http://localhost:5173`)
- [ ] Authentication working (can sign up/sign in)
- [ ] Module APIs accessible (if testing integration)
- [ ] Dashboard loads with stats
- [ ] Module embedding works (if module APIs running)

## 🎯 Next Steps

1. **Create your first user** via sign-up
2. **Create an organization** (via API or UI)
3. **Test module embedding** (start a module API)
4. **Test cross-module integrations** (create test data)
5. **Deploy to production** (see deployment guide)

## 📚 Additional Resources

- [Phase 2 Complete Guide](./PHASE_2_COMPLETE.md)
- [Quick Start Guide](./QUICK_START.md)
- [Suite Implementation Plan](./SUITE_IMPLEMENTATION.md)
- [Suite vs Standalone Analysis](../SUITE_VS_STANDALONE_ANALYSIS.md)

## 🆘 Need Help?

1. Check error messages in console
2. Verify environment variables
3. Check database connection
4. Review module API logs
5. Check CORS configuration
