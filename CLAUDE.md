# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **Infracost GitHub Actions** repository. It provides:
- A root-level composite action (`action.yml`) — a convenience wrapper combining setup + diff + comment
- A `setup/` sub-action (TypeScript/Node) — installs the Infracost CLI in a GitHub Actions runner
- Example workflows in `examples/` showing common usage patterns
- A test framework that extracts YAML from example READMEs and validates them against golden files

## Commands

All commands run from the repo root unless noted.

```sh
npm install                   # Install root-level dev dependencies (js-yaml, dotenv)
npm run examples:generate_tests  # Extract YAML from example READMEs → .github/workflows/examples_test.yml
npm run examples:test            # Run examples locally using `act` (requires act installed)
npm run examples:update_golden   # Regenerate golden files (requires GITHUB_TOKEN env var)
```

From `setup/` directory:
```sh
cd setup
npm install
npm run lint      # ESLint with airbnb-base rules
npm run prepare   # Compile TypeScript → dist/index.js via ncc (bundles all deps)
npm run test      # Jest tests
npm run all       # lint + prepare + test
npm run format    # Prettier formatting
```

## Architecture

### Root action (`action.yml`)
A composite GitHub Action that orchestrates: checkout base branch → setup Infracost → generate baseline → checkout PR branch → run diff → post comment. Inputs: `api-key`, `path`, `behavior`.

### `setup/` sub-action
TypeScript action compiled with `@vercel/ncc` into a single `dist/index.js`. It downloads the Infracost binary from GitHub releases, extracts it, adds it to PATH, and optionally runs `infracost configure set` for API key, currency, pricing endpoint, and dashboard settings. The `dist/` is committed and is what actually runs.

### Example testing flow
1. `scripts/generateExamplesTests.js` scans each `examples/*/README.md` for YAML between `[//]: <> (BEGIN EXAMPLE)` / `[//]: <> (END EXAMPLE)` markers
2. Rewrites local action references (e.g. `infracost/actions/setup@v2` → `./setup`)
3. Replaces comment steps with golden file comparison steps
4. Outputs a single `.github/workflows/examples_test.yml` with one job per example

### Golden files (`testdata/`)
Golden files contain expected PR comment output for each example. Update them with `npm run examples:update_golden` after intentional changes.

## Release process
Tags follow semver (`vX.Y.Z`) plus a floating major tag (`v2`). After tagging, publish a new release to the GitHub Marketplace.
