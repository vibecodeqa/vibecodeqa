# CI and evidence

## R-CI-1 - Typecheck runs before deploy, release, or publish

**Rule.** Any workflow that deploys, releases, publishes, migrates, or mutates production
must run the relevant TypeScript typecheck first or depend on a completed required
typecheck workflow.

**Why.** Type errors discovered after deploy are production incidents. The typecheck is a
release gate, not a report.

**vcqa.** Flag deploy/publish/release workflows that build TypeScript projects without
`tsc --noEmit`, `tsc -b`, framework typecheck, declaration emit check, or an equivalent
gate.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-CI-2 - Typecheck command is discoverable

**Rule.** The repo must expose a local command for typechecking each typed slice, and CI
must use the same or stricter command.

**Why.** Hidden or CI-only typechecks make failures hard to reproduce and encourage
workarounds.

**vcqa.** Flag TypeScript repos with no `typecheck` script, no build-mode command, and no
workflow step that clearly runs compiler diagnostics.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-EVIDENCE-1 - Declaration and generated-type drift is visible

**Rule.** CI must expose drift when generated types, declaration files, public API types, or
runtime schemas change.

**Why.** Typed contracts rot when generation and declaration checks are invisible. Drift
should fail builds or leave reviewable evidence.

**vcqa.** Flag generated/declaration workflows that never compare output, never run
consumer compile checks, or never surface changed public types in PRs.

**References.**

- TypeScript declaration file publishing:
  <https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html>
