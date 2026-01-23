#!/bin/bash

# Cross-Module Integration Test Script
# Tests cross-module features

set -e

API_URL="${API_URL:-http://localhost:3000}"
SESSION_TOKEN="${SESSION_TOKEN:-}"

echo "🧪 Testing Cross-Module Integrations..."
echo "API URL: $API_URL"
echo ""

if [ -z "$SESSION_TOKEN" ]; then
  echo "⚠️  Warning: SESSION_TOKEN not set. Some tests will fail."
  echo "   Get a session token by signing in first."
  echo ""
fi

# Test CRM → Invoicing: Contact to Client
echo "1. Testing CRM → Invoicing: Contact to Client..."
CONTACT_TO_CLIENT=$(curl -s -X POST "$API_URL/api/integrations/crm-to-invoicing/contact-to-client" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN" \
  -d '{
    "contactId": "test-contact-id"
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$CONTACT_TO_CLIENT" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$CONTACT_TO_CLIENT" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Contact to client conversion successful"
elif [ "$HTTP_CODE" = "401" ]; then
  echo "⚠️  Requires authentication (set SESSION_TOKEN)"
elif [ "$HTTP_CODE" = "404" ]; then
  echo "⚠️  Contact not found (expected if using test ID)"
else
  echo "❌ Failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test CRM → Invoicing: Deal to Invoice
echo "2. Testing CRM → Invoicing: Deal to Invoice..."
DEAL_TO_INVOICE=$(curl -s -X POST "$API_URL/api/integrations/crm-to-invoicing/deal-to-invoice" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN" \
  -d '{
    "dealId": "test-deal-id"
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$DEAL_TO_INVOICE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$DEAL_TO_INVOICE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Deal to invoice conversion successful"
elif [ "$HTTP_CODE" = "401" ]; then
  echo "⚠️  Requires authentication (set SESSION_TOKEN)"
elif [ "$HTTP_CODE" = "404" ]; then
  echo "⚠️  Deal not found (expected if using test ID)"
else
  echo "❌ Failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test Helpdesk → CRM: Ticket to Activity
echo "3. Testing Helpdesk → CRM: Ticket to Activity..."
TICKET_TO_ACTIVITY=$(curl -s -X POST "$API_URL/api/integrations/helpdesk-to-crm/ticket-to-activity" \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=$SESSION_TOKEN" \
  -d '{
    "ticketId": "test-ticket-id"
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$TICKET_TO_ACTIVITY" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$TICKET_TO_ACTIVITY" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Ticket to activity conversion successful"
elif [ "$HTTP_CODE" = "401" ]; then
  echo "⚠️  Requires authentication (set SESSION_TOKEN)"
elif [ "$HTTP_CODE" = "404" ]; then
  echo "⚠️  Ticket not found (expected if using test ID)"
else
  echo "❌ Failed (HTTP $HTTP_CODE)"
fi
echo ""

echo "✅ Cross-module integration tests complete!"
echo ""
echo "Note: These tests require:"
echo "1. Valid session token (sign in first)"
echo "2. Module APIs running and accessible"
echo "3. Test data in modules (contacts, deals, tickets)"
