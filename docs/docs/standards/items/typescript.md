# TypeScript

TypeScript provides the compile-time type layer shared by VCQA browser, Worker, SDK, CLI,
GitHub Action, VS Code, and desktop stacks. This item records how VCQA checks TypeScript as
stack glue; it is not a general TypeScript style guide.

## Upstream references

- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [Strict type checking](https://www.typescriptlang.org/tsconfig/#strict)
- [Module resolution](https://www.typescriptlang.org/tsconfig/#moduleResolution)
- [Declaration emit](https://www.typescriptlang.org/tsconfig/#declaration)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Modules reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)

## What upstream owns

- type system behavior and compiler diagnostics
- compiler option, module resolution, and emit semantics
- declaration generation and project-reference behavior
- JavaScript/TypeScript interop semantics

## VCQA-owned rule surface

- **TS-STRICT:** stack-owned source uses strict checking unless the stack standard records a
  narrow generated-code or migration exception.
- **TS-RUNTIME:** `lib`, `types`, `module`, and `moduleResolution` match the runtime boundary
  being reviewed: browser, Cloudflare Worker, Node CLI, SDK package, GitHub Action, VS Code,
  or Tauri shell.
- **TS-BOUNDARY:** data crossing API, tool, env, storage, or SDK boundaries is not trusted
  merely because it has a TypeScript type; the relevant runtime schema item owns parsing.
- **TS-EXPORT:** SDKs and action packages produce declarations that match the public export
  map and do not expose private implementation paths.
- **TS-EXCEPTION:** `any`, `unknown` narrowing gaps, `@ts-ignore`, and `@ts-expect-error`
  are findings when they appear on owned boundary code without a local reason.

## Detection signals

- `typescript` dependency
- `tsconfig.json`
- `tsconfig.*.json` variants or project references
- `*.ts` or `*.tsx` source files
- `declaration`, `emitDeclarationOnly`, `types`, or package `exports` fields

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

## Combination-born examples

- TypeScript plus Zod creates a runtime boundary rule: external data is parsed before it becomes typed domain data.
- TypeScript plus SDK packaging requires declaration output and export map checks.
- TypeScript plus Workers requires runtime-compatible APIs, not Node-only assumptions.
- TypeScript plus GitHub Actions means action inputs and environment variables are stringly
  supplied and must be narrowed before side effects.
