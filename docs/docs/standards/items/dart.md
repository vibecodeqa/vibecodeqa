# Dart

Dart is the language runtime and package ecosystem behind Flutter apps and shared packages.

## Upstream references

- [Effective Dart](https://dart.dev/effective-dart)

## What upstream owns

- Dart language behavior
- package layout and analyzer behavior
- style, usage, and API design guidance

## What VCQA owns

- Dart SDK constraints and analyzer gates by package.
- generated/localized code exception boundaries.
- shared model compatibility across app packages.

## Detection signals

- `pubspec.yaml`
- `analysis_options.yaml`
- Dart source under `lib/`, `test/`, or `integration_test/`
- `flutter test`, `dart test`, or `dart analyze` in scripts or CI

## Composed standards

- [Flutter Firebase App](../stacks/flutter-firebase-app.md)

## Combination-born guidelines

- Dart SDK constraints must match the Flutter channel and CI runtime.
- Shared packages must not silently drift from app/admin consumers.
- Generated Dart files need a clear policy for analyzer/lint exceptions.
