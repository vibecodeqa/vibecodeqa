# Authorization And Permissions

## R-AUTH-1 - Worker boundary enforces authorization

**Rule.** Protected remote MCP endpoints must reject unauthenticated or unauthorized
requests at the Worker boundary before MCP tool dispatch.

**Why.** MCP tool descriptions are invitations for an agent to act. Client-side UI,
prompt instructions, or tool descriptions are not authorization controls for a public HTTP
endpoint.

**vcqa.** Inspect the MCP route for bearer-token validation, OAuth provider middleware,
Cloudflare Access checks, or equivalent authorization before `serve`, `createMcpHandler`,
transport dispatch, or tool invocation.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/securing-mcp-server/

## R-AUTH-2 - Protected resource metadata is published

**Rule.** OAuth-protected MCP servers must publish OAuth protected resource metadata or
return a `WWW-Authenticate` challenge that points clients to that metadata, including the
authorization server location.

**Why.** Current MCP authorization classifies protected MCP servers as OAuth resource
servers. Clients need protected resource metadata to discover the authorization server and
request the right token.

**vcqa.** Request the MCP endpoint without credentials and check for a 401 challenge with
`resource_metadata`, or request the applicable `.well-known/oauth-protected-resource`
metadata endpoint; validate `authorization_servers` and resource values for the deployed
origin.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- https://datatracker.ietf.org/doc/html/rfc9728
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/

## R-AUTH-3 - Tokens are issued for this MCP resource

**Rule.** The Worker must accept only tokens issued by the configured authorization server
for this MCP resource and environment; it must not pass through arbitrary upstream API
tokens as MCP access tokens.

**Why.** Token passthrough and audience confusion let one service's credential be replayed
against another resource. The MCP server is responsible for validating tokens before using
them for tools.

**vcqa.** Inspect token validation for issuer, audience/resource, expiry, scopes, and
environment-specific configuration; flag code that forwards GitHub/Google/Slack/API
tokens from MCP clients directly to tools without minting or validating an MCP-bound token.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/

## R-PERM-1 - Tools map to narrow permissions

**Rule.** Every tool must document and enforce the permission or scope needed to invoke it;
mutating tools require a distinct write-capable grant.

**Why.** Agents choose tools dynamically. Tool-level least privilege is the practical
control that prevents a read-only workflow from gaining write, delete, billing, or admin
capability.

**vcqa.** Build a tool-to-scope matrix from tool registration metadata, authorization
helpers, handler checks, consent text, and tests; flag tools without an enforceable scope
or write tools covered by only broad read grants.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/2_0_vulns/LLM06_ExcessiveAgency.html

## R-PERM-2 - Consent is per client and per scope set

**Rule.** OAuth proxy flows must record consent per user, MCP client, redirect URI, and
requested scope set before forwarding to a third-party authorization provider.

**Why.** MCP proxy servers can become confused deputies when a cached third-party consent
decision is reused for a different MCP client or redirect target.

**vcqa.** Inspect OAuth handlers for approved-client registries, redirect URI validation,
CSRF/state checks, consent storage, and tests for changed scopes or redirect URIs.

**References.**

- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://developers.cloudflare.com/agents/model-context-protocol/guides/securing-mcp-server/
- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

## R-PERM-3 - Environment credentials are isolated

**Rule.** Preview, staging, and production MCP authorization settings, OAuth clients,
secrets, and protected-resource metadata must not be interchangeable.

**Why.** A preview Worker that accepts production tokens or advertises a production
resource can leak capabilities across environments and weaken deployment review.

**vcqa.** Parse Wrangler environments, secrets documentation, OAuth config, callback URLs,
resource metadata, and CI deploy commands; flag reused client IDs/secrets/resources across
environments unless explicitly justified for a non-production shared sandbox.

**References.**

- https://developers.cloudflare.com/workers/wrangler/environments/
- https://developers.cloudflare.com/workers/configuration/environment-variables/
- https://developers.cloudflare.com/workers/configuration/secrets/

