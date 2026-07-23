# Tauri React Desktop

**Status:** Planned charter

Tauri desktop applications with a React/TypeScript frontend and privileged native commands.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

Tauri desktop applications with a React/TypeScript frontend and privileged native commands.

## Not in scope

- Electron apps
- pure browser React SPAs
- Rust CLIs without a web frontend

## Composes

- [Tauri](../items/tauri.md)
- [React](../items/react.md)
- [TypeScript](../items/typescript.md)
- [Web Security](../items/web-security.md)
- [Docs KB](../items/docs-kb.md)

## VCQA-owned rule surface

- Tauri command/capability boundaries.
- keychain/secret storage.
- file-system watch safety.
- desktop packaging and signing.
- frontend/backend contract typing.

## Detection signals

- `src-tauri/`
- React frontend dependencies
- Tauri config and command handlers

## Combination-born guidelines

- Filesystem and shell access must be behind Tauri capabilities and commands.
- Secrets belong in OS-backed storage, not browser local storage.
- Frontend/backend command contracts need typed request and response shapes.

## Benefits

- vibecodeqa/app desktop monitor.
