# Migrations And Drift

## R-MIG-1 - Migrations are append-only after shared apply

**Rule.** A migration file that may have been applied to preview, staging, production, or a
tenant database is never edited in place; changes are made by adding a later migration.

**Why.** D1 records applied migrations in a migration table. Editing history means the repo
no longer describes the schema already promoted to shared databases.

**vcqa.** Flag modified migration files older than the newest shared migration marker,
unless the PR explicitly proves the migration has not reached any shared environment.

**References.** <https://developers.cloudflare.com/d1/reference/migrations/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>

## R-MIG-2 - Migration order is deterministic

**Rule.** Migration filenames sort in the intended apply order and avoid duplicate sequence
numbers, ambiguous timestamps, or unordered ad hoc SQL files.

**Why.** Wrangler applies unapplied migration files from the migrations directory. Humans
and CI must be able to determine the same order before touching a remote database.

**vcqa.** Sort migration paths under `migrations_dir` or `migrations/`; flag duplicate
numeric prefixes, unsortable names, and SQL schema files outside the documented migration
flow.

**References.** <https://developers.cloudflare.com/d1/reference/migrations/>,
<https://developers.cloudflare.com/workers/wrangler/configuration/>

## R-MIG-3 - Clean local migration apply is a required gate

**Rule.** CI applies all migrations to a clean local D1 database before any remote migration
or deploy step can run.

**Why.** Local D1 uses Wrangler-managed state and mirrors the production D1 runtime closely
enough to catch SQL syntax, ordering, missing table, and foreign-key mistakes before remote
promotion.

**vcqa.** Check workflows for `wrangler d1 migrations apply <DB> --local` or an equivalent
clean local D1 migration test before remote apply/deploy.

**References.** <https://developers.cloudflare.com/d1/best-practices/local-development/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>

## R-DRIFT-1 - Applied migration identity is drift-checked

**Rule.** The repo has a drift guard that compares applied migration identity against the
repo migration set before remote promotion. A checksum manifest, protected migration
history, or equivalent review gate is acceptable.

**Why.** D1 records applied migrations by name, but repo edits to an already-applied file
can still make source history disagree with the database schema.

**vcqa.** Look for migration checksum manifests, scripts comparing remote `d1_migrations`
to repo files, or protected-branch rules that reject edits to previously shared migration
files.

**References.** <https://developers.cloudflare.com/d1/reference/migrations/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>

## R-ROLL-1 - Destructive schema changes have a forward-compatible rollout

**Rule.** Dropping columns/tables, tightening constraints, rewriting tenant keys, or
backfilling required data has a documented expand/migrate/contract sequence or equivalent
deployment plan.

**Why.** Edge code and D1 schema are deployed separately enough that old and new code can
observe transitional schemas. Time Travel can recover a database, but restore is
destructive and not a substitute for a safe rollout.

**vcqa.** Flag destructive SQL in migrations without adjacent rollout notes, staged code
compatibility, backup/bookmark instructions, or a linked deployment runbook.

**References.** <https://developers.cloudflare.com/d1/reference/time-travel/>,
<https://developers.cloudflare.com/d1/reference/migrations/>

## R-MIG-4 - Foreign-key and pragma assumptions are explicit

**Rule.** Migrations that rely on SQLite foreign-key behavior, generated columns, or other
D1/SQLite features declare the expected behavior in SQL or migration docs.

**Why.** Schema constraints are part of application correctness. Hidden assumptions about
foreign keys and SQLite features lead to tests passing against one setup and failing in
remote D1.

**vcqa.** Flag migrations with `REFERENCES`, generated columns, or constraint-heavy schema
changes when tests/docs do not show how those constraints are verified.

**References.** <https://developers.cloudflare.com/d1/reference/migrations/>,
<https://developers.cloudflare.com/d1/sql-api/foreign-keys/>
