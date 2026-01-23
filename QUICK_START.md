# Business Suite - Quick Start Guide

## ✅ Phase 1 Complete: Foundation Built

The suite platform foundation is now ready! Here's what's been created:

### Structure Created
- ✅ Monorepo setup (Turborepo + Bun)
- ✅ Shared packages (env, shared, storage)
- ✅ API gateway with module proxy
- ✅ Unified frontend (TanStack Start)
- ✅ Unified dashboard
- ✅ Navigation between modules

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd business-suite
bun install
```

### 2. Setup Environment Variables

Create `.env` file:

```bash
# Shared Infrastructure
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Module API URLs (point to your standalone app APIs)
PROJECTS_API_URL=http://localhost:3001
CRM_API_URL=http://localhost:3002
INVOICING_API_URL=http://localhost:3003
HELPDESK_API_URL=http://localhost:3004
QUEUE_API_URL=http://localhost:3005

# Frontend
VITE_PUBLIC_SITE_URL=http://localhost:5173
VITE_PUBLIC_CDN_URL=https://cdn.example.com
```

### 3. Start Development

```bash
# Start all services
bun run dev

# Or start individually
cd apps/api && bun run dev    # API gateway
cd apps/web && bun run dev    # Frontend
```

## 📁 Project Structure

```
business-suite/
├── apps/
│   ├── api/              # API Gateway (Hono)
│   │   └── src/
│   │       ├── index.ts           # Main server
│   │       ├── middleware/
│   │       │   └── proxy.ts      # Module proxy
│   │       └── routers/
│   │           └── unified.ts    # Unified endpoints
│   └── web/              # Unified Frontend (TanStack Start)
│       └── src/
│           ├── app.tsx
│           ├── routes/            # File-based routing
│           │   ├── index.tsx      # Dashboard
│           │   ├── projects.tsx
│           │   ├── crm.tsx
│           │   └── ...
│           └── components/
│               ├── dashboard.tsx
│               └── navigation.tsx
├── packages/
│   ├── env/              # Environment variables
│   ├── shared/           # Shared types & utils
│   └── storage/          # Shared DB & Redis
└── README.md
```

## 🔌 How It Works

### API Gateway
- Routes `/api/projects/*` → Projects API
- Routes `/api/crm/*` → CRM API
- Routes `/api/invoicing/*` → Invoicing API
- Routes `/api/helpdesk/*` → Helpdesk API
- Routes `/api/queue/*` → Queue API
- Provides `/api/unified/*` for cross-module features

### Frontend
- Unified navigation bar
- Dashboard with stats from all modules
- Routes to module pages (currently placeholders)
- Shared authentication (to be implemented)

## 🎯 Next Steps

### Phase 2: Module Integration (Week 2)
1. **Embed Module Apps**
   - Option A: Iframe embedding
   - Option B: Micro-frontend integration
   - Option C: Full routing to module apps

2. **Shared Authentication**
   - Setup Better Auth
   - Single sign-on across modules
   - Organization switching

3. **Enhanced Dashboard**
   - Real-time stats
   - Activity feed
   - Quick actions

### Phase 3: Cross-Module Features (Week 3)
1. **CRM → Invoicing**
   - Convert contact to client
   - Create invoice from deal

2. **Projects → Invoicing**
   - Time tracking → Invoice items
   - Project expenses → Invoice

3. **Helpdesk → CRM**
   - Ticket → CRM activity
   - Customer support notes

### Phase 4: Deployment (Week 4)
1. Deploy API gateway to Cloudflare Workers
2. Deploy frontend to Vercel/Cloudflare Pages
3. Configure module API URLs
4. Setup shared database
5. Launch!

## 🧪 Testing

```bash
# Test API gateway
curl http://localhost:3000/health

# Test unified dashboard
curl http://localhost:3000/api/unified/dashboard/stats

# Test module proxy
curl http://localhost:3000/api/projects/health
```

## 📊 Current Status

- ✅ Foundation: 100% complete
- ⏳ Module Integration: 0% (next phase)
- ⏳ Cross-Module Features: 0% (phase 3)
- ⏳ Deployment: 0% (phase 4)

## 💡 Tips

1. **Module APIs**: Make sure your standalone app APIs are running
2. **CORS**: Configure CORS on module APIs to allow suite requests
3. **Auth**: Module APIs should accept shared auth tokens
4. **Database**: Use shared database with schema separation

## 🐛 Troubleshooting

### Module API not responding
- Check module API URLs in `.env`
- Verify module APIs are running
- Check CORS configuration

### Dashboard stats not loading
- Verify module APIs have `/api/dashboard/stats` endpoint
- Check network tab for errors
- Verify API gateway is running

### Frontend not loading
- Run `bun install` in `apps/web`
- Check `app.config.ts` for correct routes directory
- Verify TanStack Start is properly configured

## 📚 Documentation

- [Suite vs Standalone Analysis](../SUITE_VS_STANDALONE_ANALYSIS.md)
- [Implementation Guide](./SUITE_IMPLEMENTATION.md)
- [Main README](./README.md)
