# VCQA Independent Assessment: VS Code Extension Package Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent D
Target scope: Stack page assessment only
Source target: [`docs/docs/standards/stacks/vscode-extension-package.md`](../../stacks/vscode-extension-package.md)
Live target: <https://vibecodeqa.online/docs/standards/stacks/vscode-extension-package/>
Published assessment URL: <https://vibecodeqa.online/docs/standards/assessments/stacks/vscode-extension-package/>
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

draft - Useful as a planning charter, but not yet strong enough to guide implementation
or assessment without assessor judgment. It identifies the right VS Code-specific risks,
especially activation scope, workspace trust, webviews, and marketplace metadata, but
lacks concrete evidence requirements, severity, exceptions, CI expectations, and
primary-source grounding on the stack page itself.

## Findings

- high: `docs/docs/standards/stacks/vscode-extension-package.md` - No versioned rubric
  exists, so the page cannot yet be used as an authoritative standard.
- medium: `docs/docs/standards/stacks/vscode-extension-package.md` - Rule surface is
  directionally right but too terse to distinguish requirements from examples.
- medium: `docs/docs/standards/stacks/vscode-extension-package.md` - Detection signals
  miss common test/package signals such as `@vscode/test-*`, `vsce`, extension test
  entrypoints, webview CSP strings, and contribution metadata.
- medium: `docs/docs/standards/stacks/vscode-extension-package.md` - Benefit claim
  references `vibecodeqa/vscode`, but this review did not verify that repo or evidence.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope and exclusions | 13/15 | Clear target and exclusions. |
| Composition grounding | 11/15 | Links relevant items: VS Code, TypeScript, Node.js, Web Security. |
| VCQA-owned rule surface | 13/20 | Correct topics listed, but not operationalized. |
| Detection and checkability | 9/15 | Basic signals exist, but test, packaging, and CSP evidence are missing. |
| Evidence and claim backing | 5/10 | Linked item page has upstream references; stack page has no direct citations. |
| CI/evidence expectations | 2/10 | Mentions test coverage but names no CI gates or artifacts. |
| Exceptions and anti-gaming | 1/10 | No exception policy or hollow-compliance checks. |
| Maintenance readiness | 2/5 | Planned status is clear, but no review/version target. |

Total: **56/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/vscode-extension-package.md`
- `docs/docs/standards/items/vscode-extension.md`
- `docs/docs/standards/items/typescript.md`
- `docs/docs/standards/items/node.md`
- `docs/docs/standards/items/web-security.md`

## Claims Not Proven

- `vibecodeqa/vscode` is represented by this stack.
- The listed detection signals are sufficient for reliable scanner behavior.
- Extension test coverage expectations are known.

## Required Fixes

- Add concrete CI gates: typecheck, extension-host tests, packaging validation, and webview
  CSP checks where applicable.
- Define severity for unsafe activation, workspace trust bypass, broad command/file access,
  and weak webview messaging.
- Add exception policy for generated code, sample commands, dev-only webviews, and
  marketplace-only metadata gaps.

## Useful Follow-ups

- Create `ref-vscode-extension-package`.
- Add primary links to VS Code activation events, workspace trust, webview security, and
  publishing docs.
