# Project structure

## R-REF-1 - Typecheck boundaries are explicit

**Rule.** Multi-package, multi-runtime, or multi-output TypeScript projects must use
project references, separate `tsconfig` files, or an equivalent explicit typecheck boundary.

**Why.** Browser code, Node scripts, Workers, test code, generated clients, and packages
usually need different globals, emit, and include rules. One broad config hides those
boundaries.

**vcqa.** Flag monorepos or mixed runtime repos with one catch-all `tsconfig` that includes
all source without references or runtime-specific configs.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-REF-2 - Project references build in graph order

**Rule.** Referenced projects must be buildable with `tsc -b` or an equivalent graph-aware
command.

**Why.** Bare `tsc` can ignore dependency ordering and type stale outputs. Build mode gives
repeatable typecheck behavior across packages.

**vcqa.** Flag referenced TypeScript projects whose package scripts never run `tsc -b` or
whose referenced projects omit required composite/declaration settings.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-PROJECT-1 - Shared types do not create circular ownership

**Rule.** Shared types must live in a package or module whose ownership is clear and whose
imports do not pull runtime implementation back into lower-level packages.

**Why.** Type-only sharing can accidentally create runtime cycles or make packages depend
on app internals.

**vcqa.** Flag shared type imports from app/runtime implementation paths, cross-package
cycles, and public packages that import private app source for types.

**References.**

- TypeScript modules reference:
  <https://www.typescriptlang.org/docs/handbook/modules/reference.html>
