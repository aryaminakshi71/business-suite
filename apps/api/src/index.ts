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
import { rateLimitRedis } from "./middleware/rate-limit-redis.js";
import { getQueryStats, getSlowQueries } from "./lib/db-performance.js";
import { setSecurityHeaders } from "./lib/security.js";
// OpenAPI generation - simplified implementation

// Initialize monitoring
initSentry();
initDatadog();

export type Env = {
  // Cloudflare bindings
  DATABASE: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
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

// Security headers middleware
app.use("*", async (c, next) => {
  await next();
  setSecurityHeaders(c.res.headers);
});

// Health check with database and service checks - must be before rate limiting
app.get("/health", async (c) => {
  const checks: {
    database?: { status: "healthy" | "unhealthy" | "unknown"; responseTime: number; error?: string };
    cache: { status: "healthy" | "unhealthy" | "unknown"; responseTime: number; error?: string };
    modules: { status: "healthy" | "unhealthy" | "unknown" | "degraded"; responseTime: number; error?: string };
  } = {
    cache: { status: "unknown" as const, responseTime: 0 },
    modules: { status: "unknown" as const, responseTime: 0 },
  };

  // Check cache (Redis/KV)
  try {
    const cacheStart = Date.now();
    const redisUrl = c.env?.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
    if (redisUrl || c.env?.KV) {
      checks.cache = {
        status: "healthy",
        responseTime: Date.now() - cacheStart,
      };
    } else {
      checks.cache = {
        status: "unknown",
        responseTime: 0,
        error: "Cache not configured",
      };
    }
  } catch (error) {
    checks.cache = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: 0,
    };
  }

  // Check module APIs (if configured)
  try {
    const modulesStart = Date.now();
    const moduleUrls = [
      env.PROJECTS_API_URL,
      env.CRM_API_URL,
      env.INVOICING_API_URL,
      env.HELPDESK_API_URL,
      env.QUEUE_API_URL,
    ].filter(Boolean);

    if (moduleUrls.length > 0) {
      // Quick check of first module
      const testUrl = moduleUrls[0];
      if (testUrl) {
        const response = await fetch(`${testUrl}/health`, { signal: AbortSignal.timeout(2000) }).catch(() => null);
        checks.modules = {
          status: response?.ok ? "healthy" : "degraded",
          responseTime: Date.now() - modulesStart,
        };
      }
    } else {
      checks.modules = {
        status: "unknown",
        responseTime: 0,
        error: "Module APIs not configured",
      };
    }
  } catch (error) {
    checks.modules = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: 0,
    };
  }

  // Determine overall status
  const overallStatus =
    checks.cache.status === "healthy" && checks.modules.status !== "unhealthy"
      ? "ok"
      : checks.cache.status === "unhealthy" || checks.modules.status === "unhealthy"
        ? "error"
        : "degraded";

  return c.json({
    status: overallStatus,
    service: "business-suite-api",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      ...(checks.cache && {
        cache: {
          status: checks.cache.status,
          ...(checks.cache.responseTime && {
            responseTime: checks.cache.responseTime,
          }),
          ...(checks.cache.error && { error: checks.cache.error }),
        },
      }),
      ...(checks.modules && {
        modules: {
          status: checks.modules.status,
          ...(checks.modules.responseTime && {
            responseTime: checks.modules.responseTime,
          }),
          ...(checks.modules.error && { error: checks.modules.error }),
        },
      }),
    },
  });
});

