# TypeScript

TypeScript provides static type checking for JavaScript projects.

## Upstream references

- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## What upstream owns

- type system behavior
- compiler flags
- module resolution semantics

## What VCQA owns

- strictness enforcement by stack.
- exception policy for generated files.
- typed boundary checks.

## Detection signals

- `typescript` dependency
- `tsconfig.json`
- `*.ts` or `*.tsx` source files

## Composed standards

- [React SPA](../stacks/react-spa.md)
- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Cloudflare D1 App](../stacks/cloudflare-d1-app.md)
- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)
- [GitHub Action Package](../stacks/github-action-package.md)
- [VS Code Extension Package](../stacks/vscode-extension-package.md)
- [Tauri React Desktop](../stacks/tauri-react-desktop.md)

## Combination-born guidelines

- TypeScript plus Zod creates a runtime boundary rule: external data is parsed before it becomes typed domain data.
- TypeScript plus SDK packaging requires declaration output and export map checks.
- TypeScript plus Workers requires runtime-compatible APIs, not Node-only assumptions.
