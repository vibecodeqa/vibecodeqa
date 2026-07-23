# VS Code Extension

VS Code extensions add commands, UI, webviews, and language features to the editor.

## Upstream references

- [Extension API](https://code.visualstudio.com/api)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Runtime Security](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)

## What upstream owns

- extension APIs
- marketplace publishing rules
- workspace trust concepts

## What VCQA owns

- activation scope.
- webview/security policy.
- marketplace metadata checks.

## Detection signals

- `package.json` with `engines.vscode`
- VS Code activation events
- extension entrypoint

## Composed standards

- [VS Code Extension Package](../stacks/vscode-extension-package.md)

## Combination-born guidelines

- VS Code extension plus webview requires CSP and a narrow message bridge.
- VS Code extension plus workspace files requires workspace trust behavior.
- VS Code extension plus TypeScript requires extension host tests for activation and commands.
