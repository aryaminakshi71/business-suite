# Business Suite Testing Guide

Complete testing guide for all suite features.

## 🧪 Test Scripts

All test scripts are in the `scripts/` directory:

```bash
scripts/
├── setup-db.sh          # Database setup
├── test-auth.sh         # Authentication tests
├── test-modules.sh      # Module integration tests
└── test-integrations.sh # Cross-module integration tests
```

## 1️⃣ Database Setup Test

```bash
./scripts/setup-db.sh
```

**What it does:**
- Checks DATABASE_URL is set
- Generates database migrations
- Pushes schema to database

**Expected output:**
```
✅ DATABASE_URL is set
📦 Generating database migrations...
📤 Pushing schema to database...
✅ Database setup complete!
```

**Verify:**
```bash
cd packages/storage
bun run db:studio
# Should see: user, session, account, verification, organization, member tables
```

## 2️⃣ Authentication Flow Test

### Step 1: Start API Gateway

```bash
cd apps/api
bun run dev
# API runs on http://localhost:3000
```

### Step 2: Run Auth Tests

```bash
./scripts/test-auth.sh
```

**What it tests:**
- Health endpoint
- Auth endpoint accessibility
- Sign-up functionality

**Expected output:**
```
✅ Health endpoint is accessible
✅ Auth endpoint is accessible
✅ Sign-up successful (or user already exists)
```

### Step 3: Manual Testing

**Sign Up:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'
```

**Sign In:**
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }' \
  -c cookies.txt
```

**Get Session:**
```bash
curl http://localhost:3000/api/auth/session \
  -b cookies.txt
```

## 3️⃣ Module Embedding Test

### Step 1: Start Module APIs

```bash
# Terminal 1: Projects API
cd ../projects/apps/api
bun run dev  # Port 3001

# Terminal 2: CRM API
cd ../crm/apps/api
bun run dev  # Port 3002

# Terminal 3: Invoicing API
cd ../invoicing/apps/api
bun run dev  # Port 3003

# Terminal 4: Helpdesk API
cd ../helpdesk/apps/api
bun run dev  # Port 3004

# Terminal 5: Queue API
cd ../queue/apps/api
bun run dev  # Port 3005
```

### Step 2: Start Suite Frontend

```bash
cd business-suite/apps/web
bun run dev  # Port 5173
```

### Step 3: Test Module Proxy

```bash
./scripts/test-modules.sh
```

**What it tests:**
- Module API proxy endpoints
- Unified dashboard endpoint
- Integrations endpoint

**Expected output:**
```
✅ projects proxy is working
✅ crm proxy is working
✅ invoicing proxy is working
✅ helpdesk proxy is working
✅ queue proxy is working
✅ Unified dashboard endpoint is accessible
✅ Integrations endpoint is accessible
```

### Step 4: Manual Browser Testing

1. Open http://localhost:5173
2. Sign in with test user
3. Navigate to each module:
   - `/projects` - Should embed Projects app
   - `/crm` - Should embed CRM app
   - `/invoicing` - Should embed Invoicing app
   - `/helpdesk` - Should embed Helpdesk app
   - `/queue` - Should embed Queue app

**Expected behavior:**
- Navigation bar shows all modules
- Clicking module navigates to embedded app
- Iframe loads module app (if module API is running)
- Dashboard shows stats from all modules

## 4️⃣ Cross-Module Integration Test

### Step 1: Create Test Data

**In CRM:**
```bash
# Create a contact
curl -X POST http://localhost:3002/api/contacts \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }'
# Save the contact ID
```

**In CRM:**
```bash
# Create a deal
curl -X POST http://localhost:3002/api/deals \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "name": "Test Deal",
    "value": "1000",
    "stage": "qualified",
    "contactId": "CONTACT_ID_FROM_ABOVE"
  }'
# Save the deal ID
```

**In Helpdesk:**
```bash
# Create a ticket
curl -X POST http://localhost:3004/api/tickets \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "subject": "Test Ticket",
    "description": "Test description",
    "priority": "medium"
  }'
# Save the ticket ID
```

### Step 2: Run Integration Tests

```bash
# Get session token first
SESSION_TOKEN=$(curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}' \
  -c - | grep "better-auth.session_token" | awk '{print $7}')

# Run tests
SESSION_TOKEN=$SESSION_TOKEN ./scripts/test-integrations.sh
```

