---
icon: lucide/settings
---

# Configuration

VibeCode QA runs with **zero configuration**. When you want to tailor it — disable a check, skip generated files, set a CI threshold — add a `.vcqa.json` file to your project root (or a `"vcqa"` field in `package.json`). Running [`vcqa init`](reference.md) scaffolds one for you.

## `.vcqa.json`

```json
{
  "checks": {
    "confusion": { "enabled": false },
    "duplication": { "ignore": ["src/generated/**"] }
  },
  "ignore": ["vendor/**", "*.generated.ts"],
  "failUnder": 70
}
```

| Option | Effect |
|---|---|
| `checks.<name>.enabled` | Set `false` to turn a check off (default `true`). Disabled checks are excluded from the [score](scoring.md), never counted against you. |
| `checks.<name>.ignore` | File patterns skipped **for that one check**. |
| `ignore` | Global file patterns skipped by **every** check. |
| `failUnder` | Exit code 1 if the score is below this. The `--fail-under` flag overrides it. |

Use any check's `name` (the lowercase id, e.g. `complexity`, `duplication`, `react`). See [the 25 checks](checks.md) for the full list.

## Ignore patterns

Patterns are matched against each file path relative to the project root, in three forms:

| Pattern | Matches |
|---|---|
| `dir/**` | any file under `dir/` |
| `*.ext` | any file ending in `.ext` |
| `prefix` | any path that starts with `prefix` |

```json
{
  "ignore": ["dist/**", "*.gen.ts", "src/legacy"]
}
```

## In `package.json`

Instead of a separate file, put the same object under a `"vcqa"` key:

```json
{
  "vcqa": { "failUnder": 80, "checks": { "docs": { "enabled": false } } }
}
```

## What `vcqa init` creates

`vcqa init` scaffolds a project for CI and never overwrites existing files:

- `.github/workflows/vibecodeqa.yml` — a CI quality-gate workflow
- `biome.json` — recommended lint/format config
- `.vcqa.json` — this config, pre-filled with every check name
- `.gitignore` — adds `.vibe-check/`

See the [CLI reference](reference.md) and [CI integration](ci.md) for next steps.
