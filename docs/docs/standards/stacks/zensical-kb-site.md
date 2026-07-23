# Zensical KB Site

**Status:** Planned charter

Markdown-authored documentation or knowledge-base sites built with Zensical and published as static docs.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

Markdown-authored documentation or knowledge-base sites built with Zensical and published as static docs.

## Not in scope

- marketing pages authored directly in HTML
- unpublished internal notes
- generic writing style guides

## Composes

- [Docs KB](../items/docs-kb.md)
- [GitHub Actions](../items/github-actions.md)

## VCQA-owned rule surface

- Markdown source is the source of truth.
- generated site is ignored.
- published URLs are stable.
- source references are tracked.
- docs drift checks where mirrors exist.

## Detection signals

- `zensical.toml`
- Markdown docs tree
- docs build/deploy workflow

## Combination-born guidelines

- Markdown source is the source of truth; generated `site/` output is not manually edited.
- External standards and machine-readable registries need stable public URLs.
- Navigation must expose authored standards and planned charters without guessed URLs.

## Benefits

- vibecodeqa/docs.
- vibecodeqa/standards.
- crm/docs.
