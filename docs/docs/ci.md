---
icon: lucide/git-pull-request
---

# CI integration

VibeCode QA is built to gate pull requests. It exits non-zero when the score drops below a threshold, posts PR comments, and emits GitHub-native annotations and SARIF.

## Quality gate

```bash
npx @vibecodeqa/cli --ci --fail-under 80
```

- `--ci` enables CI mode: exit 1 if the score is below the threshold. The threshold is `--fail-under N` if given, else `failUnder` from `.vcqa.json` / `package.json#vcqa`, else 60.
- `--fail-under N` sets your own threshold and overrides the config value.
- The CI output names the threshold and where it came from, e.g. `Passing: score 84 ≥ 80 (config)` or `Failing: score 72 < 80 (config)`.
- `--skip-tests` speeds up the scan when your pipeline runs tests separately.

## GitHub Actions

```yaml
name: Code health
on: [pull_request]

jobs:
  vibecodeqa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
        with: { node-version: 24 }
      - run: npx @vibecodeqa/cli@0.54.4 --ci --fail-under 80 --annotations --sarif
      - uses: github/codeql-action/upload-sarif@b0c4fd77f6c559021d78430ec4d0d169ae74a4eb # v3
        if: always()
        with:
          sarif_file: .vibe-check/report.sarif
```

- `--annotations` emits `::warning`/`::error` annotations inline on the diff.
- `--sarif` writes `report.sarif` for the GitHub **Security → Code scanning** tab.

## PR comments

```bash
npx @vibecodeqa/cli --pr-comment
```

Posts the score, trend delta, and top issues as a single PR comment (upserted — it edits its own comment instead of stacking new ones). Needs `GITHUB_TOKEN` in the environment.

## Scan only changed files

```bash
npx @vibecodeqa/cli --diff origin/main
```

Restricts issues to files changed versus a base ref — ideal for large repos where you only want to gate new work.

## Track scores over time

```bash
npx @vibecodeqa/cli --upload
```

Uploads the report to your dashboard at app.vibecodeqa.online (needs `VCQA_TOKEN`). Locally, every scan is already saved to `.vibe-check/history/` for trend charts in the HTML report.

`VCQA_TOKEN` is a VibeCode QA platform token. The CLI falls back to `GITHUB_TOKEN` when `VCQA_TOKEN` is unset and sends it as the bearer token to `api.vibecodeqa.online`; whether the dashboard accepts a GitHub token is decided server-side, which this repository cannot verify from the CLI source. Upload also needs a git remote — without one the CLI skips the upload and says so.

See the [CLI reference](reference.md) for the full flag list.

!!! info "Last verified"
    The `--ci` / `--fail-under` / `failUnder` precedence was verified on **2026-10-05** against the CLI source in vibecodeqa/cli#109, which ships in the first release after 0.56.0. The rest of the flags and CI behaviour on this page were verified against `@vibecodeqa/cli` **0.54.4** on **2026-08-08** by reading the CLI source. Dashboard-side behaviour at `api.vibecodeqa.online` was not verified.