// Also provide /api/health as an alias (same logic as /health)
app.get("/api/health", async (c) => {
  const checks: {
    database?: { status: "healthy" | "unhealthy" | "unknown"; responseTime: number; error?: string };
    cache: { status: "healthy" | "unhealthy" | "unknown"; responseTime: number; error?: string };
    modules: { status: "healthy" | "unhealthy" | "unknown" | "degraded"; responseTime: number; error?: string };
  } = {
    cache: { status: "unknown" as const, responseTime: 0 },
    modules: { status: "unknown" as const, responseTime: 0 },
  };

  // Check cache (Redis/KV)
  try {
    const cacheStart = Date.now();
    const redisUrl = c.env?.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
    if (redisUrl || c.env?.KV) {
      checks.cache = {
        status: "healthy",
        responseTime: Date.now() - cacheStart,
      };
    } else {
      checks.cache = {
        status: "unknown",
        responseTime: 0,
        error: "Cache not configured",
      };
    }
  } catch (error) {
    checks.cache = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: 0,
    };
  }

  // Check module APIs (if configured)
  try {
    const modulesStart = Date.now();
    const moduleUrls = [
      env.PROJECTS_API_URL,
      env.CRM_API_URL,
      env.INVOICING_API_URL,
      env.HELPDESK_API_URL,
      env.QUEUE_API_URL,
    ].filter(Boolean);

    if (moduleUrls.length > 0) {
      const testUrl = moduleUrls[0];
      if (testUrl) {
        const response = await fetch(`${testUrl}/health`, { signal: AbortSignal.timeout(2000) }).catch(() => null);
        checks.modules = {
          status: response?.ok ? "healthy" : "degraded",
          responseTime: Date.now() - modulesStart,
        };
      }
    } else {
      checks.modules = {
        status: "unknown",
        responseTime: 0,
        error: "Module APIs not configured",
      };
    }
  } catch (error) {
    checks.modules = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: 0,
    };
  }

  const overallStatus =
    checks.cache.status === "healthy" && checks.modules.status !== "unhealthy"
      ? "ok"
      : checks.cache.status === "unhealthy" || checks.modules.status === "unhealthy"
        ? "error"
        : "degraded";

  return c.json({
    status: overallStatus,
    service: "business-suite-api",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      ...(checks.cache && {
        cache: {
          status: checks.cache.status,
          ...(checks.cache.responseTime && { responseTime: checks.cache.responseTime }),
          ...(checks.cache.error && { error: checks.cache.error }),
        },
      }),
      ...(checks.modules && {
        modules: {
          status: checks.modules.status,
          ...(checks.modules.responseTime && { responseTime: checks.modules.responseTime }),
          ...(checks.modules.error && { error: checks.modules.error }),
        },
      }),
    },
  });
});

// Rate limiting middleware
app.use("/api/*", rateLimitRedis({ limiterType: "api" }));
app.use("/api/auth/*", rateLimitRedis({ limiterType: "auth" }));

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

// OpenAPI spec (for unified and integrations routers)
app.get("/api/openapi.json", async (c) => {
  try {
    // Basic OpenAPI spec - can be enhanced with orpc/openapi later
    const spec = {
      info: {
        title: "Business Suite API",
        version: "1.0.0",
        description: "Unified Business Suite API Gateway - Integrates Projects, CRM, Invoicing, Helpdesk, and Queue modules",
      },
      servers: [
        {
          url: env.VITE_PUBLIC_SITE_URL || "http://localhost:3000",
          description: "Current",
        },
      ],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT token from Better Auth",
          },
        },
      },
      tags: [
        { name: "Unified", description: "Unified suite endpoints" },
        { name: "Integrations", description: "Cross-module integrations" },
        { name: "System", description: "System endpoints" },
      ],
    };

    return c.json(spec);
  } catch (error) {
    return c.json({ error: "Failed to generate OpenAPI spec" }, 500);
  }
});

// API Documentation UI (basic JSON viewer)
app.get("/api/docs", async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Business Suite API Documentation</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
        </style>
      </head>
      <body>
        <h1>Business Suite API Documentation</h1>
        <p>OpenAPI spec: <a href="/api/openapi.json">/api/openapi.json</a></p>
        <p>Use a tool like <a href="https://editor.swagger.io" target="_blank">Swagger Editor</a> to view the spec.</p>
      </body>
    </html>
  `);
});

export default app;
