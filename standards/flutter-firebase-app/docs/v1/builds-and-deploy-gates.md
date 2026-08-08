# Platform Builds And Deploy Gates

Flutter builds are where this stack's evidence is most often cosmetic: a job named
"mobile build" that compiles nothing, an artifact with no record of which backend it talks
to, and a deploy that depends on a dashboard rather than on the tests.

## R-BUILD-1 - Builds pin the toolchain and record what actually ran

**Severity.** `high`

**Rule.** The Flutter version and channel are pinned in CI, and each build emits evidence
recording the framework, engine, and Dart versions **taken from the toolchain itself** -
not echoed from a workflow input - along with the commit and the environment defines used.

**Why.** "It built" is not evidence. Which backend the artifact talks to is. And a version
number copied from a workflow input records what someone intended to install, which is the
one thing that is never in doubt when a build misbehaves.

**Evidence.**

- Source/config: the pinned `flutter-version` and channel in the workflow.
- CI/artifacts: an uploaded evidence file containing `flutter --version` output, the
  commit, and the resolved `--dart-define` values.
- Exception: `evidence-only` for repos using a managed build service that publishes
  equivalent metadata, naming where that metadata is retained.

**vcqa.** Flag a `flutter-action` step with no explicit `flutter-version`, a channel of
`master`/`main`, and builds that upload no evidence file. Compare the evidence file's
recorded version against the workflow's pin and report a mismatch.

**References.** <https://docs.flutter.dev/deployment/cd>,
<https://docs.flutter.dev/release/upgrade>

## R-BUILD-2 - Platform permissions and purpose strings are captured as evidence

**Severity.** `medium`

**Rule.** Android `uses-permission`, `uses-feature`, and `usesCleartextTraffic`, and iOS
`NS*UsageDescription` and `NSAllowsArbitraryLoads`, are recorded per build so that a new
permission appears as a reviewable diff.

**Why.** Permissions are added by transitive plugin dependencies without any change to
application source. A manifest-merged permission is invisible in a pull request and visible
in a store review, which is the wrong order.

**Evidence.**

- CI/artifacts: the per-build evidence file listing the merged permission set.
- Source/config: `AndroidManifest.xml` and `Info.plist`.
- Exception: `acceptedException` for a platform the product does not ship.

**vcqa.** Diff the recorded permission set against the previous run and report additions;
flag `usesCleartextTraffic="true"` and `NSAllowsArbitraryLoads` outright, and flag a
`NS*UsageDescription` that is an empty or placeholder string.

**References.** <https://developer.android.com/guide/topics/manifest/uses-permission-element>,
<https://developer.apple.com/documentation/bundleresources/information-property-list>

## R-BUILD-3 - Every shipped platform has a build-shape check, and its limits are stated

**Severity.** `medium`

**Rule.** Each platform the product ships has at least a compile-level check in CI, and the
repo states in prose what that check does and does not prove - release signing, code
shrinking, packaging, and store upload in particular.

**Why.** This is the anti-gaming rule of the page. A "mobile build" that only parses a
manifest, or a debug APK compile presented as release readiness, is evidence of the wrong
thing. Stating the limit costs a paragraph and prevents the whole claim from being
misread.

**Evidence.**

- CI/artifacts: the build job and its log, showing an actual compile.
- Docs: an explicit statement of limits in the README or the report.
- Exception: `acceptedException` for a platform built on an external service, naming the
  service and where its logs are retained.

**vcqa.** Classify each platform job as compile versus lint, and flag a lint labelled as a
build. A debug-only compile is a pass with its limits recorded, not a full pass: it
exercises the SDK, the Gradle/AGP toolchain, manifest merging, and plugin registration, and
it proves nothing about release signing, R8, App Bundle packaging, or any iOS build.

**References.** <https://docs.flutter.dev/deployment/android>,
<https://docs.flutter.dev/deployment/ios>

## R-DEPLOY-1 - Production deploys are gated on required, blocking checks

**Severity.** `blocker`

**Rule.** The production deploy job `needs` the app, admin, shared, Functions, and rules
gates; none of those jobs is `continue-on-error`; reporting and dashboard jobs are permitted
only when clearly labelled non-blocking and excluded from the gate set.

**Why.** A green dashboard hiding a red deploy-blocking test is the named anti-pattern for
this stack. It arises honestly: a flaky reporting job is marked `continue-on-error` to stop
the noise, and later a real gate is moved into the same job.

**Evidence.**

- Source/config: the workflow `needs` graph, readable in one file.
- CI/artifacts: a check that asserts the gate set, so adding a job cannot quietly widen it.
- Exception: none for production.

**vcqa.** Walk the `needs` graph transitively; flag `continue-on-error` on any job in the
gate set, deploy jobs with no `needs`, and gates whose `if:` condition can skip them while
still reporting success.

**References.** <https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow>,
<https://docs.github.com/en/actions/using-jobs/using-conditions-to-control-job-execution>

## R-DEPLOY-2 - Rules and indexes are promoted before the code that depends on them

**Severity.** `high`

**Rule.** `firebase deploy --only firestore:rules,firestore:indexes` runs before the
Functions and Hosting deploy steps, unless a documented expand/contract plan requires the
reverse.

**Why.** Deploying a client that issues a new query before its index exists produces
production failures for the window between the two steps. Deploying tightened rules after
the Function that depends on them leaves the old, permissive rules live alongside new
behaviour.

**Evidence.**

- Runtime/deploy: the step order within the deploy job, and the deploy log.
- Exception: `acceptedException` naming the expand/contract plan and the window it covers.

**vcqa.** Compare step ordering within the deploy job; flag a rules deploy that runs after
Hosting, and a deploy that never deploys indexes at all.

**References.** <https://firebase.google.com/docs/cli#deployment>,
<https://firebase.google.com/docs/rules/manage-deploy>

## R-DEPLOY-3 - Deploy triggers are deliberate and credentials are short-lived and least-privilege

**Severity.** `high`

**Rule.** Production deploys run only on manual dispatch, a release tag, or a protected
environment - never on `pull_request`, never on an unprotected branch push. Credentials use
Workload Identity Federation or a scoped service account held in a protected GitHub
Environment, never a long-lived committed token. Workflows declare explicit least-privilege
`permissions:` and pin third-party actions by 40-hex commit SHA.

**Why.** A `pull_request`-triggered deploy is a production deploy anyone with a fork can
request. A `FIREBASE_TOKEN` is a long-lived credential with broad project scope that cannot
be constrained per workflow, and an unpinned third-party action is an upstream tag anyone
can move.

**Evidence.**

- Source/config: the workflow `on:` block, its `permissions:`, the environment protection
  rules, and the action pins.
- Runtime/deploy: the deployment history showing the trigger for each production deploy.
- Exception: `acceptedException` with owner, expiry, and approval trail for a legacy
  `FIREBASE_TOKEN`.

**vcqa.** Flag `pull_request`-triggered deploys, unprotected branch pushes to production,
unpinned actions, and workflows with no `permissions:` block - the default token permissions
are broader than a deploy needs.

**References.**
<https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers>,
<https://docs.github.com/en/actions/reference/security/secure-use>,
<https://firebase.google.com/docs/hosting/github-integration>
