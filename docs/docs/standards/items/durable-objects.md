# Durable Objects

Durable Objects provide stateful coordination and storage inside Cloudflare Workers.

## Upstream references

- [Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [Durable Objects Best Practices](https://developers.cloudflare.com/durable-objects/best-practices/)

## What upstream owns

- object lifecycle
- storage APIs
- binding behavior
- RPC mechanics

## What VCQA owns

- stateful object boundaries.
- migration and storage policy.
- DO binding checks.

## Detection signals

- Durable Object bindings in Wrangler config
- classes exported for Durable Objects
- object namespace usage

## Composed standards

- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)

## Combination-born guidelines

- Durable Objects plus MCP needs tenant/user/session scoped object IDs.
- Durable Objects plus migrations requires storage compatibility planning.
- Durable Objects plus Workers requires avoiding global mutable state as a coordination mechanism.
