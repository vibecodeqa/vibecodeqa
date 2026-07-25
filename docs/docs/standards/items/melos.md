# Melos

Melos is a Dart and Flutter workspace tool for repositories with multiple packages.

## Upstream references

- [Melos Documentation](https://melos.invertase.dev/)

## What upstream owns

- package discovery
- bootstrap behavior
- workspace command orchestration

## What VCQA owns

- workspace package discovery and bootstrap reproducibility.
- cross-package analyze/test orchestration.
- shared package dependency drift checks.

## Detection signals

- `melos.yaml`
- multiple `pubspec.yaml` files
- `melos bootstrap`, `melos exec`, `melos run analyze`, or `melos run test`
- shared packages consumed by app packages via `path:`

## Composed standards

- [Flutter Firebase App](../stacks/flutter-firebase-app.md)

## Combination-born guidelines

- App, admin, and shared packages should be analyzed and tested through one workspace command.
- Shared package changes require consumer tests or compatibility evidence.
- Bootstrap and lockfile behavior must be reproducible in CI, not only on one developer machine.
