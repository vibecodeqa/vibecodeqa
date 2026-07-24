# Dependency Hygiene

Dependency hygiene covers package manager state, lockfiles, install-time behavior,
runtime declarations, audit evidence, and dependency supply-chain review for package-managed
slices.

## Upstream references

- [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/)
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)

## What upstream owns

- package metadata syntax
- package manager install behavior
- registry publishing and provenance features
- ecosystem-specific advisory feeds

## What VCQA owns

- lockfile, package-manager, and runtime consistency checks.
- install script and dependency provenance risk gates.
- audit, license, update, and exception evidence expected in CI.

## Detection signals

- `package.json`
- `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lockb`
- package manager fields such as `packageManager`, `engines`, `scripts`, and `dependencies`
- GitHub Actions or CI workflows that install, audit, build, test, publish, or deploy

## Composed standards

- Dependency Hygiene planned standard
- [React SPA](../stacks/react-spa.md)
- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)
- [GitHub Action Package](../stacks/github-action-package.md)

## Combination-born guidelines

- Static frontends must treat client package code as published browser code, so dependency
  review includes bundle exposure and license posture.
- CLIs and SDKs need package metadata, runtime support, and declaration output aligned
  with the published artifact.
- GitHub Actions and CI workflows must pin install tools and avoid broad install-time
  script execution without an explicit reason.
