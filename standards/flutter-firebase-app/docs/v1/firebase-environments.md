# Firebase Environments And Configuration

Firebase makes the wrong thing easy: one project id, compiled into the app, used by every
developer and every build. These rules make the environment an explicit input at every
point where it could be assumed.

## R-ENV-1 - Local, staging, and production are distinct Firebase projects, selected explicitly

**Severity.** `blocker`

**Rule.** `.firebaserc` - or the equivalent project-selection config - names at least three
aliases resolving to three distinct project ids, and every deploy and emulator command
names the alias or project it targets.

**Why.** One project id baked into source is how a debug build writes production data, and
how a developer's test fixture appears in a customer's account. There is no rules file that
can undo it, because the writes are legitimate.

**Evidence.**

- Source/config: `.firebaserc` with distinct ids per alias.
- CI/deploy: every `firebase` invocation carries `--project`; no command relies on the
  currently-selected default.
- Runtime/deploy: the deploy log line showing which project was targeted.
- Exception: a genuinely single-environment hobby project may drop `staging`, with an
  `acceptedException` recording owner, expiry, and the compensating control.

**vcqa.** Parse `.firebaserc`; flag duplicate project ids across aliases, missing aliases,
and any `firebase deploy` or `firebase emulators` invocation without an explicit
`--project`.

**References.** <https://firebase.google.com/docs/cli#project_aliases>

## R-ENV-2 - The local environment cannot reach a real backend

**Severity.** `high`

**Rule.** The development alias uses a `demo-` project id and/or the app routes to the
emulator suite, and emulator ports are pinned in `firebase.json`.

**Why.** A `demo-` project id is refused by the real Firebase backend, which turns "I
forgot to start the emulator" from a silent production write into an immediate error.
Unpinned emulator ports mean a test suite can connect to whatever is already listening.

**Evidence.**

- Source/config: `firebase.json` `emulators` with an explicit port per service; the
  `useFirestoreEmulator` / `useAuthEmulator` calls and the flag that guards them.
- CI/artifacts: the emulator startup log showing the pinned ports.
- Exception: `acceptedException` where a shared test project replaces the emulator, naming
  the project and the data-isolation control.

**vcqa.** Flag emulator config that relies on default ports, and emulator wiring keyed on
anything other than a build-time constant - a runtime hostname check is not a guard.

**References.** <https://firebase.google.com/docs/emulator-suite/connect_and_prototype>

## R-ENV-3 - Which environment a build targets is a build-time input, not a runtime guess

**Severity.** `high`

**Rule.** Project id, app id, and backend selection come from `--dart-define`, a
`--dart-define-from-file`, or a per-flavor config - never from a hostname sniff, a
`kDebugMode` branch, or a literal typed into a widget.

**Why.** A runtime guess is a guess that ships. A hostname check is wrong on the first
custom domain; a debug-mode branch is wrong the first time someone profiles a release
build.

**Evidence.**

- Source/config: `String.fromEnvironment` reads or the flavor configuration, gathered in
  one file rather than scattered.
- CI/artifacts: the exact `--dart-define` list used per build, and build evidence recording
  the values that were actually applied.
- Exception: `acceptedException` for a genuinely single-environment app, which must still
  keep the values in one config file.

**vcqa.** Grep for hardcoded project ids, bundle ids, and backend URLs outside the
designated config file; flag environment selection derived from `Uri.base.host` or a debug
flag.

**References.** <https://docs.flutter.dev/deployment/flavors>,
<https://firebase.google.com/docs/flutter/setup>

## R-CONFIG-1 - `firebase.json` fully declares the deployable surface

**Severity.** `medium`

**Rule.** Rules, indexes, Cloud Functions source and runtime, and every Hosting target are
declared in `firebase.json`, and the Functions runtime is a currently-supported Node LTS.

**Why.** Anything absent from `firebase.json` is deployed by hand, or not at all. An EOL
Functions runtime is a deploy that will start failing on a date nobody has in a calendar.

**Evidence.**

- Source/config: `firebase.json` naming `firestore.rules`, `firestore.indexes`,
  `functions[].source`, `functions[].runtime`, and `hosting[].target`.
- CI/artifacts: a deploy dry-run or `firebase deploy --only ... --dry-run`-equivalent shape
  check that resolves the same declarations.
- Exception: `acceptedException` where a service is deliberately managed outside this repo,
  naming the repo or console process that owns it.

**vcqa.** Assert the declarations above are present; flag an EOL or unspecified Functions
runtime, and Hosting entries with no target when multiple sites exist.

**References.** <https://firebase.google.com/docs/cli#the_firebasejson_file>,
<https://firebase.google.com/docs/functions/manage-functions>
