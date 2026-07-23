# Logging and incident evidence

## R-LOG-1 - Security events are logged with useful context

**Rule.** Authentication failures, authorization denials, tenant mismatches, suspicious
input rejection, deployment mutations, secret rotations, admin actions, and restore
operations should produce security-relevant log or audit events.

**Why.** Security incidents cannot be investigated if only generic errors are recorded.

**vcqa.** Flag protected endpoints, MCP tools, CLI commands, and deploy scripts that
silently deny or mutate security-sensitive state with no log or audit evidence.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>

## R-LOG-2 - Logs do not contain secrets or sensitive payloads

**Rule.** Security logs must avoid secrets, credentials, cookies, full authorization
headers, raw sensitive request bodies, private tenant data, and full tool output unless
redacted.

**Why.** Security logging should improve investigation without creating a sensitive data
store.

**vcqa.** Flag full object logging, header dumps, cookie dumps, raw webhook payload logs,
raw MCP output logs, and exception serializers that include secrets or tenant data.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-AUDIT-1 - Mutating administrative actions are audit-ready

**Rule.** Mutating administrative actions must record actor, tenant or environment where
applicable, operation, target resource, result, timestamp, and correlation ID or request
ID.

**Why.** Admin changes are often the root cause or mitigation path for incidents.

**vcqa.** Flag admin routes, CLI commands, MCP tools, migration scripts, provisioning
scripts, and deployment workflows that mutate state without audit fields.

**References.**

- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>

## R-INCIDENT-1 - Incident runbooks identify evidence sources

**Rule.** Repos with production deploys or tenant operations must identify where incident
responders find deployment records, auth logs, audit events, migration state, secret
rotation evidence, and owner escalation paths.

**Why.** A good security standard is not only prevention; it must preserve evidence for
response.

**vcqa.** Flag production apps with no incident docs, no link to deployment history, no
log/audit source, or no owner/escalation path for security-sensitive services.

**References.**

- OWASP ASVS:
  <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
