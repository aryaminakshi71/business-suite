/**
 * Module API Proxy Middleware
 * 
 * Proxies requests to standalone module APIs
 */

import type { Context, Next } from "hono";
import { env } from "@suite/env/server";
import type { ModuleName } from "@suite/shared";

const MODULE_URLS: Record<ModuleName, string | undefined> = {
  projects: env.PROJECTS_API_URL,
  crm: env.CRM_API_URL,
  invoicing: env.INVOICING_API_URL,
  helpdesk: env.HELPDESK_API_URL,
  queue: env.QUEUE_API_URL,
};

export function moduleProxy(module: ModuleName) {
  return async (c: Context, next: Next) => {
    const moduleUrl = MODULE_URLS[module];
    
    if (!moduleUrl) {
      return c.json(
        { error: `Module ${module} not configured` },
        503
      );
    }

    // Extract path after /api/{module}/
    const path = c.req.path.replace(`/api/${module}`, "");
    const url = `${moduleUrl}${path}${c.req.url.includes("?") ? "" : c.req.query() ? `?${new URLSearchParams(c.req.query()).toString()}` : ""}`;

    try {
      // Forward request to module API
      const headers = new Headers();
      c.req.header().forEach((value, key) => {
        headers.set(key, value);
      });
      headers.set("x-forwarded-for", c.req.header("cf-connecting-ip") || "");
      
      const response = await fetch(url, {
        method: c.req.method,
        headers,
        body: c.req.method !== "GET" && c.req.method !== "HEAD" 
          ? await c.req.raw.clone().arrayBuffer()
          : undefined,
      });

      // Forward response
      const data = await response.arrayBuffer();
      return new Response(data, {
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      console.error(`Error proxying to ${module}:`, error);
      return c.json(
        { error: `Failed to connect to ${module} module` },
        502
      );
    }
  };
}
