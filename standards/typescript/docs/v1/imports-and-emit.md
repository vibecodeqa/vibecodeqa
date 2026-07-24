# Imports and emit

## R-IMPORT-1 - Type-only imports are explicit

**Rule.** Imports used only as types must use `import type` or inline `type` modifiers when
the compiler/bundler would otherwise emit a runtime import.

**Why.** Type-only symbols should not pull modules and side effects into runtime bundles or
published packages.

**vcqa.** Flag imports used only in type positions when configs do not preserve the intended
type-only behavior.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-EMIT-1 - Emit behavior is deliberate

**Rule.** Compiler options that affect emit, such as `noEmit`, `declaration`,
`emitDeclarationOnly`, `sourceMap`, `declarationMap`, and `verbatimModuleSyntax`, must match
the artifact the slice ships.

**Why.** Apps, Workers, CLIs, and packages need different outputs. A config copied from
another runtime can publish missing declarations, stale maps, or wrong module imports.

**vcqa.** Compare TypeScript emit settings with package metadata, build outputs, deploy
workflows, and Zensical/standards generated-output policy.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-IMPORT-2 - Path aliases resolve in every tool that uses them

**Rule.** Path aliases must be configured consistently across TypeScript, bundler/test
runner, runtime, and package consumers.

**Why.** TypeScript `paths` affects typechecking, not necessarily runtime resolution. An
alias can pass in the editor and fail in a build, test, or published package.

**vcqa.** Flag `paths` aliases without matching Vite/Vitest/tsup/Node/package export
support, and flag published packages exposing private alias paths.

**References.**

- TypeScript modules reference:
  <https://www.typescriptlang.org/docs/handbook/modules/reference.html>
