# Firebase

Firebase is the backend platform layer for client-backed apps using Auth, Firestore,
Storage, Messaging, Hosting, Functions, and Security Rules.

## Upstream references

- [Add Firebase to your Flutter app](https://firebase.google.com/docs/flutter/setup)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Security Rules unit tests](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase Hosting GitHub integration](https://firebase.google.com/docs/hosting/github-integration)

## What upstream owns

- Firebase service APIs and SDK setup
- Firebase CLI and emulator behavior
- Firestore rules syntax and simulator behavior
- Hosting preview/live channel mechanics

## What VCQA owns

- Firebase project/environment separation.
- Firestore rules and index test gates.
- client-exposed config versus server secret boundaries.
- Hosting/Functions deploy evidence and rollback path.

## Detection signals

- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`
- Firebase Flutter packages such as `firebase_core`, `firebase_auth`, `cloud_firestore`,
  `firebase_storage`, `firebase_messaging`, or `cloud_functions`
- Cloud Functions package with Firebase runtime or admin dependencies

## Composed standards

- [Flutter Firebase App](../stacks/flutter-firebase-app.md)

## Combination-born guidelines

- Firebase client config is not a secret, but Admin SDK credentials, service accounts,
  signing keys, and deploy credentials are secrets.
- Firestore rules and indexes must be reviewed and tested with the same seriousness as
  application code.
- Hosting deploys should preserve preview/live evidence and make project targeting explicit.
- Cloud Functions own trusted server-side mutation boundaries that Flutter clients must not bypass.
