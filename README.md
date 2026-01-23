# Business Suite Platform

Unified platform combining Projects, CRM, Invoicing, Helpdesk, and Queue Management into a single, integrated solution.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Setup Database

```bash
./scripts/setup-db.sh
```

### 4. Start Development

```bash
# Terminal 1: API Gateway
cd apps/api && bun run dev

# Terminal 2: Frontend
cd apps/web && bun run dev
```

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete setup instructions
- **[Testing Guide](./TESTING_GUIDE.md)** - How to test all features
- **[Quick Start](./QUICK_START.md)** - Quick reference
- **[Phase 2 Complete](./PHASE_2_COMPLETE.md)** - Implementation details
- **[Suite vs Standalone](../SUITE_VS_STANDALONE_ANALYSIS.md)** - Business analysis

## 🧪 Testing

```bash
# Test authentication
./scripts/test-auth.sh

# Test module integration
./scripts/test-modules.sh

# Test cross-module integrations
./scripts/test-integrations.sh
```

## 🏗️ Architecture

- **API Gateway**: Routes to module APIs, provides unified endpoints
- **Frontend**: Unified UI with module embedding
- **Shared Auth**: Better Auth for single sign-on
- **Shared Storage**: Database and Redis connections

## 📊 Features

- ✅ Unified dashboard with cross-module stats
- ✅ Single sign-on across all modules
- ✅ Module embedding (iframe)
- ✅ Cross-module integrations
- ✅ Activity feed
- ✅ Shared infrastructure (78% cost savings)

## 🔗 Module Integration

The suite routes to standalone app APIs:
- `/api/projects/*` → Projects API
- `/api/crm/*` → CRM API
- `/api/invoicing/*` → Invoicing API
- `/api/helpdesk/*` → Helpdesk API
- `/api/queue/*` → Queue API

## 💰 Pricing

- **Business Suite**: $99/month (all 5 apps)
- **Individual Apps**: $19-39/month each
- **Industry Suites**: $39-59/month (2-3 apps)

## 🎯 Status

- ✅ Phase 1: Foundation (100%)
- ✅ Phase 2: Integration & Auth (100%)
- ⏳ Phase 3: Advanced Features (0%)
- ⏳ Phase 4: Deployment (0%)
