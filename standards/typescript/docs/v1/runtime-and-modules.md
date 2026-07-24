# Runtime and modules

## R-RUNTIME-1 - Compiler runtime settings match the shipped runtime

**Rule.** `lib`, `types`, `module`, `target`, and `moduleResolution` must match the runtime
boundary being shipped: browser, Worker, Pages Function, Node CLI, package, VS Code
extension, Tauri shell, or test environment.

**Why.** TypeScript can allow APIs that do not exist at runtime when Node, DOM, Worker, or
test globals leak into the wrong source slice.

**vcqa.** Flag browser code with Node-only types, Worker code with Node runtime
assumptions, Node packages with DOM-only APIs, or package configs whose module kind
contradicts `package.json`.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>
- TypeScript modules reference:
  <https://www.typescriptlang.org/docs/handbook/modules/reference.html>

## R-MODULE-1 - Module resolution matches the build and package contract

**Rule.** `moduleResolution`, `module`, `type`, `exports`, and import extensions must be
compatible with how the code is built, loaded, and published.

**Why.** A typecheck can pass with a resolver that does not match Node, bundlers, Workers,
or package consumers. The result is a package or deploy that fails after CI.

**vcqa.** Compare TypeScript config with package metadata and build tool config; flag
NodeNext/Bundler/CommonJS mismatches, extension drift, and unsupported dual-module claims.

**References.**

- TypeScript modules reference:
  <https://www.typescriptlang.org/docs/handbook/modules/reference.html>
- npm package metadata:
  <https://docs.npmjs.com/cli/v10/configuring-npm/package-json>

## R-RUNTIME-2 - Test-only globals do not leak into production source

**Rule.** Test runner globals and test-only types must be scoped to test configs or test
files, not available to production source by default.

**Why.** A production source file that compiles only because `vitest`, `jest`, or jsdom
types are globally available is not accurately checked for its runtime.

**vcqa.** Flag production configs whose global `types` include test frameworks without a
separate test config or source/test split.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>
