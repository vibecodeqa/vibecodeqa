# 2 · TypeScript

TypeScript is the safety net a static SPA has instead of a server. There is no backend to
re-validate a shape, no runtime to catch a bad cast before the user sees a blank screen —
the compiler is where mistakes get caught. These rules lock the config to **strict**, keep
the type-check fast and correct across packages, and forbid the escape hatches that quietly
turn a typed codebase back into an untyped one.

## Rules

### R-TS-1 · Strict mode is on

**Rule.** `tsconfig` (the base that app sources extend) sets `"strict": true`.

**Why.** `strict` turns on the flags that catch the bugs a static app can't recover from at
runtime — `strictNullChecks` above all. Without it, `undefined` flows silently into render
and the user gets a white screen, not an error you can see. One flag, most of the value.

```jsonc
// tsconfig.app.json → compilerOptions
{
  "strict": true // ✅ non-negotiable
}
```

**vcqa.** The effective config for `src/**` has `strict: true`; flag `strict: false` or any
individual strict-family flag set back to `false`.

### R-TS-2 · The strict-family extras

**Rule.** Beyond `strict`, the config enables `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, and `noImplicitOverride`.

**Why.** `strict` alone still lets `arr[i]` be typed as non-`undefined` (it isn't — the
index may be out of range) and lets `{ x?: T }` be assigned `undefined` where the property
was meant to be absent. In a client app fed by external JSON, out-of-range and
maybe-present are exactly the shapes that arrive. These flags make the compiler model
reality.

```jsonc
// tsconfig.app.json → compilerOptions
{
  "noUncheckedIndexedAccess": true,   // arr[i] is T | undefined
  "exactOptionalPropertyTypes": true, // ?: means absent, not undefined
  "noImplicitOverride": true          // override keyword required
}
```

**vcqa.** All three keys present and `true` in the app tsconfig.

### R-TS-3 · Split tsconfigs with a solution root

**Rule.** Config is split into `tsconfig.app.json` (browser sources, DOM lib, bundler
resolution) and `tsconfig.node.json` (Vite config and other Node-side files), referenced
from a thin root `tsconfig.json`.

**Why.** App code and the build config run in different environments with different globals
and libs. A single tsconfig either leaks Node types into browser code or DOM types into the
Vite config. Splitting them keeps each surface honest and lets `tsc -b` cache them
independently.

```jsonc
// tsconfig.json (root) — references only, no sources
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**vcqa.** Root `tsconfig.json` has a `references` array and empty/absent `files`;
`tsconfig.app.json` and `tsconfig.node.json` exist.

### R-TS-4 · Project references, built with `tsc -b`

**Rule.** The referenced projects set `"composite": true`, and the type-check runs in build
mode (`tsc -b`), not plain `tsc`.

**Why.** `composite` + `tsc -b` is what makes references real: incremental builds, correct
cross-project ordering, and a fast re-check that only touches what changed. `tsc` (no `-b`)
ignores the reference graph and either does the wrong thing or does too much.

```jsonc
// package.json
"scripts": {
  "typecheck": "tsc -b",
  "build": "tsc -b && vite build"
}
```

**vcqa.** Referenced projects have `composite: true`; `typecheck`/`build` scripts invoke
`tsc -b` (build mode), not bare `tsc`.

### R-TS-5 · Ban `any`; reach for `unknown`

**Rule.** No explicit `any` in source; `unknown` is used for genuinely-unknown values and
narrowed before use. `noImplicitAny` (via `strict`) stays on.

**Why.** `any` disables the type system locally and infects everything it touches — the one
place you cast to `any` is the one place a static app crashes for a user. `unknown` forces a
narrowing check, which is the honest way to handle a value whose shape you don't yet know.

```ts
// ❌ any — every downstream access is unchecked
function parse(raw: any) { return raw.items.map((x) => x.id); }

// ✅ unknown — must be narrowed before use
function parse(raw: unknown): string[] {
  if (!isPayload(raw)) throw new Error('bad payload');
  return raw.items.map((x) => x.id);
}
```

**vcqa.** No `: any`, `as any`, or `<any>` in `src/**`; presence of an ESLint rule such as
`@typescript-eslint/no-explicit-any` (error) is a positive signal.

### R-TS-6 · Type component props explicitly; no `React.FC`

**Rule.** Every component declares an explicit props type (interface or type alias) and is
written as a plain function — not typed via `React.FC` / `React.FunctionComponent`.

**Why.** An explicit props type is the component's contract, checked at every call site.
`React.FC` adds an implicit `children` to components that don't take children, weakens
`defaultProps` inference, and complicates generics — the community moved off it. A plain
typed function is clearer and stricter.

```tsx
// ❌ React.FC — implicit children, awkward generics
const Badge: React.FC<{ count: number }> = ({ count }) => <span>{count}</span>;

// ✅ explicit props, plain function
type BadgeProps = { count: number };
function Badge({ count }: BadgeProps) {
  return <span>{count}</span>;
}
```

