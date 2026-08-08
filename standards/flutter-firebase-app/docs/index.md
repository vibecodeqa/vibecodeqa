# Flutter Firebase App - Gold Standard

This is the reference standard for one deployable stack shape: a Dart/Flutter workspace -
typically a user app, an admin app, and a shared package - backed by Firebase and promoted
through CI.

Canonical version URL:
<https://vibecodeqa.online/standards/flutter-firebase-app/v1/>

It exists because none of the upstream sources own the combined repo-level boundary.
Flutter documents the client. Firebase documents Auth, Firestore, rules, and Functions.
Melos and pub document workspaces. GitHub documents workflow security. VCQA owns the rules
that appear when public client configuration, security rules, shared Dart models,
Functions-owned server mutations, platform builds, and production deploys all live in one
repo.

The single idea this standard is built around: **in a Firebase app the client is not a
trust boundary.** Every rule below is a consequence of deciding where the boundary actually
is - the rules file, the custom claim, and the Cloud Function - and then proving it holds.

## When this standard applies

A repo or slice is `flutter-firebase-app` when all of these hold:

- one or more Flutter/Dart packages are declared by a `pubspec.yaml`
- Firebase is configured for the repo through `firebase.json`, `.firebaserc`, or
  `firebase_options.dart`
- application code reaches Firebase services through the FlutterFire packages
  (`firebase_core`, `firebase_auth`, `cloud_firestore`, `firebase_storage`,
  `firebase_messaging`, `cloud_functions`) or the Admin SDK on the server side
- the Dart packages are orchestrated as one workspace, whether by a `melos.yaml` or by a
  workspace-root `pubspec.yaml`

Add the `testing`, `security`, and `dependencies` cross-cutting standards, which this
standard assumes rather than restates. Use a different backend composition when the Flutter
client talks to something other than Firebase; use a plain Flutter package standard when
there is no backend at all.

!!! warning "Detection is narrower than this standard"

    The registry `detect` predicate currently requires a literal `melos.yaml`. Melos 7
    removed that file in favour of a `melos:` key inside the workspace-root `pubspec.yaml`,
    so a Melos 7+ workspace matches this standard's prose but is **not** auto-detected. A
    file glob cannot see inside a file, so this needs a new content signal rather than a
    wider glob: [#48](https://github.com/vibecodeqa/vibecodeqa/issues/48). Judge such a repo
    against this standard by naming the edition explicitly.

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| [v1](v1/index.md) | Flutter 3.x + Dart 3.x + Firebase + Melos + Node 22 Cloud Functions + GitHub Actions | 2026-08 | 2027-08 | latest |

## What this standard owns

- workspace declaration, bootstrap, analyze, and test orchestration across packages
- shared-package consumer compatibility and client/server field contracts
- Firebase environment separation, emulator wiring, and build-time environment selection
- the boundary between public client config and server credentials, in source and in the
  built artifact
- Firestore rules and composite indexes as versioned, tested, deployable artifacts
- Cloud Functions as the owner of privileged writes, and the claim checks that protect them
- Flutter build evidence: pinned toolchain, platform permissions, and honest statements of
  what a build-shape check does not prove
- production deploy gating, promotion order, and deploy credential shape

## Primary references

- Flutter documentation: <https://docs.flutter.dev/>
- Add Firebase to your Flutter app: <https://firebase.google.com/docs/flutter/setup>
- Firebase CLI and project aliases: <https://firebase.google.com/docs/cli>
- Cloud Firestore Security Rules: <https://firebase.google.com/docs/firestore/security/get-started>
- Firebase Security Rules unit tests: <https://firebase.google.com/docs/rules/unit-tests>
- Firestore index overview: <https://firebase.google.com/docs/firestore/query-data/index-overview>
- Cloud Functions for Firebase: <https://firebase.google.com/docs/functions>
- Firebase custom claims: <https://firebase.google.com/docs/auth/admin/custom-claims>
- Firebase API keys are public: <https://firebase.google.com/docs/projects/api-keys>
- Melos: <https://melos.invertase.dev/>
- Dart pub workspaces: <https://dart.dev/tools/pub/workspaces>
- OWASP Secrets Management Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
