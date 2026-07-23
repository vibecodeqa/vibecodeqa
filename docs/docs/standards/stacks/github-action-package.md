# GitHub Action Package

**Status:** Planned charter

Reusable GitHub Actions published through `action.yml` and consumed by workflows.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

Reusable GitHub Actions published through `action.yml` and consumed by workflows.

## Not in scope

- ordinary workflows in `.github/workflows`
- CLIs that are not packaged as actions
- GitHub Apps

## Composes

- [GitHub Action Package](../items/github-action.md)
- [GitHub Actions](../items/github-actions.md)
- [Node.js](../items/node.md)
- [TypeScript](../items/typescript.md)

## VCQA-owned rule surface

- action.yml metadata completeness.
- minimum token permissions.
- input validation.
- pinned runtime/dependency policy.
- release tag policy.

## Detection signals

- `action.yml` or `action.yaml`
- Node/composite/Docker action runtime
- workflow examples

## Combination-born guidelines

- Document minimum `GITHUB_TOKEN` permissions for every example workflow.
- Inputs are validated before filesystem, network, or deployment side effects.
- Release tags and built artifacts must make consumer pinning reliable.

## Benefits

- vibecodeqa/action.
