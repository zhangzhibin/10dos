#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "Building..."
npm run build

echo "Deploying to Cloudflare Pages (project: 10dos)..."
npx wrangler pages deploy dist --project-name=10dos

echo "Done."
