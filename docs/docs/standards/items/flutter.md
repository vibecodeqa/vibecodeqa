# Flutter

Flutter is the UI framework and platform build layer for mobile, web, and desktop apps.

## Upstream references

- [Flutter Documentation](https://docs.flutter.dev/)
- [Add Firebase to your Flutter app](https://firebase.google.com/docs/flutter/setup)

## What upstream owns

- widget framework behavior
- platform build commands
- Flutter testing APIs
- platform plugin integration

## What VCQA owns

- Flutter package/app structure across platform targets.
- widget/integration test evidence for user flows.
- platform permission and build artifact checks.

## Detection signals

- `flutter:` section in `pubspec.yaml`
- Flutter SDK dependencies
- `lib/main.dart`
- `test/` and `integration_test/`
- platform folders such as `android/`, `ios/`, `web/`, `macos/`, `windows/`, or `linux/`

## Composed standards

- [Flutter Firebase App](../stacks/flutter-firebase-app.md)

## Combination-born guidelines

- Flutter web, mobile, and desktop builds have different deploy and permission evidence.
- Widget tests prove component behavior; integration tests prove navigation, auth, and provider seams.
- Client config compiled into a Flutter app is public unless it is resolved server-side.
