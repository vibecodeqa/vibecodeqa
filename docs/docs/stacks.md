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
