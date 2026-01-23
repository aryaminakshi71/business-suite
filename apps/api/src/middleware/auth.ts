/**
 * Authentication Middleware
 * Validates session and adds user context
 */

import type { Context, Next } from "hono";
import { auth } from "@suite/auth/server";

export async function requireAuth(c: Context, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Add user to context
    c.set("user", session.user);
    c.set("session", session.session);

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
}

export async function optionalAuth(c: Context, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session?.user) {
      c.set("user", session.user);
      c.set("session", session.session);
    }

    return next();
  } catch {
    // Continue without auth
    return next();
  }
}
