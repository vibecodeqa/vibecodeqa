# Cloudflare Worker MCP Server

**Status:** Authored as [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/)

A remote Model Context Protocol server deployed on Cloudflare Workers, with
authorization at the HTTP boundary, narrow tool schemas, runtime validation,
explicit permission checks, optional Durable Object-backed state, and deployment
evidence.

This stack is valuable when the problem is not "how do I write an MCP server?"
but "how do I expose remote tools to AI clients without turning the Worker into
an unaudited remote-control endpoint?"

## Full rubric

Use [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/)
when a repository exposes MCP over HTTP from Cloudflare Workers or Cloudflare
Agents.

Reference implementation:
[vibecodeqa/ref-cloudflare-worker-mcp](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp).
This repo is a product-neutral template. It shows a Worker entrypoint, MCP
Streamable HTTP handling, protected resource metadata, authorization before tool
dispatch, scoped tool permissions, Zod validation, audit events, CI gates, and a
tracked VCQA report.

VCQA report:
[A 91/100](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp/blob/main/docs/vcqa-report.md).

## What this teaches

Choose this stack when you need a remote MCP server that can be reached by
hosted clients, IDE agents, internal automation, or product agents without
installing a local process on every machine. It fits tool surfaces such as
account operations, tenant administration, content workflows, deploy automation,
support tooling, and product-specific data access.

Do not choose this stack just because MCP is fashionable. If the tools only run
on a developer laptop, use a local MCP server. If the server is just a normal
HTTP API, use API and web-security standards. If the tool can mutate customer or
production data and you cannot fund authorization, audit, rate limiting, and
operational review, do not expose it as a remote MCP tool yet.

The stack is strongest when the Worker remains a narrow protocol and policy
boundary:

- MCP transport and discovery live at explicit routes such as `/mcp` and
  `/.well-known/oauth-protected-resource`.
- Authentication and authorization happen before MCP tool dispatch.
- Every tool has a bounded input schema, a permission mapping, and a declared
  side-effect profile.
- Durable Objects, KV, R2, or D1 are used only behind scoped storage keys and
  documented state ownership.
- CI proves unauthorized rejection, tool listing, schema validation, and at
  least one representative read and mutation path.

## When this stack is a good fit

- The server must be reachable over HTTP by remote MCP clients.
- The tool surface is product-specific or organization-specific, not a generic
  public API.
- The Worker can enforce auth, permissions, validation, and audit before any
  side effect.
- Tool latency and runtime behavior fit Cloudflare Workers constraints.
- Stateful coordination, if needed, can be represented through Durable Objects
  or other Cloudflare bindings with clear ownership boundaries.
- You need repeatable CI/deployment evidence rather than a hand-run local
  server.

## When not to use it

- The server only needs stdio for local developer workflows.
- Tool calls require long-running jobs that exceed Worker request/runtime
  expectations without a queue, workflow, or async job boundary.
- Tools need unrestricted shell, database, or cloud-account access.
- The auth model is "the client promised it is allowed."
- Multiple tenants, users, or sessions would share the same Durable Object ID,
  cache key, or audit stream by accident.
- You cannot explain what each mutating tool is allowed to change.

## Architecture contract

| Layer | Standard expectation |
|---|---|
| Worker entrypoint | Owns MCP routes explicitly; non-MCP routes do not fall through into protocol handling. |
| Transport | Uses current MCP Streamable HTTP semantics for remote clients; legacy SSE is treated as compatibility, not the default. |
| Discovery | Protected resource metadata or equivalent authorization challenge is discoverable by clients. |
| Authorization | Request auth is checked at the Worker boundary before any tool list, resource read, or tool call. |
| Permissions | Each tool maps to narrow scopes or grants; read and mutate capabilities are separated. |
| Validation | Tool arguments are parsed with Zod or equivalent runtime validation before permission-sensitive work. |
| State | Durable Object IDs and storage keys include the tenant, user, session, resource, or coordination boundary they represent. |
| Audit | Mutating calls emit actor, tool, target, scope, outcome, timestamp, and request correlation. |
| Output safety | Tool output is data returned to a client, not instructions trusted by later tool calls. |
| Deployment | CI proves auth rejection, server initialization, tool listing, schema validation, and representative calls. |

## Upstream references

