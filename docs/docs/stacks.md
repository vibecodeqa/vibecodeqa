---
icon: lucide/layers
---

# Supported stacks

VibeCode QA auto-detects your stack from `package.json`, `pubspec.yaml`, lockfiles, and config files — no flags required.

## Languages & frameworks

=== "TypeScript / JavaScript"

    - **Frameworks:** React, Vue (`.vue` SFC), Svelte (`.svelte` SFC), Next.js, Nuxt, SvelteKit
    - **Type checking:** `tsc --noEmit` (per-package in monorepos)
    - **Lint:** Biome or ESLint, auto-detected
    - Single-file components have their `<script>` extracted for complexity, duplication, error handling, and the import graph.

=== "Dart / Flutter"

    - **Analysis:** `dart analyze`
    - **Tests:** `flutter_test`, `_test.dart` convention
    - **Type safety:** `dynamic`, missing `late`, and more
    - Complexity, duplication, error handling, secrets, security, architecture, confusion, context, docs, best practices, and performance all run on Dart code.

## Monorepos

Workspaces are detected and checks run per-package where it matters (types, lint):

- pnpm / npm / yarn workspaces
- Lerna, Turborepo, Nx
- Melos (Dart)

## What adapts per stack

| Concern | TypeScript/JS | Dart/Flutter |
|---|---|---|
| Type errors | `tsc --noEmit` | `dart analyze` |
| Tests | vitest / jest | flutter_test |
| Lint | Biome / ESLint | dart analyze |
| Test convention | `*.test.ts` | `*_test.dart` |
| Components | `.vue` / `.svelte` SFC | widgets |

If a check doesn't apply to your stack, it's skipped and excluded from the [score](scoring.md) rather than counted against you.

## Standards

Detection is only half the story - once VibeCode QA knows *what* your code is, it judges it
against a **published, reviewable standard**, not against a model's memory.

Each authored standard is a versioned, reviewable rubric where every rule has a stable ID
(`R-<AREA>-n`), the reason it exists, examples, and a machine-readable detection signal.
VibeCode QA does not re-create generic React, TypeScript, OWASP, WCAG, Cloudflare, or MCP
doctrine. It cites those upstream standards, then authors the stack-specific or
cross-cutting glue: repo shape, runtime/deploy constraints, detection mapping, exception
policy, and anti-patterns.

### Authored stack rubrics

- [React SPA v1](/standards/react-spa/v1/) - client-rendered React hosted as static files.
- [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) - static
  frontend plus same-origin Pages Functions API. Also cataloged as
  `react-spa-on-cloudflare-pages`.
- [Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/) - D1 migrations, bindings,
  query safety, and environment isolation.
- [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/) - remote
  MCP on Workers with authorization, tool schemas, storage boundaries, and auditability.
- [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/) -
  per-tenant Cloudflare deployment, promotion, data state, aliases, and auditability.

### Authored cross-cutting rubrics

- [Security v1](/standards/security/v1/) - app, API, Worker, MCP, CLI, SDK, CI, and docs
  security boundaries.
- [Testing v1](/standards/testing/v1/) - unit, integration, UI, E2E, smoke, coverage,
  mock, fixture, snapshot, skipped-test, and CI evidence rules.
- [TypeScript v1](/standards/typescript/v1/) - strictness, unsafe types, runtime
  boundaries, generated code policy, declaration quality, and CI typecheck gates.

The public catalog starts at [Standards](standards/index.md). Use
[Stack standards](standards/stacks/index.md) for deployable stack charters,
[Stack items](standards/items/index.md) for reusable leaves, [Graph](standards/graph.md)
for the composed map, and [Assessment reports](standards/assessments/index.md) for the
dated page reviews.

Machine-readable files live at [`/standards/references.json`](/standards/references.json),
[`/standards/compositions.json`](/standards/compositions.json), and
[`/standards/registry.json`](/standards/registry.json).
