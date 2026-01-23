/**
 * Shared types across the suite
 */

export type ModuleName = "projects" | "crm" | "invoicing" | "helpdesk" | "queue";

export interface ModuleConfig {
  name: ModuleName;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  apiUrl?: string;
  enabled: boolean;
}

export interface SuiteStats {
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  crm: {
    contacts: number;
    deals: number;
    revenue: number;
  };
  invoicing: {
    invoices: number;
    paid: number;
    pending: number;
    revenue: number;
  };
  helpdesk: {
    tickets: number;
    open: number;
    resolved: number;
  };
  queue: {
    tokens: number;
    active: number;
    completed: number;
  };
}

export interface UnifiedActivity {
  id: string;
  module: ModuleName;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  userName?: string;
  metadata?: Record<string, unknown>;
}
