#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Install root-level dev dependencies (js-yaml, dotenv)
cd "$REPO_ROOT"
[ -d node_modules ] || npm install

# Install setup/ sub-action dependencies (TypeScript, Jest, ESLint, etc.)
# --ignore-scripts skips the 'prepare' build step (ncc build fails on newer Node.js
# due to OpenSSL legacy-provider issue with the pinned @vercel/ncc@0.31.1)
cd "$REPO_ROOT/setup"
[ -d node_modules ] || npm install --ignore-scripts
