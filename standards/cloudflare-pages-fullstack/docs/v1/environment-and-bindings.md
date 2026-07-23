# Environment And Bindings

## R-ENV-1 - Client environment variables are public

**Rule.** Frontend environment variables may contain public configuration only. Secrets
live in Cloudflare bindings or deployment secrets.

**Why.** Vite-style client env values are bundled into browser assets.

**vcqa.** Flag secret-like `VITE_*` variables and frontend imports from server-only config.

## R-BIND-1 - Bindings are environment-scoped

**Rule.** Preview, staging, and production bindings are named and reviewed separately.

**Why.** Accidental reuse of production bindings in previews is a common fullstack Pages
failure mode.

**vcqa.** Inspect Wrangler config and deployment workflows for environment-specific
binding names.

## R-BIND-2 - Binding types are documented at the Function boundary

**Rule.** Function context bindings should have TypeScript definitions or documented
runtime names.

**Why.** Unclear binding names cause runtime-only failures and make scanner findings less
actionable.

**vcqa.** Check for environment binding types, generated Cloudflare types, or equivalent
interfaces.

## R-ENV-2 - Local and preview configuration are explicit

**Rule.** Local development and preview deployments must document how bindings are mocked,
seeded, or replaced.

**Why.** A fullstack Pages app often behaves differently locally unless bindings are
accounted for.

**vcqa.** Check docs, scripts, or Wrangler config for local binding strategy.
