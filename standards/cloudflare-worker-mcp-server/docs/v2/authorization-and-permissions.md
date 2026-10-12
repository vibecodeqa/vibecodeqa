# Authorization and permissions

## R-AUTH-1 - Worker boundary enforces auth before dispatch

**Severity.** `blocker`.

**Rule.** Protected MCP routes must authenticate the request and authorize the actor,
client, tenant, environment, and resource scope before `server/discover`, list/read
operations, or tool calls expose protected capabilities or data.

**Why.** Remote MCP turns tools into network-reachable capabilities. Letting the MCP server
dispatch first makes tool code responsible for a boundary that belongs at the Worker route.

**Evidence.**

- Source/config: auth middleware, Worker route dispatch, OAuth provider setup, permission
  context construction.
- CI/artifacts: unauthenticated, expired-token, wrong-scope, wrong-tenant, and unknown-client
  denial tests before tool handler invocation.
- Runtime/deploy: deployed denial transcript and protected-route smoke.
- Exception: no exception for protected production routes. A public demo route must be
  labelled public, expose only non-sensitive tools, and carry `acceptedException` with owner,
  scope, environment, controls, evidence, review date, and approval trail.

**vcqa.** Flag MCP handlers reached before auth, tests that call tool handlers directly as
proof of auth, or protected tools visible in unauthenticated list/discover responses.

**References.**

- MCP authorization server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- Cloudflare Agents MCP transport:
  <https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/>

## R-AUTH-2 - Protected resource metadata is published

**Severity.** `blocker` for OAuth-protected servers; `high` for non-OAuth protected routes
that provide an equivalent challenge but no metadata.

**Rule.** OAuth-protected MCP resources must implement OAuth 2.0 Protected Resource
Metadata discovery and include `authorization_servers` with at least one authorization
server. The resource URL, metadata, and auth challenge must match the deployed MCP route.

**Why.** MCP clients need a standard way to discover where authorization happens and which
server issued valid credentials for this MCP resource.

**Evidence.**

- Source/config: metadata route, OAuth provider config, resource identifier, auth challenge
  construction.
- CI/artifacts: metadata fetch test and unauthorized request challenge test.
- Runtime/deploy: deployed `/.well-known/oauth-protected-resource` or route-specific
  metadata transcript.
- Exception: accepted only for private service-token deployments with documented client
  provisioning; include owner, actor/client scope, compensating controls, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag OAuth/bearer-protected MCP routes without protected resource metadata,
metadata missing `authorization_servers`, or metadata whose resource URL does not match the
MCP endpoint.

**References.**

- MCP authorization server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery>
- OAuth 2.0 Protected Resource Metadata:
  <https://www.rfc-editor.org/rfc/rfc9728.html>

## R-AUTH-3 - Tokens and credentials are scoped to resource, tenant, and environment

**Severity.** `high`, escalating to `blocker` when production credentials can access
preview/local resources or a different tenant.

**Rule.** OAuth tokens, service tokens, cookies, API credentials, and secret bindings used
by the MCP Worker must be scoped to the MCP resource server, authorization server, tenant or
organization boundary, and deployment environment they are meant to access.

**Why.** MCP authorization discovery treats authorization servers as independent. Cloudflare
environments and Workers secrets also need explicit production/preview separation.

**Evidence.**

- Source/config: token verification, audience/resource checks, Wrangler environments,
  secret names, tenant/org claim mapping.
- CI/artifacts: tests for wrong audience, wrong tenant, wrong environment, and wrong
  authorization server.
- Runtime/deploy: credential rotation/revocation runbook.
- Exception: `acceptedException` must name the environment and tenant/resource scope, owner,
  compensating controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag token checks with no audience/resource validation, shared preview/prod
secret names, or tenant claims parsed but not enforced before tool dispatch.

**References.**

- MCP authorization server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- Cloudflare Workers environments:
  <https://developers.cloudflare.com/workers/wrangler/environments/>

## R-PERM-1 - Tools map to narrow per-request permissions

**Severity.** `blocker` for mutating tools without explicit write permission checks;
otherwise `high`.

**Rule.** Every tool must map to one or more narrow permissions or scopes evaluated from
the current request credentials. Mutating tools must require write-capable grants separate
from read/list/discovery grants.

**Why.** A tool name is a capability. Broad "authenticated user" checks let clients perform
actions beyond the user, tenant, or environment authorization they received.

**Evidence.**

- Source/config: tool registry, permission map, scope constants, authz checks in or before
  handlers.
- CI/artifacts: allowed/denied tests per representative read and mutation tool.
- Runtime/deploy: permission matrix in docs or runbook.
- Exception: accepted only for read-only public tools; include owner, tool scope,
  no-side-effect evidence, review date, and approval trail.

**vcqa.** Flag tools with no permission mapping, mutating handlers guarded only by login,
or broad wildcard scopes used across unrelated tools.

**References.**

- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-PERM-2 - High-risk tools require explicit user or operator consent

**Severity.** `high`, escalating to `blocker` when a tool can mutate production,
billing, secrets, deployments, permissions, or customer data without any confirmation path.

**Rule.** Tools with material side effects must expose their side-effect profile and require
the appropriate consent, approval, or policy gate before execution. The confirmation can be
client-side, server-side, workflow-based, or operator-reviewed, but it must be evidenced.

**Why.** MCP tools are model-invokable. Sensitive side effects need human or policy
confirmation even when the actor is authenticated.

**Evidence.**

- Source/config: tool metadata, side-effect classification, approval checks, workflow or
  consent code.
- CI/artifacts: tests for denied mutation without approval and allowed mutation with proof.
- Runtime/deploy: audit record tying approval to request/tool/action.
- Exception: `acceptedException` must name the tool, owner, environment/tenant, reason,
  compensating controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag mutating tools named as deletes, deploys, writes, payments, role changes, or
admin operations without side-effect metadata or approval tests.

**References.**

- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>
- MCP security best practices:
  <https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices>

## R-PERM-3 - Abuse controls are keyed by actor, tool, and resource

**Severity.** `high`.

**Rule.** Production remote MCP routes must enforce or delegate rate limits, quotas,
concurrency limits, or equivalent abuse controls keyed to actor/client, tool, tenant, and
resource risk. Global route limits alone are insufficient for sensitive tools.

**Why.** MCP tools can fan out to databases, APIs, deployment systems, and customer data.
Abuse controls reduce damage from credential theft, broken clients, loops, and prompt-driven
automation.

**Evidence.**

- Source/config: limiter binding/config, per-tool policy, tenant/client keys, retry policy,
  and error handling.
- CI/artifacts: limiter tests or integration transcript for over-limit calls.
- Runtime/deploy: dashboard/runbook evidence for limits and alert thresholds.
- Exception: accepted only for private preview routes with bounded users and no sensitive
  tools; include owner, scope, controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag production MCP routes with no limiter references, all tools sharing one
anonymous bucket, or long-running/fan-out tools with no concurrency policy.

**References.**

- Cloudflare Workers documentation:
  <https://developers.cloudflare.com/workers/>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
