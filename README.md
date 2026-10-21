# Bridge demo design system

**This is a demo.** A sample design system with a fictional team (Ann Leroy, Leo Martin, Dana Moreau) and sample
changes waiting for review, so you can see what [Bridge](https://bridge.floriangouloubi.com) looks like on a
living repository. Every branch, pull request and issue here is real GitHub data, opened with the Bridge CLI and
MCP server; the people named in them are fictional requesters, and all GitHub actions are by @peterbono.

- Studio: https://bridge.floriangouloubi.com/studio/peterbono/bridge-demo-ds/
- Library: https://bridge.floriangouloubi.com/library/peterbono/bridge-demo-ds/

## What is inside

- `packages/tokens/src`: DTCG 2025.10 tokens (primitives, brands, semantic light and dark, density, component
  tier) and the contrast gate `contrast.checks.json`.
- `packages/react/src/components`: React components, each with `Name.docs.json` (usage guidance), stories and
  CSS Modules that only read tokens.
- `apps/account`: a small sample product that uses the library, measured by the adoption audit.
- `bridge.config.json`: where Bridge finds all of this, who owns it and how changes arrive.
- `.github/workflows/bridge-data.yml`: publishes the Bridge snapshot and the adoption audit to the `bridge-data`
  branch with the run's `GITHUB_TOKEN` only.

Copied from [peterbono/ai-design-system-demo](https://github.com/peterbono/ai-design-system-demo); the packages
are private and never published.

## Refresh the sample data

See [docs/SEEDING.md](docs/SEEDING.md) and `scripts/seed-demo.mjs`.
