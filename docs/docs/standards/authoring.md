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

Use deployable stack IDs, not generic framework IDs, for full standards. Good examples: `react-spa`, `cloudflare-pages-fullstack`, `cloudflare-worker-mcp-server`. Avoid publishing a generic `react` or `typescript` standard; those are stack items backed by upstream references.

Aliases are allowed only when a term was used previously. For example, `react-spa-static` is an alias for `react-spa`, not a separate standard.

## Edition lifecycle

Standards are versioned on material change, not by calendar date.

- `v1` is the first published judgeable rubric.
- `v2` is cut when a rule meaning changes, a major ecosystem shift changes best practice, or an old verdict would become misleading.
- Review dates are updated when the edition remains valid after re-review.
- Rule IDs never change meaning inside an edition. Retire or replace rules in the next edition.

Each edition front page should include targets, reviewed date, next review due, status, and pin string. See [React SPA v1](/standards/react-spa/v1/) as the current exemplar.

## Rule shape

Each full-rubric rule uses a stable ID: `R-<AREA>-<n>`.

Required fields:

- **Rule:** one checkable statement.
- **Why:** the reason the rule exists, usually tied to the stack shape.
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
- [ ] JSON registry entries include docs URL, rubric URL when authored, status, aliases, and latest edition.
- [ ] Zensical build passes.
