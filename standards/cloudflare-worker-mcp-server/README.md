# cloudflare-worker-mcp-server

The **gold-standard reference** for the `cloudflare-worker-mcp-server` archetype:
remote Model Context Protocol servers deployed on Cloudflare Workers, optionally using
Durable Objects, KV, R2, D1, or upstream APIs behind tool calls.

Published by VibeCode QA at:

<https://vibecodeqa.online/standards/cloudflare-worker-mcp-server/v2/>

## What this is

This repo is a rubric, not a tutorial. VibeCode QA detects a repo's stack shape, loads the
matching standard, and scores the code against stable rule IDs.

This standard composes:

- Cloudflare Workers request handling, bindings, environments, and deployments
- Cloudflare Agents remote MCP helpers where used
- Model Context Protocol tools, Streamable HTTP transport, and authorization
- TypeScript and Zod runtime validation
- Durable Objects storage and coordination boundaries
- web and LLM application security guidance

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| `v2` | Cloudflare Workers + stateless MCP 2026-07-28 + TypeScript + Zod | 2026-08 | 2027-08 | latest |
| `v1` | Cloudflare Workers + remote MCP 2025-11-25 + TypeScript + Zod | 2026-07 | 2027-07 | retired; superseded by v2 |

`cloudflare-worker-mcp-server@v2` is the stable pin for the current edition.
