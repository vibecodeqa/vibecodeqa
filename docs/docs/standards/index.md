# Standards

VibeCode QA standards are the reviewable rules a project is judged against after its
stack has been detected.

The important boundary is this: VibeCode QA does **not** re-create broad framework
doctrine. React, TypeScript, WCAG, OWASP, Cloudflare, MCP, GitHub Actions, and other
ecosystem authorities already publish the broad rules. VibeCode QA cites those sources,
then owns the stack-specific glue:

- repository and slice shape
- runtime and deployment constraints
- detection mapping
- exception policy
- anti-patterns a scanner or AI judge should flag

```text
upstream standards + stack items + deploy/runtime seams = VCQA rubric
```

## Pages in this section

- [References](references.md): official specs and primary-source docs to cite before
  writing a VibeCode QA rule.
- [Compositions](compositions.md): individual stack items and the composed standards we
  should author next.

## Machine-readable files

- [`/standards/references.json`](/standards/references.json): external source registry.
- [`/standards/compositions.json`](/standards/compositions.json): composition map.
- [`/standards/registry.json`](/standards/registry.json): current resolver catalog.

## Authored rubrics

Only one rubric is authored today:

- [React SPA](/standards/react-spa/): React, client-rendered, static-hosted. Edition v1.

The next standards to author are stack-shaped: `cloudflare-pages-fullstack`,
`cloudflare-d1-app`, `cloudflare-worker-mcp-server`,
`tenant-deployed-cloudflare-saas`, `node-cli-internal-tool`, `typescript-sdk`, and
`zensical-kb-site`.
