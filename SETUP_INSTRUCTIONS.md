# Setup Instructions - Run These Commands

Due to system permissions, please run these commands manually in your terminal.

## Step 1: Install Dependencies

```bash
cd /Users/aryaminakshi/Developer/business-suite
bun install
```

**Note:** If you get permission errors, you may need to run with elevated permissions or check your Bun installation.

## Step 2: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
nano .env  # or use your preferred editor
```

**Minimum required variables:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `VITE_PUBLIC_SITE_URL` - `http://localhost:5173` for development

**Example .env:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

## Step 3: Setup Database Schema

```bash
# Make script executable (if not already)
chmod +x scripts/setup-db.sh

# Run database setup
./scripts/setup-db.sh
```

**Or manually:**
```bash
cd packages/storage
bun run db:generate  # Generate migrations
bun run db:push      # Push to database
```

**Verify schema:**
```bash
bun run db:studio  # Opens Drizzle Studio in browser
```

## Step 4: Start Development Servers

**Terminal 1: API Gateway**
```bash
cd apps/api
bun run dev
# Should start on http://localhost:3000
```

**Terminal 2: Frontend**
```bash
cd apps/web
bun run dev
# Should start on http://localhost:5173
```

## Step 5: Test Everything

**Test Authentication:**
```bash
# Make script executable
chmod +x scripts/test-auth.sh

# Run tests
./scripts/test-auth.sh
```

**Test Module Integration:**
```bash
# Start module APIs first (in separate terminals):
# cd ../projects/apps/api && bun run dev
# cd ../crm/apps/api && bun run dev
# etc.

# Then test
chmod +x scripts/test-modules.sh
./scripts/test-modules.sh
```

**Test Cross-Module Integrations:**
```bash
# First, sign in to get a session token:
SESSION_TOKEN=$(curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}' \
  -c - | grep "better-auth.session_token" | awk '{print $7}')

# Then test integrations
chmod +x scripts/test-integrations.sh
SESSION_TOKEN=$SESSION_TOKEN ./scripts/test-integrations.sh
```

## Quick Verification

**1. Check API is running:**
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","service":"business-suite-api"}
```

**2. Check Frontend is running:**
```bash
curl http://localhost:5173
# Should return HTML
```

**3. Test Auth endpoint:**
```bash
curl http://localhost:3000/api/auth/sign-in
# Should return HTML form or JSON
```

**4. Sign up a test user:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```

**5. Open in browser:**
- Frontend: http://localhost:5173
- API Health: http://localhost:3000/health
- Drizzle Studio: Run `bun run db:studio` in `packages/storage`

## Troubleshooting

### bun install fails
- Check Bun is installed: `bun --version`
- Try: `bun install --force`
- Check disk space and permissions

### Database connection fails
- Verify DATABASE_URL is correct
- Test connection: `psql $DATABASE_URL`
- Check database is running and accessible

### Module APIs not found
- Start module APIs in separate terminals
- Check module API URLs in .env
- Verify CORS is configured on module APIs

### Auth not working
- Check BETTER_AUTH_SECRET is set (min 32 chars)
- Verify database schema is created
- Check session table exists

## Next Steps After Setup

1. ✅ Create your first user via sign-up
2. ✅ Create an organization
3. ✅ Test module embedding
4. ✅ Test cross-module integrations
5. ✅ Deploy to production

---

**All files are ready!** Just run the commands above in your terminal.
