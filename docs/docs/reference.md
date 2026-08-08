---
icon: lucide/terminal
---

# CLI reference

```bash
npx @vibecodeqa/cli [command] [path] [flags]
```

With no command it scans the current directory. In an interactive terminal the scan ends with the top issues, your weakest areas (each with the exact `explain` command), and a prompt to open the live monitor or the HTML report.

## Commands

| Command | What it does |
|---|---|
| `vcqa [path]` | Scan and generate a report |
| `vcqa init [path]` | Set up a CI workflow + recommended configs |
| `vcqa fix [path]` | Auto-fix (.gitignore, strict mode, Biome/ESLint) + fix suggestions |
| `vcqa explain [check]` | Deep-dive a check: what / risk / fix / go-deeper |
| `vcqa monitor [path]` | Live quality control panel — re-scans on file changes |

`fix` takes three flags of its own: `--ai` (use Claude for the remaining issues; needs `ANTHROPIC_API_KEY`), `--check NAME` (only fix issues from one check), and `--dry-run` (show what the AI would change without writing).

## Flags

| Flag | Effect |
|---|---|
| `--skip-tests` | Skip test execution (faster scan) |
| `--ci` | CI mode (exit 1 if score < 60) |
| `--fail-under N` | Exit 1 if score below `N` |
| `--json` | Output JSON only (no terminal UI) |
| `--markdown` | Output a Markdown summary |
| `--badge` | Generate an SVG badge |
| `--sarif` | Generate SARIF for GitHub Code Scanning |
| `--top [N]` | Show the top N issues to fix (default 5) |
| `--diff [base]` | Only report issues in changed files |
| `--pr-comment` | Post score as a GitHub PR comment (needs `GITHUB_TOKEN`) |
| `--annotations` | Emit GitHub Actions `::warning`/`::error` annotations |
| `--upload` | Upload the report to the dashboard (uses `VCQA_TOKEN`, falling back to `GITHUB_TOKEN`) |
| `--watch` | Re-scan on file changes |
| `-v`, `--version` | Print version |
| `-h`, `--help` | Show help |

## The `monitor` TUI

A full-screen control panel that re-scans on change. It shows score movement, issue activity, git-changed files, file issue hotspots, and score trends.

The codebase heatmap is a feature of the separate **VibeCode Monitor** desktop app, not of this terminal panel.

Keys:

| Key | Action |
|---|---|
| `↑ ↓` / `Enter` / `Esc` | Navigate (check → issue → source) / back |
| `Tab` | Switch the Checks / Issues panel |
| `/` | Search and filter issues |
| `y` | Copy an AI fix-prompt to the clipboard |
| `r` | Re-scan now |
| `f` · `g` · `t` · `c` | All files by issue count · git-changed files · score trends · config |
| `?` | Keyboard help overlay |
| `q` · `Ctrl-C` | Quit |

## Output files

All output lands in `.vibe-check/`:

```
.vibe-check/
├── report/index.html   # multi-page HTML report (skipped with --json)
├── report.json         # full machine-readable report (always written)
├── report.sarif        # with --sarif
├── badge.svg           # with --badge
└── history/            # last 30 runs, for trends (older files are pruned)
```

## JSON shape

```json
{
  "version": "0.54.4",
  "timestamp": "2026-08-08T08:50:13.945Z",
  "score": 92,
  "grade": "A",
  "checks": [
    {
      "name": "complexity",
      "score": 78,
      "grade": "C",
      "status": "failed",
      "duration": 41,
      "details": { /* per-check facts */ },
      "issues": [ /* … */ ]
    }
  ],
  "meta": {
    "cwd": "/path/to/repo",
    "node": "v24.4.0",
    "duration": 5200,
    "filesScanned": 214,
    "stack": { /* … */ },
    "workspace": { /* … */ },
    "scanPolicy": { /* … */ },
    "fileInventory": { /* … */ },
    "analyzerSnapshots": [ /* … */ ],
    "repoUrl": "https://github.com/owner/repo",
    "branch": "main"
  }
}
```

`status` is one of `passed`, `failed`, `skipped`, or `unavailable`. Only checks that
contribute weight are counted in the composite score, so a `skipped` (not applicable) or
`unavailable` (Pro key missing) check never lowers it.

Read it programmatically:

```js
const report = JSON.parse(fs.readFileSync(".vibe-check/report.json", "utf-8"));
console.log(`${report.grade} ${report.score}/100`);
for (const c of report.checks) {
  if (c.issues.length) console.log(`${c.name}: ${c.issues.length} issues`);
}
```

!!! info "Last verified"
    Commands, flags, output paths, monitor keys, and the JSON shape on this page were verified against `@vibecodeqa/cli` **0.54.4** on **2026-08-08**, by reading the CLI source and running a real scan.
