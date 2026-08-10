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
   navigation blocks, graph content/data, rubric related-standard sections, charter status
   or maintenance blocks, or reference implementation inventories.

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

### How the contract is enforced

`standards/validate-rule-contract.mjs` runs on every deploy. It derives the rubrics it checks
from `standards/registry.json` — every `status: published` standard owned by this repo, mapped
from its versioned `standardUrl` to `standards/<id>/docs/<edition>/index.md` — so **publishing
a standard enrols its rubric automatically**. There is no list to remember to extend.

Each enrolled rubric index must carry a `## Severity and evidence defaults` section assigning
a default severity and required evidence per rule group, plus a reference to the shared
`acceptedException` template. That index-level table is the contract's documented shortcut for
rubrics that do not repeat `**Severity.**` on every rule page.

A rubric that is not there yet must be named in the `pendingRuleContract` set inside that
script, with a reason. The set is allowed to shrink and not to grow: adding a newly published
standard to it, rather than writing its defaults table, is how the contract became decorative
the first time.

## Authored charter bar

A charter page is the entry point for a standard. Once a standard is **authored** — its
registry status is `published` and a versioned rubric exists — its charter page must be
usable on its own: a reader should be able to decide whether the stack applies to them,
what it will judge, what it will not, and where the evidence is, **without opening a single
rubric chapter first**.

Authored stack charter pages therefore carry these sections. `validate-registry.mjs` fails
the build when one is missing, so the bar is enforced rather than aspirational.

| Section | What it must answer |
|---|---|
| `## Full rubric` | Where the judgeable rules live. |
| `## Reference implementation` | Which repo demonstrates the stack, with the generated `reference-evidence` block for its score provenance. |
| `## Reference template map` | The evidence map: file-by-file, which part of the reference repo proves which part of the contract. |
| `## What this teaches` | The teaching focus. Why this stack shape exists and which failure it keeps preventing — not a feature list. |
| `## Decision matrix` | Applicability boundaries as a table: for each adjacent need, the standard that fits better. |
| `## Scope` / `## Not in scope` | The one-paragraph boundary and its explicit exclusions. |
| `## Upstream references` | The external authorities the standard cites instead of restating. |
| `## Composes` | Stack items and standards this one builds on. |
| `## VCQA-owned rule surface` | What VCQA owns that upstream does not. |
| `## Detection signals` | How a resolver recognises the stack. |
| `## Combination-born guidelines` | Rules that exist only because these pieces are combined. |
| `## Rule highlights` | The handful of rules that decide whether a repo is this archetype at all. |
| `## Limitations` | What the standard honestly cannot judge, and where a check degrades to evidence-only. A charter with no limitations section is overselling. |
| `## Anti-patterns` | The failures this standard exists to catch, stated as behaviour. |
| `## Benefits` | Where the standard is already used. |
| `## Maintenance` | Edition, review dates, targets, and lifecycle. Generated from `registry.json` into a `charter-maintenance` block — never hand-written. |
| `## Independent Assessment` | The dated assessment of this page. |

Two of those sections are generated and must not be hand-edited: `reference-evidence`
(score provenance, see [`standards/SCHEMA.md`](https://github.com/vibecodeqa/vibecodeqa/blob/main/standards/SCHEMA.md))
and `charter-maintenance` (edition and review metadata). Add the fence markers to a new
authored charter page and run the generator; it fills them in.

Planned charters use the lighter template below, graded by the maturity states in the next
section. Nothing on this page is a reason to delete an existing page: a charter that has not
reached the authored bar keeps its URL and is labelled honestly instead.

## Planned charter maturity states

"Planned" was one word covering two very different artifacts: a charter with governed
candidate rules and a scored reference repo, and a note nobody has touched since it was filed.
Readers could not tell them apart, so a backlog entry read like a standard.

Every registry entry therefore declares a `maturity` alongside its `status`, and a
`maturityNote` giving the reason for that state and what blocks promotion. The generator
renders both onto the charter page and into every catalog surface that lists planned work.

| Maturity | The page carries | What it is good for |
|---|---|---|
| `backlog` | A scope statement and detection signals, at most. | Making the resolver name the right standard in a gap report. Nothing here is judgeable, and nobody is working toward a rubric. |
| `draft-charter` | Scope, Not in scope, Composes, VCQA-owned rule surface, Detection signals, Combination-born guidelines. | Planning and scoping. A reader can tell whether the stack applies; they cannot review a repository against it. |
| `candidate-rubric` | Everything above, plus Teaching focus, Upstream references, numbered Candidate rules, Severity and evidence, Exception policy, Anti-patterns, Promotion criteria, Review cadence. | Reviewing a repository with a named assessor, and cutting a `vN` rubric once the promotion criteria are met. |
| `authored-rubric` | The full [authored charter bar](#authored-charter-bar) above, and a published `/standards/<id>/vN/` rubric. | Being cited rule-by-rule by a scan or a report. |

Rules:

- `maturity: authored-rubric` is required for, and only for, registry `status: published`.
  The two cannot disagree.
- `maturityNote` is required for every other state. It names the reason and the blocker in
  concrete terms — a missing reference repo, an archived consumer, an unwritten rule set — not
  "work in progress".
- Promotion is earned by the page, not granted by intent. `validate-registry.mjs` fails the
  build when a charter claims a state whose sections it does not carry.
- Demotion is a normal outcome. A charter whose only cited consumer has been archived belongs
  in `backlog` with the reason recorded, and it keeps its published URL so nothing 404s.
- A `candidate-rubric` charter states its own **promotion criteria**: exactly what must be true
  before a `v1` is cut. "Needs more work" is not a promotion criterion; "every rule judged
  against a named commit of the reference repo" is.
- A `candidate-rubric` charter states a **review cadence** tied to events and to the date of
  its most recent assessment report, rather than a hand-typed date that rots.

Planned charter pages carry a generated `charter-status` block instead of a hand-written
status line. Add the fence markers and run the generator; it fills in the state, what the
state means, whether a reference implementation actually exists, and the promotion blocker.

## Charter template

This is the `draft-charter` shape. A `candidate-rubric` page adds Teaching focus, Upstream
references, Candidate rules, Severity and evidence, Exception policy, Anti-patterns, Promotion
criteria, and Review cadence; see
[Node CLI Internal Tool](stacks/node-cli-internal-tool.md) as the current exemplar.

```markdown
# <Standard title>

<One paragraph scope statement.>

## Charter status

<!-- BEGIN GENERATED:charter-status -->
<!-- END GENERATED:charter-status -->

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
