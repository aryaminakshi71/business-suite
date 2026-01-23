/**
 * Module Embed Component
 * 
 * Embeds standalone module apps into the suite
 * Options:
 * 1. Iframe embedding (simple, isolated)
 * 2. Micro-frontend (advanced, shared state)
 * 3. Direct routing (redirect to module app)
 */

import { env } from "@suite/env";
import type { ModuleName } from "@suite/shared";

interface ModuleEmbedProps {
  module: ModuleName;
  mode?: "iframe" | "redirect" | "micro-frontend";
  height?: string;
}

const MODULE_URLS: Record<ModuleName, string | undefined> = {
  projects: env.VITE_PUBLIC_PROJECTS_API_URL?.replace("/api", "") || "http://localhost:3001",
  crm: env.VITE_PUBLIC_CRM_API_URL?.replace("/api", "") || "http://localhost:3002",
  invoicing: env.VITE_PUBLIC_INVOICING_API_URL?.replace("/api", "") || "http://localhost:3003",
  helpdesk: env.VITE_PUBLIC_HELPDESK_API_URL?.replace("/api", "") || "http://localhost:3004",
  queue: env.VITE_PUBLIC_QUEUE_API_URL?.replace("/api", "") || "http://localhost:3005",
};

export function ModuleEmbed({ module, mode = "iframe", height = "100vh" }: ModuleEmbedProps) {
  const moduleUrl = MODULE_URLS[module];

  if (!moduleUrl) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Module {module} not configured. Please set VITE_PUBLIC_{module.toUpperCase()}_API_URL
        </div>
      </div>
    );
  }

  if (mode === "redirect") {
    // Redirect to module app
    window.location.href = moduleUrl;
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Redirecting to {module}...</div>
      </div>
    );
  }

  if (mode === "iframe") {
    return (
      <iframe
        src={moduleUrl}
        className="w-full border-0"
        style={{ height }}
        title={`${module} module`}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    );
  }

  // Micro-frontend mode (for future implementation)
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">
        Micro-frontend integration coming soon for {module}
      </div>
    </div>
  );
}
