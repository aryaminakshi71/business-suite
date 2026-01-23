#!/bin/bash

# Database Setup Script for Business Suite
# This script helps set up the database schema

set -e

echo "🚀 Setting up Business Suite Database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "Please set it in your .env file or export it:"
  echo "  export DATABASE_URL=postgresql://user:password@host:5432/database"
  exit 1
fi

echo "✅ DATABASE_URL is set"

# Navigate to storage package
cd packages/storage

echo "📦 Generating database migrations..."
bun run db:generate

echo "📤 Pushing schema to database..."
bun run db:push

echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify tables were created: bun run db:studio"
echo "2. Test authentication: bun run dev (in apps/api)"
echo "3. Create a test user via the sign-up endpoint"
