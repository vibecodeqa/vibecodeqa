# TypeScript - Edition v1

!!! info "Edition metadata"
    **Targets:** browser apps · APIs · Cloudflare Workers/Pages Functions · MCP · CLIs · SDKs · extensions · desktop apps · GitHub Actions
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `typescript@v1`
    **Canonical URL:** <https://vibecodeqa.online/standards/typescript/v1/>

This edition captures the cross-cutting TypeScript baseline VibeCode QA applies across
typed repo slices. It focuses on checkable static contracts and on places where TypeScript
must line up with runtime behavior.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
a `vcqa` signal, and primary references.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Config and strictness](config-and-strictness.md) | `CONFIG` / `STRICT` | strict mode, strict-family flags, source inclusion |
| 2 | [Runtime and modules](runtime-and-modules.md) | `RUNTIME` / `MODULE` | `lib`, `types`, module kind, module resolution, runtime fit |
| 3 | [Project structure](project-structure.md) | `PROJECT` / `REF` | project references, monorepo package boundaries, build mode |
| 4 | [Unsafe types and suppressions](unsafe-types-and-suppressions.md) | `ANY` / `SUPPRESS` / `ASSERT` | `any`, unsafe assertions, non-null assertions, ts comments |
| 5 | [Boundary typing and validation](boundary-typing-and-validation.md) | `BOUNDARY` / `VALIDATE` | external data, env, storage, SDK, API, tool, and config boundaries |
| 6 | [Imports and emit](imports-and-emit.md) | `IMPORT` / `EMIT` | type-only imports, emitted modules, path aliases |
| 7 | [Generated code and exceptions](generated-code-and-exceptions.md) | `GEN` / `EXCEPTION` | generated source, migration escapes, exception records |
| 8 | [Declarations and public API](declarations-and-public-api.md) | `DECL` / `API` | declaration emit, package exports, consumer type compatibility |
| 9 | [CI and evidence](ci-and-evidence.md) | `CI` / `EVIDENCE` | typecheck scripts, required checks, artifact/package evidence |

## Non-negotiables

- **R-STRICT-1** - owned source compiles with `strict: true` unless a narrow exception is
  documented.
- **R-RUNTIME-1** - compiler `lib`, `types`, `module`, and `moduleResolution` match the
  runtime boundary being shipped.
- **R-REF-1** - multi-package or multi-runtime TypeScript projects use project references
  or an equivalent explicit typecheck boundary.
- **R-ANY-1** - `any` and unsafe assertions are not used on owned boundary code without a
  local reason.
- **R-SUPPRESS-1** - `@ts-ignore` is banned; `@ts-expect-error` must be explained and
  self-expiring.
- **R-BOUNDARY-1** - untrusted data is runtime-validated before it is treated as a trusted
  TypeScript domain type.
- **R-IMPORT-1** - type-only imports are marked as type-only where the emit would otherwise
  create runtime imports.
- **R-DECL-1** - published packages ship declarations that match every supported public
  entrypoint.
- **R-CI-1** - deploy, release, and publish workflows run the relevant typecheck first.

## Reference baseline

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>
- TypeScript Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>
- TypeScript modules reference:
  <https://www.typescriptlang.org/docs/handbook/modules/reference.html>
- TypeScript declaration file publishing:
  <https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html>
- npm package metadata:
  <https://docs.npmjs.com/cli/v10/configuring-npm/package-json>
