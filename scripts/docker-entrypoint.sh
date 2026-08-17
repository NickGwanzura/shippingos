#!/bin/sh
set -eu

# Dokploy file mounts provide a secure fallback on Swarm hosts where service
# environment injection is unavailable. Standard runtime variables still win.
if [ -f /app/.env.runtime ]; then
  set -a
  . /app/.env.runtime
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

if [ -z "${AUTH_SECRET:-${NEXTAUTH_SECRET:-}}" ]; then
  echo "AUTH_SECRET (or NEXTAUTH_SECRET) is required" >&2
  exit 1
fi

echo "Applying the Prisma schema..."
npx prisma db push --skip-generate

if [ "${SEED_DEMO_DATA_IF_EMPTY:-true}" = "true" ]; then
  npx tsx prisma/init-demo.ts
fi

exec node server.js
