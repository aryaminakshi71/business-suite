/**
 * Client environment variables
 * Safe to expose to the browser
 */

/// <reference types="vite/client" />
import { z } from "zod";

export const clientSchema = z.object({
  VITE_PUBLIC_SITE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:5173"),
  VITE_PUBLIC_CDN_URL: z.string().url().optional(),
  // Module API URLs (for routing)
  VITE_PUBLIC_PROJECTS_API_URL: z.string().url().optional(),
  VITE_PUBLIC_CRM_API_URL: z.string().url().optional(),
  VITE_PUBLIC_INVOICING_API_URL: z.string().url().optional(),
  VITE_PUBLIC_HELPDESK_API_URL: z.string().url().optional(),
  VITE_PUBLIC_QUEUE_API_URL: z.string().url().optional(),
  // PostHog Analytics
  VITE_PUBLIC_POSTHOG_KEY: z.string().startsWith("phc_").optional(),
  VITE_PUBLIC_POSTHOG_HOST: z.string().url().optional().default("https://us.i.posthog.com"),
});

export type ClientEnv = z.infer<typeof clientSchema>;

export const env: ClientEnv = (() => {
  try {
    return clientSchema.parse({
      VITE_PUBLIC_SITE_URL: import.meta.env?.VITE_PUBLIC_SITE_URL,
      VITE_PUBLIC_CDN_URL: import.meta.env?.VITE_PUBLIC_CDN_URL,
      VITE_PUBLIC_PROJECTS_API_URL: import.meta.env?.VITE_PUBLIC_PROJECTS_API_URL,
      VITE_PUBLIC_CRM_API_URL: import.meta.env?.VITE_PUBLIC_CRM_API_URL,
      VITE_PUBLIC_INVOICING_API_URL: import.meta.env?.VITE_PUBLIC_INVOICING_API_URL,
      VITE_PUBLIC_HELPDESK_API_URL: import.meta.env?.VITE_PUBLIC_HELPDESK_API_URL,
      VITE_PUBLIC_QUEUE_API_URL: import.meta.env?.VITE_PUBLIC_QUEUE_API_URL,
      VITE_PUBLIC_POSTHOG_KEY: import.meta.env?.VITE_PUBLIC_POSTHOG_KEY,
      VITE_PUBLIC_POSTHOG_HOST: import.meta.env?.VITE_PUBLIC_POSTHOG_HOST,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Client environment validation failed:", error.issues);
    }
    throw new Error("Client environment validation failed");
  }
})();
