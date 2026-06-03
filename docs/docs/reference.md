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
| `vcqa fix [path]` | Auto-fix (.gitignore, strict mode, Biome/ESLint) + 30+ fix suggestions |
| `vcqa explain [check]` | Deep-dive a check: what / risk / fix / go-deeper |
| `vcqa monitor [path]` | Live quality control panel — re-scans on file changes |

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
| `--upload` | Upload the report to the dashboard (needs `VCQA_TOKEN`) |
| `--watch` | Re-scan on file changes |
| `-v`, `--version` | Print version |
| `-h`, `--help` | Show help |

## The `monitor` TUI

A full-screen control panel that re-scans on change. Keys:

| Key | Action |
|---|---|
| `↑ ↓` / `Enter` / `Esc` | Navigate (check → issue → source) / back |
| `Tab` | Switch the Checks / Issues panel |
| `/` | Search and filter issues |
| `y` | Copy an AI fix-prompt to the clipboard |
| `r` | Re-scan now |
| `f` · `g` · `t` · `c` | Files · git changes · trends · config |
| `?` | Keyboard help overlay |
| `q` | Quit |

## Output files

All output lands in `.vibe-check/`:

```
.vibe-check/
├── report/index.html   # multi-page HTML report
├── report.json         # full machine-readable report
├── report.sarif        # with --sarif
├── badge.svg           # with --badge
└── history/            # last 30 runs, for trends
```

## JSON shape

```json
{
  "version": "0.38.x",
  "score": 92,
  "grade": "A",
  "checks": [
    { "name": "complexity", "score": 78, "grade": "C", "issues": [ /* … */ ] }
  ],
  "meta": { "stack": { /* … */ }, "workspace": { /* … */ }, "duration": 5200 }
}
```

Read it programmatically:

```js
const report = JSON.parse(fs.readFileSync(".vibe-check/report.json", "utf-8"));
console.log(`${report.grade} ${report.score}/100`);
for (const c of report.checks) {
  if (c.issues.length) console.log(`${c.name}: ${c.issues.length} issues`);
}
```
