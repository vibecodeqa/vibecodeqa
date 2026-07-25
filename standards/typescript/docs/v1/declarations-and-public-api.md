# Declarations and public API

## R-DECL-1 - Published packages ship declarations for public entrypoints

**Rule.** Published TypeScript packages must ship declaration files that match every public
entrypoint exposed through `exports`, `main`, `module`, `types`, `bin`, or documented
subpaths.

**Why.** Consumers rely on declarations as the package contract. Missing or stale types are
runtime compatibility bugs for TypeScript users.

**vcqa.** Compare `package.json` public entrypoints with emitted declaration files and flag
missing, stale, or mismatched declarations.

**References.**

- TypeScript declaration file publishing:
  <https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html>
- npm package metadata:
  <https://docs.npmjs.com/cli/v11/configuring-npm/package-json/>

## R-API-1 - Public types do not expose private implementation paths

**Rule.** Public declarations must not require consumers to import from private source,
build internals, generated cache paths, or app-only modules.

**Why.** Leaking private paths turns implementation detail into an accidental compatibility
promise.

**vcqa.** Flag `.d.ts` files and exported types that reference `src/internal`, `dist`
internals, app paths, generated cache paths, or unexported package subpaths.

**References.**

- TypeScript declaration file publishing:
  <https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html>

## R-DECL-2 - Consumer compatibility is tested

**Rule.** SDKs, libraries, actions, extensions, and public packages must compile at least
one consumer fixture or packed artifact test for their supported TypeScript/module modes.

**Why.** A package can typecheck internally while failing for consumers because exports,
declarations, module mode, or bundled artifacts do not line up.

**vcqa.** Flag published packages with declaration output but no consumer fixture, pack
test, or compatibility check against the package artifact.

**References.**

- TypeScript declaration file publishing:
  <https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html>
