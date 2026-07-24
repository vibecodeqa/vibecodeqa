# Observability and audit

## R-OBS-1 - Logs carry tenant and deployment context

**Rule.** Server logs, alerts, traces, and operational events must include tenant,
environment, deployment or version, actor where available, and target resource context.

**Why.** Tenant-specific incidents cannot be investigated from generic errors that omit
which tenant, deployment, data resource, or Worker was affected.

**vcqa.** Flag logging and alerting code that lacks tenant and deployment identifiers for
server-side requests, background jobs, MCP tools, migrations, and admin operations.

**References.**

- Cloudflare Workers observability:
  <https://developers.cloudflare.com/workers/observability/>

## R-AUDIT-1 - Mutating tenant operations create audit evidence

**Rule.** Tenant provisioning, deprovisioning, migration, secret rotation, domain or alias
changes, production deploys, restore operations, and administrative data mutations must
create audit evidence.

**Why.** Mutating tenant operations define the operational and security history of the
tenant.

**vcqa.** Flag mutating scripts and administrative routes that change tenant resources or
data without an audit event naming actor, tenant, environment, operation, target, and
result.

**References.**

- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-OBS-2 - Secret and auth failures are observable without leaking secrets

**Rule.** Secret access failures, authorization denials, tenant mismatches, and binding
misconfiguration must be observable without logging secret values or sensitive tenant
data.

**Why.** Incident response needs high-quality signals, but logs must not become a second
data leak.

**vcqa.** Flag logs that expose tokens, credentials, tenant secrets, or raw sensitive
payloads while trying to diagnose auth and binding failures.

**References.**

- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-INCIDENT-1 - Incident evidence includes tenant deployment and data state

**Rule.** Tenant incident runbooks must collect the tenant manifest, active deployment or
Worker version, deployment URL, data-resource migration or backup state, recent
admin/audit events, and affected aliases/domains.

**Why.** A tenant-deployed incident crosses code, config, data, and domain state.

**vcqa.** Flag incident docs that do not tell responders how to reconstruct the current
tenant deployment and data state.

**References.**

- Cloudflare Workers versions and deployments:
  <https://developers.cloudflare.com/workers/versions-and-deployments/>
- Cloudflare D1 Time Travel and backups:
  <https://developers.cloudflare.com/d1/reference/time-travel/>