**vcqa.** No `React.FC` / `React.FunctionComponent` annotations; exported components have a
declared props type (not an inline untyped destructure with implicit `any`).

### R-TS-7 · Typed API boundaries — validate, don't just cast

**Rule.** Every `fetch`/SDK response is given a declared TypeScript type **and** its runtime
shape is validated before use; `await res.json() as SomeType` with no runtime check fails
this rule.

**Why.** `as SomeType` is a lie the compiler believes and the network doesn't honor. A
static SPA's data crosses an untrusted boundary — an external API, a CDN'd JSON file, a
platform SDK — and a shape mismatch there surfaces as a render crash on the user's screen
with no server log. The type is the design; validation is the guard. (Schema mechanics live
in [State & data](state-and-data.md) and [Forms](forms.md) — here the requirement is only
that the boundary is both typed and checked.)

```ts
// ❌ cast — the type is fiction if the API drifts
const user = (await res.json()) as User;

// ✅ typed + validated (schema library detailed on the data page)
const user: User = UserSchema.parse(await res.json());
```

**vcqa.** Response objects flowing from `res.json()` / SDK calls are validated (a schema
`.parse`/`.safeParse` or an explicit type-guard) rather than only `as`-cast; a bare
`as` on a `json()` result is a finding.

### R-TS-8 · `verbatimModuleSyntax` and `import type`

**Rule.** `verbatimModuleSyntax: true` is set, and type-only imports use `import type`
(or inline `import { type X }`).

**Why.** With `verbatimModuleSyntax` the emit follows exactly what you wrote — a value
import stays, a `type` import is erased. This prevents a type-only symbol from being emitted
as a runtime import that pulls a module (and side effects) into the bundle a static app
ships. It also keeps imports unambiguous for the bundler's tree-shaking.

```ts
import { type Route, createBrowserRouter } from 'react-router-dom'; // ✅ inline
import type { User } from './types';                                // ✅ erased at build
```

**vcqa.** `verbatimModuleSyntax: true` in the app tsconfig; type-only imports carry the
`type` modifier (a lint like `@typescript-eslint/consistent-type-imports` is a positive
signal).

### R-TS-9 · No `@ts-ignore`; use `@ts-expect-error` with a reason

**Rule.** Suppressions use `@ts-expect-error` accompanied by a short reason comment; bare
`@ts-ignore` is banned.

**Why.** `@ts-expect-error` fails the build if the error it silences ever goes away, so a
suppression can't rot into a lie — it self-cleans. `@ts-ignore` silences forever and hides
the moment the underlying bug is fixed or a new one appears. The reason text tells the next
reader why the escape hatch was needed.

```ts
// ❌ silent forever
// @ts-ignore
widget.legacyInit();

// ✅ self-expiring, explained
// @ts-expect-error — upstream types missing legacyInit until v3, tracked in #142
widget.legacyInit();
```

**vcqa.** No `@ts-ignore` in `src/**`; any `@ts-expect-error` is followed by explanatory
text (`ts-expect-error` with a description is enforceable via
`@typescript-eslint/ban-ts-comment`).

### R-TS-10 · Path aliases defined in both tsconfig and Vite

**Rule.** Import aliases (e.g. `@/*` → `src/*`) are declared in tsconfig `paths` **and**
mirrored in `vite.config.ts` `resolve.alias`; every alias resolves in both places.

**Why.** TypeScript resolves `paths` for type-checking, but Vite resolves imports for the
actual bundle — they are two separate resolvers. If only tsconfig knows the alias, the type
check passes and the build fails (or worse, ships a broken chunk). Both must agree, or the
static output is wrong even though the editor is green.

```ts
// vite.config.ts
resolve: {
  alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
}
```
```jsonc
// tsconfig.app.json → compilerOptions
{ "baseUrl": ".", "paths": { "@/*": ["src/*"] } }
```

**vcqa.** For each `paths` alias in tsconfig there is a matching `resolve.alias` entry in
the Vite config (and vice-versa); a mismatch is a finding.

## Checklist

- [ ] `strict: true` in the app tsconfig (**R-TS-1**)
- [ ] `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `noImplicitOverride` on (**R-TS-2**)
- [ ] Split `tsconfig.app.json` / `tsconfig.node.json` under a references-only root (**R-TS-3**)
- [ ] `composite: true` + type-check via `tsc -b` (**R-TS-4**)
- [ ] No explicit `any`; `unknown` + narrowing instead (**R-TS-5**)
- [ ] Explicit prop types; no `React.FC` (**R-TS-6**)
- [ ] API responses typed **and** runtime-validated, never bare-cast (**R-TS-7**)
- [ ] `verbatimModuleSyntax: true`; `import type` for type-only imports (**R-TS-8**)
- [ ] No `@ts-ignore`; `@ts-expect-error` with a reason (**R-TS-9**)
- [ ] Path aliases mirrored in tsconfig `paths` and Vite `resolve.alias` (**R-TS-10**)
