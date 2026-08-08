# Workspace Shape And Orchestration

A Flutter product of any size stops being one package quickly: a user app, an admin app,
and a shared package holding the models both of them and the server agree on. The risk is
not that the split is wrong; it is that the split silently stops being tested together.

## R-WORKSPACE-1 - The workspace declares its packages and has reproducible bootstrap, analyze, and test commands

**Severity.** `high`

**Rule.** Every Flutter/Dart package in the repo is declared in one workspace manifest -
`melos.yaml`, or a workspace-root `pubspec.yaml` carrying a `melos:` or `workspace:` key -
and a single documented command bootstraps, analyzes, and tests all of them.

**Why.** An undeclared package is a package CI silently stops testing. The failure mode is
not a red build; it is a green one that never ran.

**Evidence.**

- Source/config: `melos.yaml` or the workspace-root `pubspec.yaml`, and the package list it
  resolves to.
- CI/artifacts: a job that runs bootstrap, then analyze, then test.
- Runtime/deploy: the CI log naming every package it visited, so a missing package is
  visible as an absence.
- Exception: `acceptedException` naming the excluded package, why it is excluded, and the
  compensating check that covers it.

**vcqa.** Compare the workspace globs against every discovered `pubspec.yaml` location;
flag any package not covered by a glob, and any workspace whose bootstrap command is
documented only in a contributor's shell history.

**References.** <https://melos.invertase.dev/>, <https://dart.dev/tools/pub/workspaces>

## R-WORKSPACE-2 - Static analysis is workspace-wide and fatal

**Severity.** `medium`

**Rule.** `flutter analyze` or `dart analyze` runs across every package with warnings and
infos fatal, alongside a formatting check.

**Why.** Dart's analyzer is the closest thing this stack has to a type gate, and a
non-fatal analyzer is a linter nobody reads. Per-package analysis that stops at the first
package leaves the rest unanalyzed.

**Evidence.**

- Source/config: an `analysis_options.yaml` per package, or one inherited from the
  workspace root.
- CI/artifacts: `melos run analyze` or equivalent, invoked with `--fatal-infos` or
  `--fatal-warnings`, and a `dart format --set-exit-if-changed` gate.
- Exception: a per-line `// ignore:` carrying a reason, or an `acceptedException` for a
  generated-source boundary that names the generator.

**vcqa.** Check for `--fatal-infos`/`--fatal-warnings` and a format gate; flag analyze
steps that run in only one package directory while the workspace declares several.

**References.** <https://dart.dev/tools/analysis>,
<https://docs.flutter.dev/reference/flutter-cli>

## R-SHARED-1 - Shared-package changes prove every consumer still works

**Severity.** `high`

**Rule.** A change to a shared Dart package runs the tests of every package that depends on
it, in the same CI run.

**Why.** A shared model is a wire contract between two independently released clients and a
server. Testing the shared package alone proves the model is self-consistent, which was
never the question.

**Evidence.**

- Source/config: the dependency edges in each consumer's `pubspec.yaml`.
- CI/artifacts: a job that runs the app and admin test suites, not only the shared
  package's own suite, on a shared-package change.
- Exception: `acceptedException` where a consumer is genuinely decoupled by a versioned
  release boundary, naming the version-compatibility check that replaces the consumer run.

**vcqa.** Read workflow `paths:` filters and flag any that can skip consumer tests when
only `shared/**` changed - a path filter is the usual way this rule is broken without
anyone deciding to break it.

**References.** <https://dart.dev/tools/pub/dependencies>

## R-SHARED-2 - The client/server field contract is declared once and drift is detected

**Severity.** `high`

**Rule.** The set of fields a client may write, and the set only the server may write, is
declared in the shared package, mirrored in `firestore.rules` and in the Cloud Functions
source, and a test fails when the copies diverge.

**Why.** This one contract is enforced in three runtimes that cannot import each other: a
Dart client, a rules file, and a TypeScript server. Three hand-maintained copies of a
security-relevant list will drift, and the drift will be discovered in production.

**Evidence.**

- Source/config: all three declarations, each pointing at the others.
- CI/artifacts: a test that reads `firestore.rules` as text from Dart or TypeScript and
  asserts the field set matches; its failing output must name the diverging field.
- Exception: `acceptedException` where a single generator emits all three from one source
  of truth, naming the generator and the check that the generated files are current.

**vcqa.** Look for a test that opens `firestore.rules` from outside the rules suite; a repo
with a server-owned field list and no such test fails this rule even if the three copies
currently agree.

**References.** <https://firebase.google.com/docs/firestore/security/rules-structure>
