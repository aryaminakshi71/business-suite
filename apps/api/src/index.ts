/**
 * Business Suite API Gateway
 * 
 * Routes requests to module APIs and provides unified endpoints
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "@suite/env/server";
import { auth } from "@suite/auth/server";
import { initSentry } from "./lib/sentry.js";
import { initDatadog } from "./lib/datadog.js";
import { unifiedRouter } from "./routers/unified.js";
import { integrationsRouter } from "./routers/integrations.js";
import { moduleProxy } from "./middleware/proxy.js";

// Initialize monitoring
initSentry();
initDatadog();

export type Env = {
  // Cloudflare bindings
  DATABASE: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
};

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: env.VITE_PUBLIC_SITE_URL || "*",
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "business-suite-api" });
});

// Auth endpoints (Better Auth)
app.all("/api/auth/*", async (c) => {
  return auth.handler(c.req.raw);
});

// Unified suite endpoints
app.route("/api/unified", unifiedRouter);

// Cross-module integrations
app.route("/api/integrations", integrationsRouter);

// Proxy to module APIs
app.all("/api/projects/*", moduleProxy("projects"));
app.all("/api/crm/*", moduleProxy("crm"));
app.all("/api/invoicing/*", moduleProxy("invoicing"));
app.all("/api/helpdesk/*", moduleProxy("helpdesk"));
app.all("/api/queue/*", moduleProxy("queue"));

export default app;
