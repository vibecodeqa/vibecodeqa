---
icon: lucide/calculator
---

# Scoring

VibeCode QA reports one number: a **composite score from 0 to 100**, mapped to a letter grade. It's designed to be stable across codebase sizes — no absolute-count cliffs — so a 200-file app and a 5-file library are graded on the same curve.

## The formula

```text
score = Σ(checkᵢ × weightᵢ) / Σ(weightᵢ)
```

Each check produces a 0–100 sub-score, multiplied by its weight; the weighted sum is divided by the total weight of the checks that ran. Checks that did not contribute are excluded from both sums, so they never penalize you: checks skipped as not applicable (e.g. the React check on a non-React project), Pro checks that are unavailable without a `VCQA_PRO_KEY`, synthetic checks derived from another check's data, and checks a project disabled in `.vcqa.json`.

## Category weights

| Category | Weight |
|---|---:|
| Foundations | 23% |
| Quality | 30% |
| Security | 16% |
| Testing | 13% |
| Architecture | 9% |
| LLM Readiness | 9% |
| AI Analysis | 0% (Pro · informational) |

The seven **AI Analysis** checks carry weight 0 — they surface deeper findings (stale docs, contradictory patterns, fake tests) without moving the score. Several platform-specific checks (`flutter`, `html-quality`, `container-health`, `cloudflare-workers`, `sqlite-d1`) also carry weight 0 today: they report findings without moving the score.

## Grades

| Grade | Score |
|---|---|
| A | 90–100 |
| B | 75–89 |
| C | 60–74 |
| D | 40–59 |
| F | < 40 |

The grade is presentation only. CI gating uses a score threshold, not a grade: `--ci`
fails under 60 unless `--fail-under N` sets your own number.

## Design principles

- **Proportional, not absolute.** Sub-scores scale to codebase size — duplication is a percentage, complexity is per-function, and so on. Adding code never tanks your score just for being bigger.
- **Severity-weighted penalties.** Where a check aggregates many findings (e.g. Best Practices), errors cost more than warnings, which cost more than infos — so missing a nice-to-have doesn't read like a critical bug.
- **Trends over time.** Every scan is saved to `.vibe-check/history/` (last 30). The report shows your score delta, plus new and fixed issues versus the previous run.

See [the 38 checks](checks.md) for each check's weight and what drives its sub-score.

!!! info "Last verified"
    Weights and category totals verified against `@vibecodeqa/cli` **0.54.4** on **2026-08-08**, by reading the `CHECK_META` table in `@vibecodeqa/schema` and running a real scan.
