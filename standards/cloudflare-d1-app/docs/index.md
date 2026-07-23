# Cloudflare D1 App - Gold Standard

This is the reference standard for one deployable stack shape: a Cloudflare Worker or
Pages Functions app that reads and writes Cloudflare D1 through platform bindings.

It exists because none of the upstream sources own the combined repo-level boundary.
Cloudflare documents D1, Wrangler, Workers, Pages Functions, and bindings. GitHub documents
workflow security. OWASP documents injection prevention. VCQA owns the rules that appear
when D1 schema, edge runtime code, tenant boundaries, local state, and production deploys
are combined in one repo.

## When this standard applies

A repo or slice is `cloudflare-d1-app` when all of these hold:

- request handling runs on Cloudflare Workers, Pages Functions, or a framework adapter for
  those runtimes
- D1 is configured through `[[d1_databases]]`, `d1_databases`, dashboard bindings, or an
  equivalent Pages binding
- application code accesses D1 through a binding such as `env.DB`, `context.env.DB`, or a
  framework-specific Cloudflare platform environment
- SQL schema changes are expected to be promoted with Wrangler migrations or equivalent
  versioned SQL files

Use a frontend or Pages fullstack standard as well when the repo includes a static UI. Use a
generic Worker standard when no D1 database is present.

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| [v1](v1/index.md) | Cloudflare Workers/Pages Functions + D1 + Wrangler migrations + TypeScript | 2026-07 | 2027-07 | latest |

## What this standard owns

- D1 binding shape and runtime access patterns
- migration ordering, append-only discipline, and drift detection
- local, preview, staging, production, and tenant database isolation
- prepared statements, parameter binding, and safe dynamic SQL
- row typing and runtime validation at request/database boundaries
- CI gates for local migration apply, remote migration apply, backup awareness, and deploy
  ordering

## Primary references

- Cloudflare D1 docs: <https://developers.cloudflare.com/d1/>
- Cloudflare D1 migrations: <https://developers.cloudflare.com/d1/reference/migrations/>
- Wrangler D1 commands: <https://developers.cloudflare.com/workers/wrangler/commands/d1/>
- Cloudflare D1 Workers Binding API: <https://developers.cloudflare.com/d1/worker-api/>
- Cloudflare Pages bindings: <https://developers.cloudflare.com/pages/functions/bindings/>
- Cloudflare Workers bindings: <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- GitHub Actions workflow authentication: <https://docs.github.com/en/actions/tutorials/authenticate-with-github_token>
- OWASP SQL Injection Prevention Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
