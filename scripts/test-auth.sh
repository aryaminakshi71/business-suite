#!/bin/bash

# Authentication Test Script
# Tests the authentication flow

set -e

API_URL="${API_URL:-http://localhost:3000}"

echo "🧪 Testing Business Suite Authentication..."
echo "API URL: $API_URL"
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "$API_URL/health")
echo "Response: $HEALTH"
echo ""

# Test auth endpoint exists
echo "2. Testing auth endpoint..."
AUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/auth/sign-in")
if [ "$AUTH_RESPONSE" = "200" ] || [ "$AUTH_RESPONSE" = "405" ]; then
  echo "✅ Auth endpoint is accessible (HTTP $AUTH_RESPONSE)"
else
  echo "❌ Auth endpoint returned HTTP $AUTH_RESPONSE"
fi
echo ""

# Test sign-up (if endpoint exists)
echo "3. Testing sign-up endpoint..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/sign-up" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }' \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$SIGNUP_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
BODY=$(echo "$SIGNUP_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo "✅ Sign-up successful (HTTP $HTTP_CODE)"
  echo "Response: $BODY"
elif [ "$HTTP_CODE" = "400" ]; then
  echo "⚠️  Sign-up returned 400 (user might already exist or validation failed)"
  echo "Response: $BODY"
else
  echo "❌ Sign-up failed (HTTP $HTTP_CODE)"
  echo "Response: $BODY"
fi
echo ""

echo "✅ Authentication tests complete!"
echo ""
echo "Next steps:"
echo "1. Test sign-in with created user"
echo "2. Test protected endpoints with session cookie"
echo "3. Test module embedding"
