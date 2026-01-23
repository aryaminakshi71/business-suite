# Business Suite Implementation Guide

## ✅ Phase 1 Complete: Foundation

### Created Structure
- ✅ Monorepo setup (Turborepo)
- ✅ Shared packages (env, shared, storage)
- ✅ API gateway with module proxy
- ✅ Unified router for cross-module features

### What's Next

## Phase 2: Unified Frontend (Week 2)

### Tasks
1. Create TanStack Start frontend
2. Setup routing to modules
3. Create unified dashboard
4. Add navigation between modules
5. Implement shared auth

### Files to Create
```
apps/web/
├── src/
│   ├── app.tsx
│   ├── routes/
│   │   ├── index.tsx          # Dashboard
│   │   ├── projects/
│   │   ├── crm/
│   │   ├── invoicing/
│   │   ├── helpdesk/
│   │   └── queue/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── navigation/
│   │   └── layout/
│   └── lib/
│       └── api.ts              # oRPC client
```

## Phase 3: Cross-Module Features (Week 3)

### Integrations to Build
1. **CRM → Invoicing**
   - Convert contacts to clients
   - Create invoice from deal

2. **Projects → Invoicing**
   - Time tracking → Invoice line items
   - Project expenses → Invoice

3. **Helpdesk → CRM**
   - Ticket → CRM activity
   - Customer support → Contact notes

4. **Queue → Invoicing**
   - Service completion → Invoice

## Phase 4: Deployment & Configuration

### Environment Variables Needed

```bash
# Shared Infrastructure
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Module API URLs (for proxy)
PROJECTS_API_URL=https://projects-api.example.com
CRM_API_URL=https://crm-api.example.com
INVOICING_API_URL=https://invoicing-api.example.com
HELPDESK_API_URL=https://helpdesk-api.example.com
QUEUE_API_URL=https://queue-api.example.com

# Frontend
VITE_PUBLIC_SITE_URL=https://suite.example.com
VITE_PUBLIC_CDN_URL=https://cdn.example.com
```

### Deployment Strategy

1. **API Gateway**: Deploy to Cloudflare Workers
2. **Frontend**: Deploy to Vercel/Cloudflare Pages
3. **Module APIs**: Keep existing deployments
4. **Shared DB**: Single Neon instance with schemas

## Testing Strategy

1. **Unit Tests**: Shared utilities
2. **Integration Tests**: API gateway → module APIs
3. **E2E Tests**: Full user flows across modules

## Migration Path

### For Existing Customers
1. Keep standalone apps running
2. Offer suite as upgrade option
3. Provide migration tool (data sync)
4. Grandfather pricing for early adopters

### For New Customers
1. Offer both standalone and suite
2. Clear pricing comparison
3. Easy upgrade path

## Next Steps

1. ✅ Foundation complete
2. ⏭️ Create unified frontend
3. ⏭️ Add cross-module integrations
4. ⏭️ Setup deployment
5. ⏭️ Launch suite pricing
