# GitHub Action Package

A GitHub Action package exposes reusable workflow automation through `action.yml`.

## Upstream references

- [Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)
- [Creating actions](https://docs.github.com/en/actions/sharing-automations/creating-actions)
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

## What upstream owns

- metadata syntax
- JavaScript/composite/Docker action mechanics
- workflow integration behavior

## What VCQA owns

- action.yml quality.
- input/output contract.
- token/permission guidance.
- pinning/versioning checks.

## Detection signals

- `action.yml` or `action.yaml`
- Node action entrypoint
- workflow examples

## Composed standards

- [GitHub Action Package](../stacks/github-action-package.md)

## Combination-born guidelines

- GitHub Action plus Node requires validated inputs before side effects.
- GitHub Action plus TypeScript requires compiled output and source maps/release policy.
- GitHub Action plus CI security requires minimum permissions documented in examples.
