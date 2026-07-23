# TypeScript SDK

**Status:** Planned charter

TypeScript packages consumed as SDKs or client libraries by other projects.

## Full rubric

No full versioned rubric has been authored yet.

## Teaching focus

This standard teaches that an SDK is a compatibility promise, not just a compiled TypeScript
package. Choosing this stack means maintaining a small public surface, shipping declarations that
match runtime behavior, keeping generated API clients fresh, and giving consumers typed failure
modes they can handle without reading implementation code.

## Scope

TypeScript packages consumed as SDKs or client libraries by other projects.

## Not in scope

- apps with no exported API
- private implementation packages
- untyped JavaScript packages
- CLIs where the command-line interface is the primary product contract

## Composes

- [TypeScript](../items/typescript.md)
- [Node.js](../items/node.md)
- [OpenAPI](../items/openapi.md)
- [Zod](../items/zod.md)
- [Vitest](../items/vitest.md)
- [Web Security](../items/web-security.md)

## Upstream references

- [TypeScript declaration file publishing](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [TypeScript TSConfig reference](https://www.typescriptlang.org/tsconfig/)
- [TypeScript module resolution reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [TypeScript 4.7 Node ESM/CJS release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html)
- [Node.js package entry points and exports](https://nodejs.org/api/packages.html)
- [npm package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/)
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [OpenAPI Specification 3.1](https://spec.openapis.org/oas/v3.1.0.html)
- [JSON Schema specification](https://json-schema.org/specification)
- [Semantic Versioning 2.0.0](https://semver.org/)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## VCQA-owned rule surface

- export map and public entrypoint quality.
- declaration output and declaration/runtime alignment.
- ESM/CJS and runtime support decisions.
- API contract freshness.
- generated client drift detection.
- typed error model.
- runtime validation at external boundaries.
- semantic versioning and compatibility tests.
- credential boundary and redaction policy.
- publish artifact and provenance policy.

## Detection signals

- `package.json` `exports`, `main`, `types`, `typesVersions`, or `files`
- `declaration`, `emitDeclarationOnly`, or `declarationMap` in `tsconfig.json`
- `dist/*.d.ts`, `*.d.mts`, or `*.d.cts` artifacts
- OpenAPI, JSON Schema, or generator config files
- generated client directories or checked-in API schemas
- public `Client`, `Error`, `Config`, `Credentials`, or `TokenProvider` types
- consumer fixture tests, package tarball tests, or matrix tests across TypeScript/module-resolution
  modes

## Combination-born guidelines

- Export maps and declarations are compatibility gates, not packaging polish.
- Generated API clients must track the checked-in OpenAPI contract.
- Runtime errors need a typed model consumers can handle without string matching.
- TypeScript types describe the SDK API, but OpenAPI/JSON Schema/Zod-style validation must still
  guard untrusted API responses and user-provided config.
- ESM/CJS support is a product decision; each advertised condition or entrypoint must have matching
  JavaScript and declaration files.
- Credential helpers may make local development easier, but SDKs must not own application secrets or
  silently read unrelated ambient credentials.
- SemVer applies to runtime behavior, exported types, module entrypoints, error shapes, and
  documented side effects.

## Candidate rules

- **R-SDK-1: Public entrypoints are intentional.** `package.json` exposes only supported API
  entrypoints through `exports` or equivalent metadata, and deep imports into build internals are
  treated as unsupported.
- **R-SDK-2: Declarations are shipped and checked.** Published packages include declaration files
  for every public entrypoint, and CI verifies declarations by compiling consumer fixtures against
  the packed artifact.
- **R-SDK-3: Runtime and declaration modules agree.** ESM-only, CJS-only, or dual-package support is
  documented; conditional exports, `type`, JavaScript extensions, and `.d.ts`/`.d.mts`/`.d.cts`
  files match Node and TypeScript resolution rules.
- **R-SDK-4: Supported runtimes are explicit.** Node, browser, worker, edge, or bundler support is
  named in docs and package metadata, with tests proving that unsupported runtime APIs are not
  pulled into supported entrypoints.
- **R-SDK-5: API contracts stay fresh.** SDK request and response types derived from OpenAPI or JSON
  Schema are regenerated or checked in CI whenever the source contract changes.
- **R-SDK-6: Generated client drift fails builds.** Generated files are reproducible from checked-in
  config, generator versions are pinned, and CI fails when generated output differs from the
  committed API contract.
- **R-SDK-7: External data is validated at runtime.** Unknown API responses, webhook payloads,
  config files, and user-provided JSON are parsed before being exposed as trusted domain types.
- **R-SDK-8: Errors are typed.** Consumers can branch on stable fields such as `name`, `code`,
  `status`, `retryable`, `details`, and `cause`; they do not need to parse human-readable messages.
- **R-SDK-9: Credentials stay at the edge.** SDKs accept credentials, token providers, or
  request-signing callbacks from the host application and redact them in logs/errors; they do not persist
  raw secrets or search broad ambient locations by default.
- **R-SDK-10: Compatibility is tested as a consumer would use it.** CI packs or links the SDK into
  fixture projects and tests import/require paths, tree-shakable subpaths, declarations, and
  representative runtime calls across supported TypeScript and Node versions.
- **R-SDK-11: SemVer covers types.** Removing exports, narrowing accepted input, changing error
  codes, changing default side effects, or breaking declaration compatibility is a breaking change
  even when JavaScript still runs.
- **R-SDK-12: Publish artifacts are minimal and reproducible.** `files`, build output, source maps,
  declarations, provenance, and release scripts are controlled so consumers receive intended
  artifacts and no local secrets, fixtures, or generator caches.

## Anti-patterns

- Publishing `dist` JavaScript without matching declarations.
- Allowing consumers to import undocumented `dist/internal/*` paths.
- Shipping `exports` for JavaScript but relying on a single stale top-level `types` file.
- Claiming both ESM and CJS support without testing `import` and `require` consumers against the
  published package.
- Treating generated clients as hand-maintained files with no reproducible generator command.
- Representing every failure as `Error` with only a message string.
- Trusting API responses because the TypeScript type says they should be valid.
- Loading production tokens from `.env`, global config, or cloud metadata automatically in a
  reusable SDK.
- Making patch releases that remove fields, change error codes, or alter default retries/timeouts in
  observable ways.

## Benefits

- Cloudflare SaaS example SDK.
- future VCQA schema/client packages.
