# Config and strictness

## R-STRICT-1 - Owned source uses strict mode

**Rule.** TypeScript source owned by the repo must compile with `strict: true` unless the
standard or repo records a narrow migration or generated-code exception.

**Why.** Most TypeScript value comes from strict nullability, implicit any checks, and
control-flow narrowing. Without strict mode, a typed repo can still ship common runtime
shape bugs.

**vcqa.** Resolve effective `tsconfig` files for owned source and flag `strict: false`,
missing strict mode, or strict-family flags disabled without a documented exception.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-STRICT-2 - Strict-family flags model real data

**Rule.** Behavior-bearing source should enable `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, and `noImplicitOverride` unless the stack records why a flag
is not viable.

**Why.** Arrays can be out of range, optional properties can be absent, and overrides can
silently drift. These flags make the compiler model runtime reality more closely.

**vcqa.** Inspect effective compiler options and flag missing strict-family extras in
owned app, API, package, Worker, CLI, and SDK source.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-CONFIG-1 - Source inclusion is intentional

**Rule.** `include`, `exclude`, `files`, references, and generated folders must be
configured so owned source is typechecked and generated/build output is not treated as the
source of truth.

**Why.** A repo can look typed while important source files are outside the compiler graph,
or while stale generated output hides source errors.

**vcqa.** Compare source roots with TypeScript config inclusion; flag owned `src`,
`functions`, `packages`, `worker`, `cli`, or extension source outside all typecheck configs.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>