### Step 3: Test Specific Integrations

**CRM → Invoicing: Contact to Client**
```bash
curl -X POST http://localhost:3000/api/integrations/crm-to-invoicing/contact-to-client \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN" \
  -d '{
    "contactId": "YOUR_CONTACT_ID"
  }'
```

**Expected:**
- Contact fetched from CRM
- Client created in Invoicing
- Returns client object

**CRM → Invoicing: Deal to Invoice**
```bash
curl -X POST http://localhost:3000/api/integrations/crm-to-invoicing/deal-to-invoice \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN" \
  -d '{
    "dealId": "YOUR_DEAL_ID"
  }'
```

**Expected:**
- Deal fetched from CRM
- Contact converted to client (if needed)
- Invoice created with deal details
- Returns invoice object

**Helpdesk → CRM: Ticket to Activity**
```bash
curl -X POST http://localhost:3000/api/integrations/helpdesk-to-crm/ticket-to-activity \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN" \
  -d '{
    "ticketId": "YOUR_TICKET_ID"
  }'
```

**Expected:**
- Ticket fetched from Helpdesk
- Activity created in CRM
- Returns activity object

## 5️⃣ Dashboard Test

### Step 1: Start All Services

- Suite API: `http://localhost:3000`
- Suite Frontend: `http://localhost:5173`
- All module APIs running

### Step 2: Test Dashboard

1. Open http://localhost:5173
2. Sign in
3. View dashboard at `/`

**Expected:**
- Stats cards for each module
- Activity feed (if activities exist)
- Real-time data from all modules

**API Test:**
```bash
curl http://localhost:3000/api/unified/dashboard/stats \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN"
```

**Expected response:**
```json
{
  "projects": { "total": 10, "active": 5, "completed": 5 },
  "crm": { "contacts": 20, "deals": 8, "revenue": 50000 },
  "invoicing": { "invoices": 15, "paid": 10, "pending": 5, "revenue": 25000 },
  "helpdesk": { "tickets": 12, "open": 3, "resolved": 9 },
  "queue": { "tokens": 50, "active": 5, "completed": 45 }
}
```

## 🐛 Common Issues

### Issue: "Module not configured"

**Solution:**
- Check `.env` file has module API URLs
- Verify URLs are correct
- Restart API gateway

### Issue: "502 Bad Gateway"

**Solution:**
- Check module API is running
- Verify module API URL is correct
- Check CORS configuration

### Issue: "401 Unauthorized"

**Solution:**
- Sign in first to get session token
- Include session token in requests
- Check BETTER_AUTH_SECRET is set

### Issue: "Database connection failed"

**Solution:**
- Verify DATABASE_URL is correct
- Check database is running
- Test connection: `psql $DATABASE_URL`

## ✅ Test Checklist

- [ ] Database schema created
- [ ] Can sign up new user
- [ ] Can sign in with user
- [ ] Session persists
- [ ] Module APIs accessible via proxy
- [ ] Dashboard loads stats
- [ ] Module embedding works
- [ ] Cross-module integrations work
- [ ] Activity feed displays
- [ ] Navigation works

## 📊 Test Results Template

```markdown
## Test Results - [Date]

### Database Setup
- [ ] Schema created successfully
- [ ] Tables visible in Drizzle Studio

### Authentication
- [ ] Sign up works
- [ ] Sign in works
- [ ] Session persists
- [ ] Protected routes require auth

### Module Integration
- [ ] Projects proxy: ✅/❌
- [ ] CRM proxy: ✅/❌
- [ ] Invoicing proxy: ✅/❌
- [ ] Helpdesk proxy: ✅/❌
- [ ] Queue proxy: ✅/❌

### Cross-Module Integrations
- [ ] Contact → Client: ✅/❌
- [ ] Deal → Invoice: ✅/❌
- [ ] Ticket → Activity: ✅/❌

### Dashboard
- [ ] Stats load correctly
- [ ] Activity feed displays
- [ ] All modules show data

### Notes
[Any issues or observations]
```

## 🎯 Next Steps After Testing

1. Fix any failing tests
2. Create production environment
3. Deploy to staging
4. Run full E2E tests
5. Deploy to production
