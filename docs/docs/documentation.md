---
icon: lucide/book-open-text
---

# Documentation site

The VibeCode QA documentation site is built with **Zensical**, not MkDocs.

Zensical is configured in `docs/zensical.toml`. Markdown content lives in `docs/docs/`, and the generated static site is written to `docs/site/`.

## Local build

From the website repository root:

```bash
cd docs
uvx zensical@0.0.43 build
```

The build output appears in:

```text
docs/site/
```

Use the pinned version above so local builds match CI.

## Publishing

The website deploy workflow is `.github/workflows/deploy.yml`.

On pushes to `main`, it:

1. Checks out the website repository.
2. Installs `uv`.
3. Verifies generated standards catalog output is current.
4. Validates standards assessment reports.
5. Builds the Zensical docs site.
6. Validates and builds each published standard KB.
7. Assembles `_site/` with the landing/static website at the root.
8. Copies `docs/site` into `_site/docs`.
9. Copies machine-readable standards metadata into `_site/standards`.
10. Deploys `_site` to Cloudflare Pages project `vibecodeqa`.

That means:

- `index.html`, `tools.html`, `skills.html`, and stack pages publish at the website root.
- Zensical docs publish under `/docs/`.
- Zensical standard rubrics publish under `/standards/<id>/vN/`.
- Machine-readable standards metadata publishes under `/standards/*.json`.
- Navigation for docs pages is controlled by `docs/zensical.toml`.

## Adding docs

Add or edit Markdown files under:

```text
docs/docs/
```

Then add the page to the `nav` array in:

```text
docs/zensical.toml
```

Each page can include front matter for the sidebar icon:

```markdown
---
icon: lucide/wrench
---
```

## What belongs where

Use Zensical docs for canonical product documentation:

- check behavior
- scoring
- CLI reference
- CI setup
- tool delegation
- architecture
- configuration

Use root HTML pages for marketing/product pages:

- landing page
- comparison pages
- stack landing pages
- public tool-decision overview

When behavior changes in the CLI, update both the relevant docs page and any public HTML page that repeats the same claim.
