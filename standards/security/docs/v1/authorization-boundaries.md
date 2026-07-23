# Authorization boundaries

## R-AUTHZ-1 - Protected actions authorize at the execution boundary

**Rule.** Protected reads and writes must enforce authorization at the server, Function,
Worker, MCP tool, CLI command, or native command boundary that performs the action.

**Why.** UI visibility, route names, client-side guards, and SDK method names are not
authorization controls.

**vcqa.** Flag protected data access or mutation where the only visible guard is in React
routes, client state, generated SDK convenience methods, command naming, or documentation.

**References.**

- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- OWASP ASVS:
  <https://owasp.org/www-project-application-security-verification-standard/>

## R-AUTHZ-2 - Tenant and resource ownership are trusted server-side facts

**Rule.** Tenant identity, role, and resource ownership must be derived from trusted auth
claims, server-side lookup, or manifest-controlled context before access is granted.

**Why.** Request bodies, route params, hostnames, and SDK options are easy to tamper with
unless they are checked against trusted identity and ownership.

**vcqa.** Flag handlers that accept `tenantId`, `accountId`, `orgId`, `userId`, or
resource owner fields from untrusted input without a trusted authorization lookup.

**References.**

- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-AUTHZ-3 - Mutating operations require explicit capability

**Rule.** Mutating operations require a permission or capability that is narrower than
generic login or read access.

**Why.** Create, update, delete, deploy, migrate, rotate, restore, and admin actions have
different blast radius from reading data.

**vcqa.** Flag code where any authenticated user, any API key, or any MCP session can
perform mutating operations without a named permission, role, scope, or reviewed command
policy.

**References.**

- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-SESSION-1 - Cookie/session mutation endpoints have CSRF posture

**Rule.** Cookie-authenticated mutating endpoints must document and implement CSRF posture
at the route or middleware boundary.

**Why.** Cookies can be sent automatically by browsers, so mutating requests need CSRF
controls appropriate to the app's session model.

**vcqa.** Flag cookie-authenticated `POST`, `PUT`, `PATCH`, or `DELETE` handlers with no
CSRF token, SameSite policy, Origin/Referer validation, double-submit strategy, or
documented stateless exception.

**References.**

- OWASP CSRF Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html>
- OWASP Session Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
