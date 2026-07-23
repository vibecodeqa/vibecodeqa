# Tauri

Tauri packages a web frontend with a native desktop shell and privileged backend commands.

## Upstream references

- [Tauri Documentation](https://v2.tauri.app/)

## What upstream owns

- Tauri config and build behavior
- capabilities and command APIs
- plugin mechanics

## What VCQA owns

- command/capability boundaries.
- secret storage expectations.
- desktop build/signing checks.

## Detection signals

- `src-tauri/`
- `tauri.conf.json` or `tauri.conf.json5`
- Rust commands exposed to frontend

## Composed standards

- [Tauri React Desktop](../stacks/tauri-react-desktop.md)

## Combination-born guidelines

- Tauri plus React requires privileged filesystem access behind commands/capabilities.
- Tauri plus secrets requires OS keychain or secure storage, not browser local storage.
- Tauri plus TypeScript needs typed frontend/backend command contracts.
