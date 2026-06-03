---
icon: lucide/git-pull-request
---

# CI integration

VibeCode QA is built to gate pull requests. It exits non-zero when the score drops below a threshold, posts PR comments, and emits GitHub-native annotations and SARIF.

## Quality gate

```bash
npx @vibecodeqa/cli --ci --fail-under 80
```

- `--ci` enables CI mode (exit 1 if score < 60 by default).
- `--fail-under N` sets your own threshold.
- `--skip-tests` speeds up the scan when your pipeline runs tests separately.

## GitHub Actions

```yaml
name: Code health
on: [pull_request]

jobs:
  vibecodeqa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24 }
      - run: npx @vibecodeqa/cli --ci --fail-under 80 --annotations --sarif
      - uses: github/codeql-action/upload-sarif@v3
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

See the [CLI reference](reference.md) for the full flag list.
