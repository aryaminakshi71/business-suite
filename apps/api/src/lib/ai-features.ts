/**
 * Business Suite AI Features
 *
 * AI-powered features for Business Suite:
 * - Cross-module insights
 * - Unified analytics
 * - Predictive business metrics
 */

import { createAIClient, generateSuggestions, predictScore, analyzeText } from "./ai";

const ai = createAIClient({ provider: "openai" });

/**
 * Generate cross-module insights
 */
export async function generateCrossModuleInsights(
  data: {
    crm?: { contacts: number; deals: number };
    invoicing?: { invoices: number; revenue: number };
    projects?: { active: number; completed: number };
  }
): Promise<string[]> {
  if (!ai) {
    return [];
  }

  const context = `
    CRM: ${data.crm?.contacts || 0} contacts, ${data.crm?.deals || 0} deals
    Invoicing: ${data.invoicing?.invoices || 0} invoices, $${data.invoicing?.revenue || 0} revenue
    Projects: ${data.projects?.active || 0} active, ${data.projects?.completed || 0} completed
  `;

  return await generateSuggestions(ai, "Business-Suite", context, "insights");
}

/**
 * Predict business health
 */
export async function predictBusinessHealth(
  metrics: {
    revenue: number;
    expenses: number;
    growth: number;
    customerSatisfaction?: number;
  }
): Promise<{ score: number; reasoning: string }> {
  if (!ai) {
    return { score: 50, reasoning: "AI not configured" };
  }

  const context = `Revenue: $${metrics.revenue}, Expenses: $${metrics.expenses}, Growth: ${metrics.growth}%, Satisfaction: ${metrics.customerSatisfaction || "N/A"}`;
  return await predictScore(ai, context, "value");
}
