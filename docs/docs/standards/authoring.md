# Standards Authoring

This page defines how VibeCode QA standards are created, reviewed, and published. It keeps standards reproducible for scanners and readable for humans.

## Artifact types

| Artifact | Location | Purpose |
|---|---|---|
| Stack item | `docs/docs/standards/items/<id>.md` | Explain what upstream owns and what VCQA owns when a technology appears in a stack. |
| Stack charter | `docs/docs/standards/stacks/<id>.md` | Define scope, detection, references, and combination-born rules before a full rubric exists. |
| Full rubric | `standards/<id>/docs/vN/*.md` | Versioned, judgeable standard with stable rule IDs. |
| Registry metadata | `standards/*.json` | Machine-readable IDs, references, URLs, status, and editions. |

## Naming

Use deployable stack IDs, not generic framework IDs, for full standards. Good examples: `react-spa`, `cloudflare-pages-fullstack`, `cloudflare-worker-mcp-server`. Avoid publishing generic replacements for upstream framework doctrine. Cross-cutting standards such as `typescript` are allowed only when they define VCQA-owned, checkable glue across many stack shapes.

Aliases are allowed only when a term was used previously. For example, `react-spa-static` is an alias for `react-spa`, not a separate standard.

## Edition lifecycle

Standards are versioned on material change, not by calendar date.

- `v1` is the first published judgeable rubric.
- `v2` is cut when a rule meaning changes, a major ecosystem shift changes best practice, or an old verdict would become misleading.
- Review dates are updated when the edition remains valid after re-review.
- Rule IDs never change meaning inside an edition. Retire or replace rules in the next edition.

Each edition front page should include targets, reviewed date, next review due, status, and pin string. See [React SPA v1](/standards/react-spa/v1/) as the current exemplar.

Edition lifecycle metadata lives in `standards/registry.json`. Each edition declares
whether it is deprecated, what edition supersedes it when relevant, and any errata or
changelog entries. Reports and scans must cite pinned `/standards/<id>/vN/` URLs, never
`/latest`.

## Generated catalog workflow

The catalog surfaces are generated from the metadata registries while the explanatory prose
around them remains hand-authored. Generated regions are marked with
`BEGIN GENERATED:*` and `END GENERATED:*` comments — HTML comments in Markdown and HTML,
`#` comments in `docs/zensical.toml`.

Field ownership across `registry.json`, `compositions.json`, and `references.json` is
defined in [`standards/SCHEMA.md`](https://github.com/vibecodeqa/vibecodeqa/blob/main/standards/SCHEMA.md).
Repeated fields are derived mirrors and the validator fails when two copies disagree.

When adding or changing a standard:

1. Update `standards/registry.json`, `standards/compositions.json`, and
   `standards/references.json` first. Every standard needs a `title`, and every stack item
   needs a `title` — catalog surfaces and the docs sidebar render them verbatim rather than
   guessing a display name from the id.
2. Run `node standards/generate-catalog.mjs`.
3. Run `node standards/validate-registry.mjs`.
4. Author or revise the stack charter or rubric Markdown.
5. Do not manually edit generated catalog tables, stack/item indexes, root standards
   landing inventories, the "Supported stacks" authored-rubric list, the generated docs
   navigation blocks, graph content/data, rubric related-standard sections, or
   reference implementation inventories.

A catalog page under `docs/docs/standards/stacks/` or `docs/docs/standards/items/` with no
metadata entry behind it fails validation: it would be missing from every generated index,
the graph, and the sidebar.

CI runs `node standards/generate-catalog.mjs --check` and fails if generated output is
stale.

## Rule shape

Each full-rubric rule uses a stable ID: `R-<AREA>-<n>`.

Rules must follow the shared [rule contract](rule-contract.md): severity, evidence, and
accepted exceptions are part of the rule, not reviewer guesswork.

Required fields:

- **Severity:** `blocker`, `high`, `medium`, `low`, or `evidence-only`, with escalation
  conditions when context changes impact.
- **Rule:** one checkable statement.
- **Why:** the reason the rule exists, usually tied to the stack shape.
- **Evidence:** source paths, config files, CI artifacts/logs, deployed URL checks,
  screenshots/traces, runtime transcripts, package artifacts, or other concrete proof
  required to judge the rule.
- **Exception:** whether an exception is allowed and, if so, the accepted exception format:
  owner, scope, environment/tenant, reason, compensating controls, evidence,
  expiry/review date, and approval trail.
- **Good/bad examples:** small code or config examples when practical.
- **vcqa:** the scanner or judge signal: dependency, config key, file pattern, AST/code pattern, or human-review note.
- **References:** upstream sources when the rule depends on external authority.

## Charter template

```markdown
# <Standard title>

**Status:** Planned charter

<One paragraph scope statement.>

## Full rubric

No full versioned rubric has been authored yet.

## Scope

- ...

## Not in scope

- Generic upstream framework doctrine.
- Rules owned by another more specific VCQA standard.

## Composes

- [Stack item](../items/<id>.md)

## VCQA-owned rule surface

- ...

## Detection signals

- ...

## Combination-born guidelines

- ...

## Benefits

- ...
```

## Full rubric template

```text
standards/<id>/
  README.md
  zensical.toml
  docs/
    index.md
    v1/
      index.md
      project-shape.md
      runtime-and-deploy.md
      security.md
      testing.md
```

The edition index maps every rubric area and names the non-negotiables. Each area page contains stable `R-<AREA>-<n>` rules.

## Publishing checklist

- [ ] Upstream references are cited instead of paraphrased as generic doctrine.
- [ ] The standard is stack-shaped and detectable.
- [ ] Combination-born guidelines are explicit.
- [ ] Rule IDs are stable and checkable.
- [ ] Rule pages use the shared severity, evidence, and exception contract.
- [ ] JSON registry entries include docs URL, pinned rubric URL when authored, status,
      aliases, latest edition, and edition lifecycle metadata.
- [ ] Generated catalog output has been refreshed with `node standards/generate-catalog.mjs`.
- [ ] Zensical build passes.
