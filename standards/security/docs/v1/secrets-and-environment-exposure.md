# Secrets and environment exposure

## R-SECRET-1 - Secrets are never committed or bundled

**Rule.** Secrets must not be committed to source, checked into generated config, bundled
into browser assets, or printed into static build output.

**Why.** Once a secret is in repo history or a client bundle, rotation is the only safe
recovery path.

**vcqa.** Flag secret-like literals, `.env` files, generated config, source maps, or build
artifacts that expose API keys, tokens, private URLs, OAuth client secrets, signing keys,
database credentials, or production webhook secrets.

**References.**

- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-ENV-1 - Public client environment variables are treated as public

**Rule.** Browser-exposed environment variables, such as Vite `VITE_*` variables, must
contain only public configuration.

**Why.** Client env values are embedded into shipped JavaScript and readable by users.

**vcqa.** Flag `VITE_*`, public runtime config, HTML-injected env, or static JSON config
containing tokens, credentials, secret URLs, privileged feature flags, tenant secrets, or
backend-only integration keys.

**References.**

- Vite env variables:
  <https://vite.dev/guide/env-and-mode>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-SECRET-2 - Runtime secrets use platform secret stores or scoped bindings

**Rule.** Server, Worker, Function, CLI, and CI secrets must come from an approved secret
store, environment secret, or scoped binding rather than source-controlled files.

**Why.** Runtime secret stores provide separation between code, environments, and
operators.

**vcqa.** Flag application code or workflows that load production secrets from committed
files, default sample config, broad shared variables, or unscoped local files.

**References.**

- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-SECRET-3 - Secrets are environment-scoped

**Rule.** Preview, staging, production, and tenant-specific environments must not share
production secrets unless a reviewed exception explains the scope, controls, and rotation
path.

**Why.** Preview and staging surfaces are usually more numerous and less protected than
production.

**vcqa.** Flag workflows, Wrangler config, binding maps, or docs that reuse one production
secret across preview/staging/production with no exception and owner.

**References.**

- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
