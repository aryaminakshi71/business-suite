/**
 * Client environment variables
 * Safe to expose to the browser
 */

// Only include vite/client types when in a vite context
// Vite types are optional - only needed in vite context
// Skip type check for vite/client when building API
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
    // Use process.env as fallback for non-vite contexts (like API builds)
    const getEnv = (key: string): string | undefined => {
      try {
        // Check if we're in a vite context
        if (typeof import.meta !== 'undefined' && 'env' in import.meta) {
          return (import.meta as any).env?.[key];
        }
      } catch {
        // Ignore errors when import.meta.env is not available
      }
      return process.env[key];
    };
    
    return clientSchema.parse({
      VITE_PUBLIC_SITE_URL: getEnv('VITE_PUBLIC_SITE_URL'),
      VITE_PUBLIC_CDN_URL: getEnv('VITE_PUBLIC_CDN_URL'),
      VITE_PUBLIC_PROJECTS_API_URL: getEnv('VITE_PUBLIC_PROJECTS_API_URL'),
      VITE_PUBLIC_CRM_API_URL: getEnv('VITE_PUBLIC_CRM_API_URL'),
      VITE_PUBLIC_INVOICING_API_URL: getEnv('VITE_PUBLIC_INVOICING_API_URL'),
      VITE_PUBLIC_HELPDESK_API_URL: getEnv('VITE_PUBLIC_HELPDESK_API_URL'),
      VITE_PUBLIC_QUEUE_API_URL: getEnv('VITE_PUBLIC_QUEUE_API_URL'),
      VITE_PUBLIC_POSTHOG_KEY: getEnv('VITE_PUBLIC_POSTHOG_KEY'),
      VITE_PUBLIC_POSTHOG_HOST: getEnv('VITE_PUBLIC_POSTHOG_HOST'),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Client environment validation failed:", error.issues);
    }
    throw new Error("Client environment validation failed");
  }
})();
