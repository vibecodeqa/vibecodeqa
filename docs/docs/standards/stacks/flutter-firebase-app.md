# Flutter Firebase App

**Status:** Planned charter

Flutter applications, often with separate user/admin apps and shared Dart packages, backed
by Firebase services and deployed through CI.

This stack was added after reviewing `~/dev/heartfull/platform`, which uses a Melos
workspace with `app`, `admin`, and `shared` Flutter packages plus Firebase Hosting,
Firestore, Auth, Storage, Messaging, App Check, Node 22 Cloud Functions, Firestore rules,
and test/deploy dashboards.

## Full rubric

No full versioned rubric has been authored yet.

## Teaching focus

This standard teaches that a Flutter + Firebase app is not just a client app. The risky
surface is the combination of public client configuration, Firestore rules, shared Dart
models, Functions-owned server mutations, platform builds, and CI deploy gates.

## Scope

- Flutter mobile, web, desktop, or multi-platform apps.
- Flutter workspaces with app/admin/shared packages.
- Firebase-backed apps using Auth, Firestore, Storage, Messaging, Hosting, Functions, or
  App Check.
- Repos using Melos or a similar Dart/Flutter workspace orchestration layer.

## Not in scope

- Generic Flutter widget guidance already owned by Flutter docs.
- Firebase-only backend repos with no Flutter client.
- Native iOS/Android apps without Flutter.
- Flutter apps with a non-Firebase backend; those need a different backend composition.

## Composes

- [Dart](../items/dart.md)
- [Flutter](../items/flutter.md)
- [Firebase](../items/firebase.md)
- [Melos](../items/melos.md)
- [GitHub Actions](../items/github-actions.md)
- [Dependency Hygiene](../items/dependencies.md)
- Optional: [Web Accessibility](../items/web-accessibility.md), [Web Security](../items/web-security.md), [Node](../items/node.md)

## Upstream references

- [Flutter Documentation](https://docs.flutter.dev/)
- [Effective Dart](https://dart.dev/effective-dart)
- [Add Firebase to your Flutter app](https://firebase.google.com/docs/flutter/setup)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Security Rules unit tests](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase Hosting GitHub integration](https://firebase.google.com/docs/hosting/github-integration)
- [Melos Documentation](https://melos.invertase.dev/)

## VCQA-owned rule surface

- Flutter app/admin/shared package workspace shape.
- Firebase project, hosting, functions, and Firestore environment separation.
- Firestore rules, indexes, and emulator-backed test gates.
- mobile/web build artifact and platform permission evidence.
- version bump, deploy gate, and test dashboard evidence.
- client config versus server secret boundary.
- Functions-owned trusted mutation boundaries.
- shared model compatibility across app/admin/function boundaries.

## Detection signals

- `melos.yaml`
- multiple `pubspec.yaml` files
- `firebase.json`, `.firebaserc`, `firestore.rules`, or `firestore.indexes.json`
- Firebase Flutter dependencies such as `firebase_core`, `firebase_auth`, `cloud_firestore`,
  `firebase_storage`, `firebase_messaging`, or `cloud_functions`
- Flutter package folders such as `app/`, `admin/`, and `shared/`
- CI workflows running `flutter test`, `flutter analyze`, Firebase deploys, rules tests,
  or platform builds

## Combination-born guidelines

- Firestore rules and indexes are deployable artifacts and need tests, review, and rollback
  evidence.
- Firebase client configuration can be public, but service accounts, signing credentials,
  Admin SDK credentials, VAPID secrets, and deploy tokens must stay in secret stores.
- Test dashboards are useful evidence, but production deploy workflows must still fail when
  required app, admin, functions, or rules gates fail.
- Shared Dart packages require consumer evidence from every app that imports them.
- Platform builds need explicit evidence for signing, permissions, and environment-specific
  `--dart-define` values.
- Functions should own privileged writes and trust boundaries that Flutter clients cannot
  safely enforce.

## Candidate rules

- **R-WORKSPACE-1: Flutter packages are discoverable and orchestrated.** App, admin, and
  shared packages are declared in a workspace tool and have reproducible bootstrap,
  analyze, and test commands.
- **R-CONFIG-1: Firebase environments are explicit.** Project IDs, hosting targets,
  Functions runtime, app identifiers, and deploy credentials are scoped by environment.
- **R-RULES-1: Firestore rules and indexes are tested.** Rules and indexes have emulator
  tests or documented review evidence before production deploy.
- **R-CLIENT-1: Client config is public by design.** Public Firebase config is separated
  from server secrets, signing credentials, and privileged backend configuration.
- **R-FUNCTIONS-1: Trusted mutations live server-side.** Admin operations and privileged
  writes are performed through Functions or another trusted backend, not directly from a
  Flutter client.
- **R-TEST-1: Deploy gates fail on required tests.** Test-report dashboards may continue
  on error, but deploy workflows depend on passing app/admin/functions/rules gates.
- **R-BUILD-1: Platform artifacts are reproducible.** Web/mobile builds pin Flutter
  channel/version, environment defines, signing inputs, and uploaded artifacts.
- **R-SHARED-1: Shared model changes prove consumers still work.** Changes to shared Dart
  models run app/admin tests or equivalent compatibility checks.

## Anti-patterns

- Treating Firebase client config as secret while leaking real server credentials elsewhere.
- Letting a green dashboard hide a red deploy-blocking test.
- Deploying Firestore rules by hand outside reviewable CI.
- Updating shared Dart models without running app/admin consumer tests.
- Hardcoding production project IDs, bundle IDs, VAPID keys, or backend URLs in source.
- Building mobile artifacts without recording signing, environment, and artifact evidence.

## Benefits

- HeartFull platform (`~/dev/heartfull/platform`) shows this stack in production shape.
- Future `ref-flutter-firebase-app` can be a product-neutral template for this composition.
