# Flutter Firebase App - Edition v1

!!! info "Edition metadata"
    **Targets:** Flutter 3.x · Dart 3.x · Firebase · Melos · Node 22 Cloud Functions · GitHub Actions
    **Reviewed:** 2026-08 · **Next review due:** 2027-08
    **Status:** latest · **Pin as:** `flutter-firebase-app@v1`
    **Canonical URL:** <https://vibecodeqa.online/standards/flutter-firebase-app/v1/>

This edition captures the gold standard for a Firebase-backed Flutter workspace. It focuses
on the seam between a workspace of independently buildable Dart packages, Firebase
environment configuration, the public/secret boundary, Firestore's declarative
authorization model, the server code that owns what clients may not do, platform builds,
and production deploy gates.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
the evidence that settles it, a `vcqa` signal, and primary references. The full contract is
[Rule Contract](https://vibecodeqa.online/docs/standards/rule-contract/).

## The rubric

30 rules across six pages.

| # | Area | Code | Rules | What it governs |
| --- | --- | --- | --- | --- |
| 1 | [Workspace shape and orchestration](workspace-and-packages.md) | `WORKSPACE` / `SHARED` | 4 | package declaration, workspace-wide analyze, consumer proof, client/server field contract |
| 2 | [Firebase environments and configuration](firebase-environments.md) | `ENV` / `CONFIG` | 4 | project aliases, emulator isolation, build-time environment selection, `firebase.json` completeness |
| 3 | [Client config versus server secrets](client-config-and-secrets.md) | `CLIENT` / `SECRET` | 4 | public config documented as public, no committed credentials, bundle scanning, Functions secrets |
| 4 | [Firestore rules and indexes](firestore-rules-and-indexes.md) | `RULES` / `INDEX` | 6 | rules as artifact, emulator tests with denials, default-deny and shape validation, claims, index parity |
| 5 | [Trusted server boundaries](trusted-server-boundaries.md) | `FUNCTIONS` / `CLAIM` | 6 | server-owned mutations, input validation, patch scope, server-side claim checks, Functions CI |
| 6 | [Platform builds and deploy gates](builds-and-deploy-gates.md) | `BUILD` / `DEPLOY` | 6 | toolchain pinning, permission evidence, honest build-shape checks, deploy gating, promotion order, credentials |

## Non-negotiables

The eight `blocker` rules. Failing any of them means the repo is not implementing this
stack shape, whatever the rest of the score says.

- **R-ENV-1** - local, staging, and production are distinct Firebase projects, selected
  explicitly.
- **R-SECRET-1** - no server credential or signing material is committed.
- **R-RULES-1** - Firestore rules are a versioned, reviewed, deployable artifact.
- **R-RULES-2** - rules are unit-tested against the emulator, and the tests include
  denials.
- **R-RULES-4** - elevation is a server-verified claim, never a client-held key.
- **R-FUNCTIONS-1** - privileged mutations are performed by the server, not by any client.
- **R-CLAIM-1** - every privileged handler re-verifies the claim server-side.
- **R-DEPLOY-1** - production deploys are gated on required, blocking checks.

## Severity and evidence defaults

| Rule group | Default severity | Required evidence |
|---|---|---|
| Trust-boundary rules (`RULES`, `FUNCTIONS`, `CLAIM`) | `blocker` when a client can perform a write the server is supposed to own, or when the authorization model is untested; otherwise `high` | `firestore.rules`, the handler's guard, an emulator-backed rules suite containing denial assertions, and unit tests for unauthenticated / no-claim / truthy-not-`true` callers. |
| Secret-boundary rules (`SECRET`, `CLIENT`) | `blocker` for a live committed server credential; `high` for an unscanned build artifact; `low` for undocumented-but-correct public config | A scan over **git-tracked** files and over the built bundle, plus its passing output. A `.gitignore` entry is not evidence. |
| Environment and configuration rules (`ENV`, `CONFIG`) | `blocker` when one project id serves every environment; otherwise `high` or `medium` | `.firebaserc`, `firebase.json`, the `--dart-define`/flavor list per build, and build evidence recording the values actually used. |
| Workspace, shared-package, and index rules (`WORKSPACE`, `SHARED`, `INDEX`) | `high` when a consumer or a query can break undetected; otherwise `medium` or `low` | Workspace manifest, the CI job listing every package by name, a drift test that reads the other runtimes' declarations, and a declared-query-to-index check. |
| Build and deploy rules (`BUILD`, `DEPLOY`) | `blocker` for an ungated production deploy; `high` for unpinned toolchains or long-lived deploy credentials; `medium` for build-shape and permission evidence | Workflow `on:`/`permissions:`/`needs:` graph, pinned Flutter version, an uploaded build-evidence artifact, and a prose statement of what the build check does not prove. |

Accepted exceptions use the shared `acceptedException` template: owner, scope,
environment/tenant, reason, compensating controls, evidence, expiry/review date, and
approval trail.

```yaml
acceptedException:
  owner: "platform-team"
  scope: "packages/admin"
  environmentOrTenant: "staging"
  reason: "<why the rule cannot be met now>"
  compensatingControls:
    - "<control that reduces the risk while the exception exists>"
  evidence:
    - "<link/path to issue, CI run, test, runbook, or approval record>"
  expiryOrReviewDate: "2027-08-01"
  approvalTrail:
    - "<approver, issue, ADR, change request, or security review>"
```

Three rules accept **no** exception: **R-SECRET-1** for a live credential,
**R-FUNCTIONS-1**, and **R-DEPLOY-1** for production. A repo where the client can perform
the write the Function exists to own is not implementing this control with an exception; it
is not implementing it.

## Evidence has to be reproducible by someone without your laptop

An evidence claim that only its author can re-run is a claim, not evidence. This is not
hypothetical for this stack: a Dart/Flutter repo scanned **without a Flutter SDK and
without `flutter pub get` having been run** reports very differently from the same tree
with its dependencies resolved, because the analyzer cannot resolve imports. The reference
implementation for this edition scores 93/100 in its own tracked report and 78/100 when
scanned in a bare environment - the same commit, the same code, a different toolchain.

Consequences for anything citing this edition:

- Build and analyze evidence must record the toolchain versions taken **from the toolchain
  itself** (R-BUILD-1), not from a workflow input, so a reader can tell which environment
  produced the number.
- A score quoted without the toolchain that produced it is unverifiable and should be
  labelled self-reported until someone else reproduces it.

<!-- BEGIN GENERATED:related-standards -->
<!-- END GENERATED:related-standards -->

## Reference baseline

- Firebase project aliases: <https://firebase.google.com/docs/cli#project_aliases>
- Firebase Local Emulator Suite: <https://firebase.google.com/docs/emulator-suite/connect_and_prototype>
- Firestore security rules: <https://firebase.google.com/docs/firestore/security/get-started>
- Firestore rules unit testing: <https://firebase.google.com/docs/rules/unit-tests>
- Firestore index overview: <https://firebase.google.com/docs/firestore/query-data/index-overview>
- Firebase custom claims: <https://firebase.google.com/docs/auth/admin/custom-claims>
- Cloud Functions callable reference: <https://firebase.google.com/docs/functions/callable>
- Cloud Functions environment and secrets: <https://firebase.google.com/docs/functions/config-env>
- Firebase API keys: <https://firebase.google.com/docs/projects/api-keys>
- Flutter continuous delivery: <https://docs.flutter.dev/deployment/cd>
- Dart pub workspaces: <https://dart.dev/tools/pub/workspaces>
