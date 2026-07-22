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

Detection is only half the story — once VibeCode QA knows *what* your code is, it judges it
against a **published, reviewable standard**, not against a model's memory.

Each standard is a versioned, reviewable rubric where every rule has a stable ID
(`R-<AREA>-n`), the reason it exists, a ✅/❌ example, and a machine-readable detection
signal. VibeCode QA does not re-create generic React, TypeScript, OWASP, WCAG, Cloudflare,
or MCP doctrine. It cites those upstream standards, then authors the stack-specific glue:
repo shape, runtime/deploy constraints, detection mapping, exception policy, and
anti-patterns.

- **[React SPA — the react-spa standard](/standards/react-spa/)** — React, client-rendered,
  static-hosted (no SSR). Edition v1 (React 19 · Vite 8 · Tailwind 4 · TS 6). *Published.*
- **[References](standards/references.md)** — official specs and primary-source docs the
  rubrics cite.
- **[Compositions](standards/compositions.md)** — individual stack items and composed VCQA
  standards to author next.

Machine-readable files live at [`/standards/references.json`](/standards/references.json),
[`/standards/compositions.json`](/standards/compositions.json), and
[`/standards/registry.json`](/standards/registry.json).
