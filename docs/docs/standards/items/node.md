# Node.js

Node.js is the server-side JavaScript runtime used by CLIs, services, build tools, and package scripts.

## Upstream references

- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
- [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

## What upstream owns

- runtime API behavior
- process, streams, crypto, and filesystem semantics
- package metadata syntax through npm

## What VCQA owns

- runtime and package metadata gates.
- CLI/service process safety.
- Node-specific security checks.

## Detection signals

- `package.json` with `bin` or server dependencies
- `engines.node`
- Node entrypoints such as `src/index.ts` or `bin/*`

## Composed standards

- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [GitHub Action Package](../stacks/github-action-package.md)
- [VS Code Extension Package](../stacks/vscode-extension-package.md)

## Combination-born guidelines

- A CLI standard must define exit-code behavior and noninteractive output; Node docs do not decide that for a product.
- A Node SDK must define export maps and declaration output; runtime docs do not cover package consumer compatibility.
- A GitHub Action built on Node must validate action inputs before invoking runtime code.
