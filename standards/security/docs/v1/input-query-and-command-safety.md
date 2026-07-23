# Input, query, and command safety

## R-INPUT-1 - Untrusted input is validated at trust boundaries

**Rule.** Request bodies, route params, query strings, headers, webhooks, CLI args, MCP
tool arguments, and SDK inputs must be validated before authorization decisions or side
effects.

**Why.** TypeScript types and generated clients do not validate runtime input.

**vcqa.** Flag handlers that use untrusted input for database access, authorization,
filesystem access, network calls, tool dispatch, or command execution without runtime
validation, parsing, or allowlisting.

**References.**

- OWASP Input Validation Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html>

## R-SQL-1 - Untrusted query values use parameter binding

**Rule.** Untrusted values must enter SQL through prepared statements, parameter binding,
or an equivalent safe query API.

**Why.** String-built SQL is a common injection path and is especially risky when route
params, auth claims, tenant IDs, search text, or CLI args feed queries.

**vcqa.** Flag template strings, concatenation, or string interpolation that place
untrusted values into SQL text.

**References.**

- OWASP SQL Injection Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
- Cloudflare D1 prepared statements:
  <https://developers.cloudflare.com/d1/worker-api/prepared-statements/>

## R-CMD-1 - Command execution uses allowlists and argument arrays

**Rule.** Command execution must use fixed command allowlists and argument arrays or
equivalent safe APIs when any value comes from users, config, manifests, or CI inputs.

**Why.** Shell string construction turns data into executable syntax.

**vcqa.** Flag `exec`, shell strings, package scripts, or deployment commands that include
untrusted values without allowlisting, escaping discipline, and explicit working
directory/environment controls.

**References.**

- OWASP Injection Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html>

## R-FETCH-1 - Outbound URLs are constrained

**Rule.** Server-side outbound fetches, webhook calls, and SDK base URLs derived from
untrusted input must be allowlisted, normalized, or otherwise constrained.

**Why.** Unconstrained outbound requests can become SSRF, tenant data exfiltration, or
credential leakage paths.

**vcqa.** Flag server-side `fetch`, webhook, redirect, or SDK base URL construction from
request data, tenant config, or user input without host/protocol allowlisting.

**References.**

- OWASP SSRF Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html>
