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
- `--checks a,b,c` runs only selected checks when you need a narrower gate.

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
      - run: npx @vibecodeqa/cli@0.44.0 --ci --fail-under 80 --annotations --sarif
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

`VCQA_TOKEN` is a VibeCode QA platform token. The uploader does not accept a repository `GITHUB_TOKEN`; dashboard writes are authenticated separately from GitHub Actions so reports cannot be spoofed for arbitrary repos.

See the [CLI reference](reference.md) for the full flag list.
