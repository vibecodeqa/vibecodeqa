---
icon: lucide/calculator
---

# Scoring

VibeCode QA reports one number: a **composite score from 0 to 100**, mapped to a letter grade. It's designed to be stable across codebase sizes — no absolute-count cliffs — so a 200-file app and a 5-file library are graded on the same curve.

## The formula

```text
score = Σ(checkᵢ × weightᵢ) / Σ(weightᵢ)
```

Each check produces a 0–100 sub-score, multiplied by its weight; the weighted sum is divided by the total weight of the checks that ran. Skipped checks (e.g. a React check on a non-React project) are excluded from both sums, so they never penalize you.

## Category weights

| Category | Weight |
|---|---:|
| Foundations | 23% |
| Quality | 26% |
| Testing | 15% |
| Security | 16% |
| AI Readiness | 11% |
| Architecture | 9% |
| AI Analysis | 0% (Pro · informational) |

The five **AI Analysis** checks carry weight 0 — they surface deeper findings (stale docs, contradictory patterns, fake tests) without moving the score.

## Grades

| Grade | Score |
|---|---|
| A | 90–100 |
| B | 80–89 |
| C | 70–79 |
| D | 60–69 |
| F | < 60 |

## Design principles

- **Proportional, not absolute.** Sub-scores scale to codebase size — duplication is a percentage, complexity is per-function, and so on. Adding code never tanks your score just for being bigger.
- **Severity-weighted penalties.** Where a check aggregates many findings (e.g. Best Practices), errors cost more than warnings, which cost more than infos — so missing a nice-to-have doesn't read like a critical bug.
- **Trends over time.** Every scan is saved to `.vibe-check/history/` (last 30). The report shows your score delta, plus new and fixed issues versus the previous run.

See [the 25 checks](checks.md) for each check's weight and what drives its sub-score.
