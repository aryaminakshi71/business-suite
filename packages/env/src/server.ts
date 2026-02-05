/**
 * Server environment variables
 * Never exposed to browser
 */

/// <reference types="@cloudflare/workers-types" />
import { z } from "zod";
import { clientSchema } from "./client.js";

// Get environment variables - works in both CF Workers and Node.js
// When SKIP_CLOUDFLARE=true, use process.env; otherwise use cloudflare:workers
function getEnv(): Record<string, unknown> {
  // @ts-ignore - cloudflare:workers is a virtual module only available in CF Workers
  if (typeof globalThis !== 'undefined' && 'process' in globalThis && process.env) {
    // Node.js environment (SKIP_CLOUDFLARE=true)
    return process.env as Record<string, unknown>;
  }
  // Try to use cloudflare:workers (will be externalized in build)
  try {
    // @ts-ignore
    const cfModule = require("cloudflare:workers");
    return cfModule.env;
  } catch {
    // Fallback to process.env
    return (typeof process !== 'undefined' ? process.env : {}) as Record<string, unknown>;
  }
}

const cfEnv = getEnv();
const isDev = (cfEnv.NODE_ENV ?? (typeof process !== "undefined" ? process.env.NODE_ENV : undefined) ?? "development") !== "production";
const devAuthSecret = "dev-secret-32-chars-please-change-000000";
const devDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/business_suite";

export const serverSchema = clientSchema.extend({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Auth (Better Auth)
  BETTER_AUTH_SECRET: isDev
    ? z.string().min(32).optional().default(devAuthSecret)
    : z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Database (Shared)
  DATABASE_URL: isDev
    ? z.string().url().optional().default(devDatabaseUrl)
    : z.string().url(),

  // Redis (Shared)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Storage (Shared R2)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),

  // Module API URLs (for gateway routing)
  PROJECTS_API_URL: z.string().url().optional(),
  CRM_API_URL: z.string().url().optional(),
  INVOICING_API_URL: z.string().url().optional(),
  HELPDESK_API_URL: z.string().url().optional(),
  QUEUE_API_URL: z.string().url().optional(),

  // Stripe Billing
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),

  // ============================================================================
  // MONITORING (Sentry)
  // ============================================================================

  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  SENTRY_DEBUG: z.string().optional(),

  // ============================================================================
  // APM (Datadog)
  // ============================================================================

  DATADOG_API_KEY: z.string().optional(),
  DATADOG_SERVICE_NAME: z.string().optional(),
  DATADOG_ENV: z.string().optional(),
  DATADOG_VERSION: z.string().optional(),

  // ============================================================================
  // LOG AGGREGATION
  // ============================================================================

  LOG_AGGREGATION_ENDPOINT: z.string().url().optional(),
  LOG_AGGREGATION_API_KEY: z.string().optional(),
  LOG_AGGREGATION_SERVICE: z.enum(["datadog", "logtail", "cloudwatch", "custom"]).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export const env: ServerEnv = serverSchema.parse(cfEnv);
