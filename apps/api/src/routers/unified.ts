/**
 * Unified Suite Router
 * 
 * Provides cross-module endpoints and unified dashboard data
 */

import { Hono } from "hono";
import { z } from "zod";
import { env } from "@suite/env/server";
import { requireAuth } from "../middleware/auth.js";
import type { SuiteStats, UnifiedActivity } from "@suite/shared";

const unifiedRouter = new Hono();
const requireAuthIfProd =
  process.env.NODE_ENV === "production"
    ? requireAuth
    : async (_c, next) => next();

/**
 * Get unified dashboard stats
 * Aggregates data from all modules
 */
unifiedRouter.get("/dashboard/stats", requireAuthIfProd, async (c) => {
  try {
    // Fetch stats from all modules in parallel
    const [projectsStats, crmStats, invoicingStats, helpdeskStats, queueStats] =
      await Promise.allSettled([
        fetch(`${env.PROJECTS_API_URL}/api/dashboard/stats`).then((r) =>
          r.json()
        ),
        fetch(`${env.CRM_API_URL}/api/dashboard/stats`).then((r) => r.json()),
        fetch(`${env.INVOICING_API_URL}/api/dashboard/stats`).then((r) =>
          r.json()
        ),
        fetch(`${env.HELPDESK_API_URL}/api/dashboard/stats`).then((r) =>
          r.json()
        ),
        fetch(`${env.QUEUE_API_URL}/api/dashboard/stats`).then((r) =>
          r.json()
        ),
      ]);

    const stats: SuiteStats = {
      projects: {
        total:
          projectsStats.status === "fulfilled" && projectsStats.value
            ? (projectsStats.value as { total?: number })?.total || 0
            : 0,
        active:
          projectsStats.status === "fulfilled" && projectsStats.value
            ? (projectsStats.value as { active?: number })?.active || 0
            : 0,
        completed:
          projectsStats.status === "fulfilled" && projectsStats.value
            ? (projectsStats.value as { completed?: number })?.completed || 0
            : 0,
      },
      crm: {
        contacts:
          crmStats.status === "fulfilled" && crmStats.value
            ? (crmStats.value as { totalContacts?: number })?.totalContacts || 0
            : 0,
        deals:
          crmStats.status === "fulfilled" && crmStats.value
            ? (crmStats.value as { activeDeals?: number })?.activeDeals || 0
            : 0,
        revenue:
          crmStats.status === "fulfilled" && crmStats.value
            ? (crmStats.value as { revenue?: number })?.revenue || 0
            : 0,
      },
      invoicing: {
        invoices:
          invoicingStats.status === "fulfilled" && invoicingStats.value
            ? (invoicingStats.value as { total?: number })?.total || 0
            : 0,
        paid:
          invoicingStats.status === "fulfilled" && invoicingStats.value
            ? (invoicingStats.value as { paid?: number })?.paid || 0
            : 0,
        pending:
          invoicingStats.status === "fulfilled" && invoicingStats.value
            ? (invoicingStats.value as { pending?: number })?.pending || 0
            : 0,
        revenue:
          invoicingStats.status === "fulfilled" && invoicingStats.value
            ? (invoicingStats.value as { revenue?: number })?.revenue || 0
            : 0,
      },
      helpdesk: {
        tickets:
          helpdeskStats.status === "fulfilled" && helpdeskStats.value
            ? (helpdeskStats.value as { total?: number })?.total || 0
            : 0,
        open:
          helpdeskStats.status === "fulfilled" && helpdeskStats.value
            ? (helpdeskStats.value as { open?: number })?.open || 0
            : 0,
        resolved:
          helpdeskStats.status === "fulfilled" && helpdeskStats.value
            ? (helpdeskStats.value as { resolved?: number })?.resolved || 0
            : 0,
      },
      queue: {
        tokens:
          queueStats.status === "fulfilled" && queueStats.value
            ? (queueStats.value as { total?: number })?.total || 0
            : 0,
        active:
          queueStats.status === "fulfilled" && queueStats.value
            ? (queueStats.value as { active?: number })?.active || 0
            : 0,
        completed:
          queueStats.status === "fulfilled" && queueStats.value
            ? (queueStats.value as { completed?: number })?.completed || 0
            : 0,
      },
    };

    return c.json(stats);
  } catch (error) {
    console.error("Error fetching unified stats:", error);
    return c.json({ error: "Failed to fetch dashboard stats" }, 500);
  }
});

/**
 * Get unified activity feed
 * Combines activities from all modules
 */
unifiedRouter.get("/activity", requireAuthIfProd, async (c) => {
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    // Fetch activities from all modules
    const activities: UnifiedActivity[] = [];

    // TODO: Implement activity aggregation from all modules
    // This would fetch recent activities from each module API
    // and combine them into a unified feed

    return c.json({
      activities: activities.slice(offset, offset + limit),
      total: activities.length,
    });
  } catch (error) {
    console.error("Error fetching unified activity:", error);
    return c.json({ error: "Failed to fetch activity feed" }, 500);
  }
});

/**
 * Cross-module search
 */
unifiedRouter.get("/search", requireAuthIfProd, async (c) => {
  const query = c.req.query("q");
  if (!query) {
    return c.json({ error: "Query parameter 'q' is required" }, 400);
  }

  try {
    // Search across all modules
    const results = {
      projects: [],
      crm: [],
      invoicing: [],
      helpdesk: [],
      queue: [],
    };

    // TODO: Implement cross-module search
    // This would search each module API and combine results

    return c.json(results);
  } catch (error) {
    console.error("Error performing cross-module search:", error);
    return c.json({ error: "Search failed" }, 500);
  }
});

export { unifiedRouter };
