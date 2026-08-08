# flutter-firebase-app

The **gold-standard reference** for the `flutter-firebase-app` archetype: a Dart/Flutter
workspace with separate user and admin apps over a shared package, backed by Firebase
Auth, Firestore, Storage, Messaging, Hosting, App Check, and Cloud Functions, promoted
through CI deploy gates.

Published by VibeCode QA at:

<https://vibecodeqa.online/standards/flutter-firebase-app/v1/>

## What this is

This repo is a rubric, not a tutorial. VibeCode QA detects a repo's stack shape, loads the
matching standard, and scores the code against stable rule IDs.

This standard composes:

- Dart and Flutter packages orchestrated as one workspace
- Firebase project, environment, and emulator configuration
- Firestore security rules and composite indexes as deployable, tested artifacts
- Cloud Functions as the trusted boundary for privileged writes
- platform build evidence for web and mobile
- CI/CD deploy gates

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| `v1` | Flutter 3.x + Dart 3.x + Firebase + Melos + Node 22 Cloud Functions + GitHub Actions | 2026-08 | 2027-08 | latest |

## Structure

```
docs/
├─ index.md
└─ v1/
   ├─ index.md
   ├─ workspace-and-packages.md
   ├─ firebase-environments.md
   ├─ client-config-and-secrets.md
   ├─ firestore-rules-and-indexes.md
   ├─ trusted-server-boundaries.md
   └─ builds-and-deploy-gates.md
```

## Reference implementation

<https://github.com/vibecodeqa/ref-flutter-firebase-app> demonstrates this edition. Its
score is self-reported and its known limits are recorded on the catalog page.

## Publishing

Content is Markdown in `docs/`; Zensical builds the static site. Registry and central docs
navigation are owned outside this standard tree.
