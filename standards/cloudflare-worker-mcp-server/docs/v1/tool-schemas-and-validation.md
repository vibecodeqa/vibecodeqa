# Tool Schemas And Validation

## R-TOOL-1 - Tool input schemas are narrow

**Rule.** Every tool must advertise a narrow input schema with named fields, concrete
types, bounds or enums where applicable, and no unconstrained catch-all object for side
effects.

**Why.** MCP clients use the input schema to decide how to call tools. Broad schemas force
the model to infer intent from prose and make permission checks less precise.

**vcqa.** Inspect `registerTool`, `server.tool`, Cloudflare Agents tool definitions, and
JSON Schema output for required fields, constraints, descriptions, and absence of generic
`z.any`, `z.unknown`, `record(any)`, or free-form command/query fields around mutations.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://ts.sdk.modelcontextprotocol.io/
- https://zod.dev/api

## R-TOOL-2 - Tool names and descriptions are executable contracts

**Rule.** Tool names, titles, descriptions, and parameter descriptions must describe a
single bounded operation and must not promise capabilities that the handler does not
authorize and validate.

**Why.** Tool metadata is read by agents as an affordance. Over-broad or misleading
descriptions can cause unexpected tool selection and overreach.

**vcqa.** Compare tool metadata with handler side effects, scope checks, and tests; flag
generic names such as `run`, `admin`, `query`, or `execute` unless sandbox, allowlist, and
permission controls are explicit.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://owasp.org/www-project-top-10-for-large-language-model-applications/2_0_vulns/LLM06_ExcessiveAgency.html

## R-TOOL-3 - Structured outputs have schemas where clients need to act

**Rule.** Tools that return machine-actionable data should define an output schema and
return structured content that conforms to it.

**Why.** Structured tool results let clients validate and route data without string
scraping. MCP requires structured results to conform when an output schema is provided.

**vcqa.** Inspect tool definitions for `outputSchema` or equivalent schema metadata, and
check handler responses for `structuredContent` matching the declared schema.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://modelcontextprotocol.io/specification/2025-11-25/schema
- https://ts.sdk.modelcontextprotocol.io/

## R-VAL-1 - Tool arguments are parsed before side effects

**Rule.** Tool handlers must use parsed and validated arguments for authorization checks,
queries, upstream calls, and mutations.

**Why.** TypeScript does not validate JSON-RPC input at runtime. Raw request params,
headers, or JSON bodies remain attacker-controlled even when the tool has TypeScript
types.

**vcqa.** Trace each tool handler from input to side effect; flag raw `params.arguments`,
`request.json()`, URL search params, or JSON casts used before Zod `parse`, `safeParse`,
or SDK-validated values.

**References.**

- https://zod.dev/basics
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://ts.sdk.modelcontextprotocol.io/

## R-VAL-2 - Validation failures are safe and actionable

**Rule.** Validation failures should return structured, non-sensitive errors that identify
invalid fields without echoing secrets, raw provider payloads, or internal stack traces.

**Why.** Tool validation errors are visible to MCP clients and may be fed back into a
model. They should help the client repair the call without leaking internals.

**vcqa.** Inspect Zod error formatting and MCP error returns for field paths and safe
messages; flag raw `ZodError` dumps when they include sensitive input values.

**References.**

- https://zod.dev/basics
- https://zod.dev/error-customization
- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices

## R-VAL-3 - Schemas round-trip to the advertised protocol shape

**Rule.** Zod schemas used for MCP tools must be compatible with the SDK's advertised
schema format and should be tested through `tools/list` or equivalent inspector coverage.

**Why.** A schema that validates locally but serializes as an empty or misleading MCP
schema weakens client planning and hides required parameters.

**vcqa.** Run or inspect tests that list tools and snapshot the advertised input and
output schemas; flag complex schema constructs whose JSON Schema output loses required
fields, descriptions, or discriminators.

**References.**

- https://ts.sdk.modelcontextprotocol.io/
- https://zod.dev/json-schema
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools

