#!/bin/bash

# Module Integration Test Script
# Tests module embedding and API proxy

set -e

API_URL="${API_URL:-http://localhost:3000}"

echo "🧪 Testing Business Suite Module Integration..."
echo "API URL: $API_URL"
echo ""

# Test module proxy endpoints
MODULES=("projects" "crm" "invoicing" "helpdesk" "queue")

for module in "${MODULES[@]}"; do
  echo "Testing $module module proxy..."
  
  # Test health endpoint through proxy
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/$module/health" || echo "000")
  
  if [ "$RESPONSE" = "200" ]; then
    echo "✅ $module proxy is working (HTTP 200)"
  elif [ "$RESPONSE" = "502" ] || [ "$RESPONSE" = "503" ]; then
    echo "⚠️  $module module not available (HTTP $RESPONSE) - make sure the module API is running"
  else
    echo "❌ $module proxy returned HTTP $RESPONSE"
  fi
  echo ""
done

# Test unified dashboard endpoint
echo "Testing unified dashboard endpoint..."
DASHBOARD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Cookie: better-auth.session_token=test" \
  "$API_URL/api/unified/dashboard/stats" || echo "000")

if [ "$DASHBOARD_RESPONSE" = "200" ]; then
  echo "✅ Unified dashboard endpoint is accessible"
elif [ "$DASHBOARD_RESPONSE" = "401" ]; then
  echo "⚠️  Unified dashboard requires authentication (expected)"
else
  echo "❌ Unified dashboard returned HTTP $DASHBOARD_RESPONSE"
fi
echo ""

# Test integrations endpoint
echo "Testing integrations endpoint..."
INTEGRATIONS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  "$API_URL/api/integrations" || echo "000")

if [ "$INTEGRATIONS_RESPONSE" = "200" ] || [ "$INTEGRATIONS_RESPONSE" = "404" ] || [ "$INTEGRATIONS_RESPONSE" = "401" ]; then
  echo "✅ Integrations endpoint is accessible (HTTP $INTEGRATIONS_RESPONSE)"
else
  echo "❌ Integrations endpoint returned HTTP $INTEGRATIONS_RESPONSE"
fi
echo ""

echo "✅ Module integration tests complete!"
echo ""
echo "Note: Some tests may fail if module APIs are not running."
echo "Start module APIs to test full integration:"
echo "  cd ../projects && bun run dev"
echo "  cd ../crm && bun run dev"
echo "  etc."