- [Cloudflare Agents MCP](https://developers.cloudflare.com/agents/model-context-protocol/)
- [Cloudflare `McpAgent` API](https://developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/)
- [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)
- [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [MCP specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [MCP authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zod documentation](https://zod.dev/)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)

## Composes

- [Cloudflare Workers](../items/cloudflare-workers.md)
- [Durable Objects](../items/durable-objects.md)
- [Model Context Protocol](../items/mcp.md)
- [Zod](../items/zod.md)
- [TypeScript](../items/typescript.md)
- [Web Security](../items/web-security.md)
- [GitHub Actions](../items/github-actions.md)

## VCQA-owned rule surface

- Worker routing and MCP endpoint ownership.
- Remote MCP authorization and protected resource discovery.
- Tool schema quality, runtime validation, and parsed-argument use.
- Tool-level permission boundaries and read/write separation.
- Durable Object, KV, R2, or D1 state ownership.
- Tenant/user/session/resource scoping for state keys and object IDs.
- Mutating tool audit evidence.
- Safe output handling for untrusted tool results.
- CI and deployment evidence for protocol, auth, validation, and representative
  tool behavior.

## Detection signals

- `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc`.
- Worker entrypoint exporting a `fetch` handler or Cloudflare Agent/McpAgent
  server.
- `@modelcontextprotocol/sdk` or Cloudflare Agents MCP dependencies.
- MCP route names such as `/mcp`, `/sse`, or protected-resource metadata paths.
- Tool registration calls, tool/resource schemas, or Zod object schemas.
- OAuth, bearer-token, service-token, Access, or protected resource metadata
  handling.
- Durable Object, KV, R2, D1, or service bindings used by tool handlers.
- Audit/log calls that name actor, tool, target, request ID, outcome, and
  environment.
- CI smoke tests for unauthorized requests, tool listing, validation failure,
  and representative tool invocation.

## Combination-born guidelines

- **Remote MCP plus Workers makes auth a routing concern.** The Worker must
  reject unauthorized requests before the MCP server dispatches tools.
- **MCP schemas plus Zod must converge.** The schema advertised to clients and
  the schema enforced at runtime should describe the same boundary.
- **Tools are permissions, not just functions.** Every exposed tool is a
  capability. Mutating tools require narrower grants than read-only discovery.
- **Durable Objects are coordination boundaries.** Object IDs must be scoped to
  the tenant, user, session, or resource being coordinated.
- **OAuth discovery is part of interoperability.** Protected remote servers need
  metadata or challenge behavior clients can discover.
- **Tool output is untrusted.** Returned text, fetched documents, and model-facing
  content must not become policy for later tool calls.
- **CI has to exercise the protocol.** Unit tests are not enough; the deployed
  Worker shape must prove initialization, auth rejection, schema errors, and a
  representative call path.

## Implementation checklist

- Define the MCP route and any metadata routes explicitly.
- Decide whether the implementation uses raw Workers plus the MCP TypeScript SDK,
  Cloudflare Agents `McpAgent`, or a thin wrapper around either.
- Add a typed binding contract for Durable Objects, KV, R2, D1, secrets, and
  service bindings.
- Put auth verification before tool listing, resource access, and tool calls.
- Give every tool a name, description, Zod input schema, permission requirement,
  and side-effect classification.
- Parse tool inputs once and pass parsed values into authorization and side
  effects.
- Add audit events for every mutation and every denied mutation attempt.
- Redact tokens, prompts, tool arguments, and fetched content where logs could
  expose secrets or customer data.
- Add CI tests for unauthorized requests, invalid input, tool listing, read-only
  calls, mutating calls, and deployment config.
- Document how to rotate credentials, revoke access, and investigate a bad tool
  call.

## Rule highlights

- **R-SHAPE-1: Worker entrypoint owns the MCP endpoint.** Remote MCP routing is
  explicit and non-MCP routes do not fall through into the protocol handler.
- **R-AUTH-1: Worker boundary enforces authorization.** Protected MCP endpoints
  reject unauthenticated or unauthorized requests before tool dispatch.
- **R-AUTH-2: Protected resource metadata is published.** OAuth-protected MCP
  servers expose protected resource metadata or a challenge path clients can
  discover.
- **R-PERM-1: Tools map to narrow permissions.** Each tool has an enforceable
  permission or scope, and mutating tools require write-capable grants.
- **R-TOOL-1: Tool input schemas are narrow.** Tool parameters are concrete,
  bounded, and advertised to clients instead of hidden in prose.
- **R-VAL-1: Tool arguments are parsed before side effects.** Zod or equivalent
  runtime validation happens before authorization-sensitive work or mutations.
- **R-STATE-1: Durable Object IDs are scoped to the coordination boundary.**
  Tenant, user, session, or resource state is not mixed through shared object IDs.
- **R-AUDIT-1: Mutating tool calls leave an audit trail.** Actor, tool, target,
  scope, outcome, timestamp, and request correlation are captured.
- **R-OUT-1: Tool output is untrusted data.** External or user-controlled content
  returned by tools is not treated as policy or instructions for further tool
  calls.
- **R-DEPLOY-3: CI runs protocol and auth smoke tests before production.**
  Deploys prove initialization, tool listing, representative calls, and
  unauthorized rejection.

## Anti-patterns

- Exposing generic `runCommand`, `queryDatabase`, `fetchUrl`, or `adminAction`
  tools without narrow schemas and tool-specific authorization.
- Letting the MCP SDK receive a request before the Worker has established actor,
  environment, and permission context.
- Using one Durable Object ID, KV prefix, or audit stream for multiple tenants or
  unrelated resources.
- Treating local dev tokens, preview tokens, and production OAuth credentials as
  interchangeable.
- Allowing tool descriptions or fetched content to instruct the server to ignore
  authorization, validation, or audit rules.
- Logging full prompts, bearer tokens, OAuth responses, tool arguments, or
  fetched customer data while trying to create observability.
- Shipping only unit tests and no HTTP smoke test for the deployed MCP route.

## Benefits

- Gives teams a concrete way to decide when remote MCP on Workers is worth the
  operational surface area.
- Converts generic MCP and Cloudflare documentation into checkable production
  expectations.
- Makes tool schemas, permissions, state ownership, and auditability visible in
  code review.
- Helps reference templates and product repos prove their quality with the same
  rubric instead of relying on a demo-only starter.
