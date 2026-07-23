# cloudflare-d1-app

The **gold-standard reference** for the `cloudflare-d1-app` archetype: Cloudflare Workers
or Pages Functions that use D1 through Cloudflare bindings, version SQL migrations, and
deploy with environment-specific database boundaries.

Published by VibeCode QA at:

<https://vibecodeqa.online/standards/cloudflare-d1-app/>

## What this is

This repo is a rubric, not a tutorial. VibeCode QA detects a repo's stack shape, loads the
matching standard, and scores the code against stable rule IDs.

This standard composes:

- Cloudflare Workers or Cloudflare Pages Functions
- Cloudflare D1 bindings and Wrangler migrations
- TypeScript contracts around D1 rows and bindings
- web security query-safety principles
- CI/CD deployment gates

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| `v1` | Cloudflare Workers/Pages Functions + D1 + Wrangler migrations + TypeScript | 2026-07 | 2027-07 | latest |

## Structure

```
docs/
├─ index.md
└─ v1/
   ├─ index.md
   ├─ project-shape-and-bindings.md
   ├─ migrations-and-drift.md
   ├─ environment-and-tenancy.md
   ├─ query-safety-and-types.md
   ├─ local-parity-and-testing.md
   └─ ci-and-deploy-gates.md
```

## Publishing

Content is Markdown in `docs/`; Zensical builds the static site. Registry and central docs
navigation are owned outside this draft and are not changed by this standard tree.
