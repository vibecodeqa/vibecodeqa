# Local Parity And Testing

## R-LOCAL-1 - Local D1 setup is scripted

**Rule.** The repo provides a local setup command or documented sequence that starts the
Worker/Pages runtime with the same D1 binding names used in deployed code.

**Why.** Local D1 is available through Wrangler and should expose the same binding names as
production code, even though the data is local-only.

**vcqa.** Check `package.json` scripts, README, and Wrangler config for `wrangler dev`,
`wrangler pages dev`, `--d1`, or equivalent local binding setup.

**References.** <https://developers.cloudflare.com/d1/best-practices/local-development/>,
<https://developers.cloudflare.com/pages/functions/bindings/>

## R-LOCAL-2 - Local state is disposable or explicitly persisted

**Rule.** Local D1 state is treated as disposable by default, or `--persist-to`/documented
state paths are used intentionally for repeatable development.

**Why.** Wrangler local mode stores local-only D1 state. Tests and onboarding should not
depend on accidental developer machine state.

**vcqa.** Flag tests that assume preexisting `.wrangler/state` data without a setup step;
accept explicit seed/reset scripts or documented `--persist-to` use.

**References.** <https://developers.cloudflare.com/d1/best-practices/local-development/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>

## R-TEST-1 - Database tests apply migrations before seeding

**Rule.** Integration tests that hit D1 create or reset a local database, apply migrations,
then seed data through SQL or app APIs.

**Why.** Tests that bypass migrations can pass against a schema that production never sees.

**vcqa.** Inspect test setup for `wrangler d1 migrations apply --local`, migration import,
or equivalent schema construction before seed fixtures.

**References.** <https://developers.cloudflare.com/d1/reference/migrations/>,
<https://developers.cloudflare.com/d1/best-practices/local-development/>

## R-TEST-2 - Remote smoke tests verify deployed binding and schema

**Rule.** Preview/staging deploys include a smoke test that exercises a D1-backed endpoint
or diagnostic query against the intended non-production remote database.

**Why.** Local migration success does not prove the deployed Worker/Pages project received
the right D1 binding or remote schema.

**vcqa.** Check CI for preview/staging smoke tests after deploy; flag D1-backed apps whose
only tests are unit tests or local-only migration checks.

**References.** <https://developers.cloudflare.com/pages/functions/bindings/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>
