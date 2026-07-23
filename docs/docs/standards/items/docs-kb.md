# Docs KB

Docs KB covers Markdown source, docs navigation, architecture records, and published knowledge bases.

## Upstream references

- [Zensical Documentation](https://zensical.org/docs/)
- [Diataxis](https://diataxis.fr/)
- [Architecture Decision Records](https://github.com/joelparkerhenderson/architecture-decision-record)
- [The C4 Model](https://c4model.com/)

## What upstream owns

- Zensical authoring behavior
- Diataxis content model
- ADR and C4 documentation patterns

## What VCQA owns

- docs source/build separation.
- ADR freshness checks.
- published KB access policy.
- architecture drift gates.

## Detection signals

- `zensical.toml`
- docs Markdown tree
- docs build/deploy workflow

## Composed standards

- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)
- [Tauri React Desktop](../stacks/tauri-react-desktop.md)
- [Zensical KB Site](../stacks/zensical-kb-site.md)

## Combination-born guidelines

- Zensical plus standards publishing requires Markdown as source of truth and generated site ignored.
- Docs KB plus registry JSON requires stable URLs for both humans and tools.
- Docs KB plus architecture checks requires ADR freshness and drift review.
