# Cloudflare Workers

Workers are edge runtime services deployed on Cloudflare.

## Upstream references

- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [Workers Best Practices](https://developers.cloudflare.com/workers/best-practices/)

## What upstream owns

- Worker runtime behavior
- bindings
- compatibility dates
- deployment APIs

## What VCQA owns

- compatibility-date policy.
- Worker-specific deployment and secrets checks.
- runtime anti-patterns.

## Detection signals

- `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc`
- Worker entrypoint source
- Cloudflare worker dependencies

## Composed standards

- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)

## Combination-born guidelines

- Workers plus MCP requires protocol-safe request handling and authorization at the edge.
- Workers plus Durable Objects requires object ID scoping and storage migration discipline.
- Workers plus TypeScript requires avoiding Node-only APIs unless explicitly polyfilled.
