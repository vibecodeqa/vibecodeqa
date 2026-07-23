# Cloudflare Worker MCP Server - Gold Standard

This is the reference standard for one deployable stack shape: a remote Model Context
Protocol server hosted on Cloudflare Workers.

It exists because none of the upstream sources own the combined seam. MCP defines the
protocol, authorization model, and tool contracts. Cloudflare defines the Worker runtime,
Agents helpers, bindings, Durable Objects, and deployment mechanics. Zod defines runtime
validation. VCQA owns the repo-level rules that appear when these are combined into a
public or organization-facing remote tool server.

## When this standard applies

A repo or slice is `cloudflare-worker-mcp-server` when all of these hold:

- a Cloudflare Worker exposes a remote MCP endpoint, commonly `/mcp`
- MCP tools, resources, prompts, or transports are implemented with `@modelcontextprotocol/sdk`,
  Cloudflare Agents MCP helpers, or equivalent protocol code
- the endpoint is intended for remote HTTP clients, not only local stdio
- TypeScript source and Worker bindings are part of the deployment boundary

If the repo is a local-only stdio MCP server, use an MCP or Node tool standard. If the
repo is a generic Worker API with no MCP surface, use a Worker API standard. If Pages
Functions and a static frontend are co-deployed, use
[Cloudflare Pages Fullstack](/standards/cloudflare-pages-fullstack/v1/).

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| [v1](v1/index.md) | Cloudflare Workers + remote MCP + TypeScript + Zod | 2026-07 | 2027-07 | latest |

## What this standard owns

- remote MCP endpoint shape on Workers
- OAuth and protected resource metadata expectations
- tool-level permission boundaries and scope mapping
- Zod-backed input and structured output validation
- Durable Object, KV, R2, and D1 storage boundaries for tools
- auditability for mutating tool calls
- treatment of tool output and fetched content as untrusted model input
- deploy gates for protocol, authorization, type, and preview checks

