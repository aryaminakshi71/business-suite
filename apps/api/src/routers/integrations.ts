/**
 * Cross-Module Integration Router
 * 
 * Provides endpoints for cross-module features:
 * - CRM → Invoicing: Convert contact to client, create invoice from deal
 * - Projects → Invoicing: Time tracking → Invoice items
 * - Helpdesk → CRM: Ticket → CRM activity
 */

import { Hono } from "hono";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { env } from "@suite/env/server";

const integrationsRouter = new Hono();

/**
 * Convert CRM contact to Invoicing client
 */
integrationsRouter.post(
  "/crm-to-invoicing/contact-to-client",
  requireAuth,
  async (c) => {
    const body = await c.req.json();
    const { contactId } = z.object({ contactId: z.string() }).parse(body);

    try {
      // Fetch contact from CRM
      const contactResponse = await fetch(
        `${env.CRM_API_URL}/api/contacts/${contactId}`,
        {
          headers: {
            Authorization: c.req.header("Authorization") || "",
            "x-organization-id": c.req.header("x-organization-id") || "",
          },
        }
      );

      if (!contactResponse.ok) {
        return c.json({ error: "Contact not found" }, 404);
      }

      const contact = await contactResponse.json();

      // Create client in Invoicing
      const clientResponse = await fetch(
        `${env.INVOICING_API_URL}/api/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: c.req.header("Authorization") || "",
            "x-organization-id": c.req.header("x-organization-id") || "",
          },
          body: JSON.stringify({
            name: `${contact.firstName} ${contact.lastName}`,
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
          }),
        }
      );

      if (!clientResponse.ok) {
        return c.json({ error: "Failed to create client" }, 500);
      }

      const client = await clientResponse.json();

      return c.json({
        success: true,
        client,
        message: "Contact converted to client successfully",
      });
    } catch (error) {
      console.error("Error converting contact to client:", error);
      return c.json({ error: "Integration failed" }, 500);
    }
  }
);

/**
 * Create invoice from CRM deal
 */
integrationsRouter.post(
  "/crm-to-invoicing/deal-to-invoice",
  requireAuth,
  async (c) => {
    const body = await c.req.json();
    const { dealId } = z.object({ dealId: z.string() }).parse(body);

    try {
      // Fetch deal from CRM
      const dealResponse = await fetch(
        `${env.CRM_API_URL}/api/deals/${dealId}`,
        {
          headers: {
            Authorization: c.req.header("Authorization") || "",
            "x-organization-id": c.req.header("x-organization-id") || "",
          },
        }
      );

      if (!dealResponse.ok) {
        return c.json({ error: "Deal not found" }, 404);
      }

      const deal = await dealResponse.json();

      // Get or create client from contact
      let clientId = deal.contactId;
      if (!clientId && deal.contactId) {
        // Convert contact to client first
        const convertResponse = await fetch(
          `${env.INVOICING_API_URL}/api/integrations/crm-to-invoicing/contact-to-client`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: c.req.header("Authorization") || "",
              "x-organization-id": c.req.header("x-organization-id") || "",
            },
            body: JSON.stringify({ contactId: deal.contactId }),
          }
        );
        if (convertResponse.ok) {
          const { client } = await convertResponse.json();
          clientId = client.id;
        }
      }

      // Create invoice
      const invoiceResponse = await fetch(
        `${env.INVOICING_API_URL}/api/invoices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: c.req.header("Authorization") || "",
            "x-organization-id": c.req.header("x-organization-id") || "",
          },
          body: JSON.stringify({
            customerId: clientId,
            items: [
              {
                description: deal.name,
                quantity: 1,
                unitPrice: parseFloat(deal.value) || 0,
              },
            ],
            notes: `Invoice created from deal: ${deal.name}`,
          }),
        }
      );

      if (!invoiceResponse.ok) {
        return c.json({ error: "Failed to create invoice" }, 500);
      }

      const invoice = await invoiceResponse.json();

      return c.json({
        success: true,
        invoice,
        message: "Invoice created from deal successfully",
      });
    } catch (error) {
      console.error("Error creating invoice from deal:", error);
      return c.json({ error: "Integration failed" }, 500);
    }
  }
);

/**
 * Create CRM activity from Helpdesk ticket
 */
integrationsRouter.post(
  "/helpdesk-to-crm/ticket-to-activity",
  requireAuth,
  async (c) => {
    const body = await c.req.json();
    const { ticketId } = z.object({ ticketId: z.string() }).parse(body);

    try {
      // Fetch ticket from Helpdesk
      const ticketResponse = await fetch(
        `${env.HELPDESK_API_URL}/api/tickets/${ticketId}`,
        {
          headers: {
            Authorization: c.req.header("Authorization") || "",
            "x-organization-id": c.req.header("x-organization-id") || "",
          },
        }
      );

      if (!ticketResponse.ok) {
        return c.json({ error: "Ticket not found" }, 404);
      }

      const ticket = await ticketResponse.json();

      // Create activity in CRM
      const activityResponse = await fetch(
        `${env.CRM_API_URL}/api/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: c.req.header("Authorization") || "",
            "x-organization-id": c.req.header("x-organization-id") || "",
          },
          body: JSON.stringify({
            type: "support_ticket",
            subject: `Support Ticket: ${ticket.subject}`,
            description: ticket.description,
            relatedTo: ticket.requesterEmail,
          }),
        }
      );

      if (!activityResponse.ok) {
        return c.json({ error: "Failed to create activity" }, 500);
      }

      const activity = await activityResponse.json();

      return c.json({
        success: true,
        activity,
        message: "Activity created from ticket successfully",
      });
    } catch (error) {
      console.error("Error creating activity from ticket:", error);
      return c.json({ error: "Integration failed" }, 500);
    }
  }
);

export { integrationsRouter };
