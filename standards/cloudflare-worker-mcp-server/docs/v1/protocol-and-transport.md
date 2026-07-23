# Protocol And Transport

## R-PROTO-1 - Remote transport follows MCP HTTP semantics

**Rule.** Remote clients must connect through a supported MCP HTTP transport, preferably
the MCP Streamable HTTP transport as provided by Cloudflare Agents helpers or the MCP SDK.

**Why.** MCP messages, lifecycle negotiation, sessions, and streaming behavior are
protocol concerns. A generic JSON API that happens to call tools is not a conforming
remote MCP server.

**vcqa.** Identify `createMcpHandler`, `McpAgent.serve`, MCP SDK Streamable HTTP
transport, or equivalent protocol handlers; flag custom JSON endpoints that bypass MCP
initialization and tool listing.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/

## R-PROTO-2 - MCP lifecycle is not skipped

**Rule.** The server must participate in MCP initialization and advertise only the
capabilities it actually implements.

**Why.** MCP clients use the initialization handshake and capability advertisement to
decide which protocol features, tools, prompts, resources, and flows are available.

**vcqa.** Inspect MCP server construction and capabilities for declared tools, prompts,
resources, elicitation, or logging; flag code paths that expose handlers without the MCP
initialize/list flows.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/server
- https://github.com/modelcontextprotocol/typescript-sdk

## R-PROTO-3 - Protocol errors are structured and safe

**Rule.** MCP and HTTP errors should preserve protocol-visible status while avoiding raw
stack traces, provider errors, secret names, or internal storage details.

**Why.** Remote MCP clients receive errors directly and may feed them back into model
context. Over-detailed errors become information disclosure and prompt material.

**vcqa.** Inspect error handlers around MCP server dispatch, tool handlers, and Worker
routes for structured failures, safe client messages, and server-side correlation IDs.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25
- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://developers.cloudflare.com/durable-objects/best-practices/error-handling/

## R-PROTO-4 - Compatibility bridges are documented

**Rule.** If the server supports older clients through proxies, SSE compatibility, or
local `mcp-remote` bridges, the production endpoint and supported client path must be
documented and tested separately from local-only setup.

**Why.** Remote MCP support is still uneven across clients. Local bridges are useful for
testing but can mask authorization, cookie, redirect, and transport differences in the
production Worker.

**vcqa.** Check docs, smoke tests, and client examples for the deployed MCP URL and the
bridge/proxy path; flag only-local connection instructions for a server advertised as
remote.

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/test-remote-mcp-server/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports

