# VS Code Extension Package

**Status:** Planned charter

VS Code extensions with commands, activation events, webviews, or workspace integrations.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

VS Code extensions with commands, activation events, webviews, or workspace integrations.

## Not in scope

- generic Node libraries
- browser-only apps
- editor configs with no extension host code

## Composes

- [VS Code Extension](../items/vscode-extension.md)
- [TypeScript](../items/typescript.md)
- [Node.js](../items/node.md)
- [Web Security](../items/web-security.md)

## VCQA-owned rule surface

- activation event scope.
- workspace trust behavior.
- command and webview boundaries.
- marketplace metadata.
- extension test coverage.

## Detection signals

- `engines.vscode`
- activation events
- extension entrypoint
- webview usage

## Combination-born guidelines

- Activation events should be narrow enough to avoid needless startup cost.
- Webviews require CSP and constrained message handling.
- Workspace trust controls privileged file or command behavior.

## Benefits

- vibecodeqa/vscode.
