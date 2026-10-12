# Cloudflare Worker MCP Server - Edition v2

!!! info "Edition metadata"
    **Targets:** Cloudflare Workers, Cloudflare Agents stateless MCP, MCP 2026-07-28, TypeScript, Zod, optional Durable Objects
    **Reviewed:** 2026-08; **Next review due:** 2027-08
    **Status:** latest; **Pin as:** `cloudflare-worker-mcp-server@v2`
    **Canonical URL:** <https://vibecodeqa.online/standards/cloudflare-worker-mcp-server/v2/>

This edition is the VCQA standard for remote Model Context Protocol servers hosted on
Cloudflare Workers after the MCP `2026-07-28` stateless protocol shift. It treats
stateless Streamable HTTP as the default production path, Cloudflare `createMcpHandler()`
as the new-server implementation path, and legacy `McpAgent` or sessionful MCP as a
separate compatibility lane that needs explicit migration evidence.

## Protocol revision this edition cites

This edition is written against MCP protocol revision `2026-07-28`, the revision recorded
as this edition's `mcp` target in the standards registry. The previous `v1` edition remains
available for legacy `2025-11-25` / `2025-03-26` servers, but `v2` is the current standard
for a new or migrated Cloudflare Worker MCP server.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, severity, required
evidence, accepted-exception policy, a VCQA scanner or judge signal, and primary-source
references. Findings should cite the rule ID and the pinned edition URL.

## Severity and evidence defaults

| Rule group | Default severity | Required evidence |
|---|---|---|
| Stateless protocol core | `blocker` when a current server cannot process MCP `2026-07-28`; otherwise `high` | MCP handler source, HTTP route tests, protocol-version/header fixtures, `server/discover` transcript, cacheable list/read fixtures. |
| Cloudflare implementation path | `high`; `blocker` when deprecated stateful paths are used for new production servers with no compatibility lane | Worker entrypoint, `wrangler` config, package imports, route map, migration notes for any legacy `McpAgent` lane. |
| Authorization and permissions | `blocker` when protected tools can dispatch before authentication or authorization; otherwise `high` | Auth middleware/source, protected-resource metadata, token/scope tests, denial transcripts, permission map. |
| Tool schemas, validation, state, audit, and output safety | `high` for mutation/data/security boundaries; `medium` for maintainability-only gaps | Tool registration source, schema definitions, validation tests, state-key examples, audit records, redaction tests. |
| Rate limiting, abuse control, deployment evidence, and CI | `high` for missing production abuse controls or deploy gates; `evidence-only` for stale retained transcripts | Workflow files, CI logs, deployment runbook, rate-limit configuration, smoke output, retained artifacts. |

Accepted exceptions use the shared `acceptedException` template: owner, scope,
environment/tenant, reason, compensating controls, evidence, expiry/review date, and
approval trail. Exceptions cannot relabel a legacy sessionful server as a current
stateless MCP `2026-07-28` server; use the compatibility lane instead.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Stateless protocol](stateless-protocol.md) | `PROTO` | MCP `2026-07-28` stateless requests, headers, discovery, cache hints, compatibility lanes |
| 2 | [Cloudflare Worker implementation](cloudflare-worker.md) | `SHAPE` | `createMcpHandler()`, routes, Worker bindings, deprecated `McpAgent` boundaries |
| 3 | [Authorization and permissions](authorization-and-permissions.md) | `AUTH` / `PERM` | protected resource metadata, per-request auth, scopes, consent, abuse controls |
| 4 | [Tool schemas and validation](tool-schemas-and-validation.md) | `TOOL` / `VAL` | tool contracts, Zod validation, structured output, header-routed parameters |
| 5 | [State storage and audit](state-storage-and-audit.md) | `STATE` / `AUDIT` | explicit handles, Durable Object/storage scoping, mutation audit trails |
| 6 | [Output safety and observability](output-safety-and-observability.md) | `OUT` / `OBS` / `ABUSE` | untrusted tool output, safe errors, correlation, rate limits |
| 7 | [Deployment evidence](deployment-evidence.md) | `DEPLOY` / `CI` / `EVIDENCE` | protocol smoke tests, migration evidence, environment gates, retained transcripts |

## Non-negotiables

- **R-PROTO-1** - current servers process each MCP `2026-07-28` request independently and
  do not depend on `initialize`, connection identity, or `Mcp-Session-Id`.
