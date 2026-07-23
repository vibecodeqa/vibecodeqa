# cloudflare-worker-mcp-server

The **gold-standard reference** for the `cloudflare-worker-mcp-server` archetype:
remote Model Context Protocol servers deployed on Cloudflare Workers, optionally using
Durable Objects, KV, R2, D1, or upstream APIs behind tool calls.

Published by VibeCode QA at:

<https://vibecodeqa.online/standards/cloudflare-worker-mcp-server/>

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
| `v1` | Cloudflare Workers + remote MCP + TypeScript + Zod | 2026-07 | 2027-07 | latest |

`cloudflare-worker-mcp-server@v1` is the stable pin for this edition.