- **R-PROTO-3** - Streamable HTTP POST requests validate `MCP-Protocol-Version`,
  `Mcp-Method`, and `Mcp-Name` against the JSON-RPC body before routing or policy decisions
  trust the mirrored headers.
- **R-PROTO-4** - `server/discover` is implemented and returns supported versions,
  capabilities, server identity, and cache hints.
- **R-SHAPE-1** - new stateless Cloudflare Worker MCP servers use `createMcpHandler()` with
  an SDK v2 server factory, not a new `McpAgent` deployment.
- **R-AUTH-1** - protected MCP routes authenticate and authorize before tool listing,
  resource reads, prompt access, or tool calls can dispatch.
- **R-AUTH-2** - OAuth-protected MCP resources expose protected resource metadata with at
  least one authorization server.
- **R-PERM-1** - every exposed tool maps to narrow per-request grants; mutating tools
  require write-capable grants.
- **R-TOOL-1** - tool names, descriptions, schemas, and side-effect declarations are a
  bounded executable contract.
- **R-VAL-1** - parsed and validated arguments drive authorization and side effects; raw
  JSON is not trusted.
- **R-STATE-1** - any cross-call state is represented by explicit server-minted handles,
  scoped storage keys, or Durable Object IDs, never by connection or session inference.
- **R-AUDIT-1** - mutating tool calls and denied mutation attempts produce audit evidence.
- **R-ABUSE-1** - production remote MCP routes have actor/tool/resource abuse controls.
- **R-DEPLOY-2** - CI proves current protocol behavior, authorization denial, validation
  failure, cache hints, and representative read/mutation paths before production deploy.

## Compatibility lane

Legacy `2025-03-26` and `2025-11-25` servers can remain supported during migration, but
they must be declared as legacy or dual-era. A compliant v2 repo separates the stateless
route from any legacy lane, documents which clients still need the lane, rejects accidental
legacy handling on the stateless route, and records evidence for removing legacy state once
clients have migrated.

## Primary-source baseline

- MCP `2026-07-28` specification:
  <https://modelcontextprotocol.io/specification/2026-07-28>
- MCP `2026-07-28` changelog:
  <https://modelcontextprotocol.io/specification/2026-07-28/changelog>
- MCP versioning and compatibility:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning>
- MCP Streamable HTTP:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http>
- MCP server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/discover>
- MCP authorization server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery>
- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- Cloudflare Agents MCP transport:
  <https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/>
- Cloudflare `McpAgent` API:
  <https://developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>
- Cloudflare Workers documentation:
  <https://developers.cloudflare.com/workers/>
- Zod documentation:
  <https://zod.dev/>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>

<!-- BEGIN GENERATED:related-standards -->
<!-- Generated by standards/generate-catalog.mjs; edit standards/*.json instead. -->
## Related Standards

Reports and scans should cite this pinned edition URL:
<https://vibecodeqa.online/standards/cloudflare-worker-mcp-server/v2/>

- Catalog page: [/docs/standards/stacks/cloudflare-worker-mcp-server/](/docs/standards/stacks/cloudflare-worker-mcp-server/)
- Edition on this page: `v2`
- Latest edition: `v2`
- This edition lifecycle: active. Errata: none.
- Composes: [cloudflare-workers](/docs/standards/items/cloudflare-workers/), [durable-objects](/docs/standards/items/durable-objects/), [mcp](/docs/standards/items/mcp/), [zod](/docs/standards/items/zod/), [typescript](/docs/standards/items/typescript/), [web-security](/docs/standards/items/web-security/), [github-actions](/docs/standards/items/github-actions/)
- Reference implementations: [ref-cloudflare-worker-mcp](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp), [ref-cloudflare-saas](https://github.com/vibecodeqa/ref-cloudflare-saas)
- Related standards: [cloudflare-d1-app](/standards/cloudflare-d1-app/v1/), [tenant-deployed-cloudflare-saas](/standards/tenant-deployed-cloudflare-saas/v1/), [security](/standards/security/v1/), [typescript-sdk](/docs/standards/stacks/typescript-sdk/), [react-spa](/standards/react-spa/v1/), [cloudflare-pages-fullstack](/standards/cloudflare-pages-fullstack/v1/), [typescript](/standards/typescript/v1/), [node-cli-internal-tool](/docs/standards/stacks/node-cli-internal-tool/)
<!-- END GENERATED:related-standards -->
