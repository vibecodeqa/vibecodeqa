# VCQA Independent Assessment: Tauri React Desktop Stack Page

Date: 2026-07-25
Assessor: Independent AI Agent D
Target scope: Stack page assessment only
Source target: [`docs/docs/standards/stacks/tauri-react-desktop.md`](../../stacks/tauri-react-desktop.md)
Live target: <https://vibecodeqa.online/docs/standards/stacks/tauri-react-desktop/>
Published assessment URL: <https://vibecodeqa.online/docs/standards/assessments/stacks/tauri-react-desktop/>
Commit: `e47a3d44ed97f2b52d7a12a97387796564503ad6`

## Verdict

draft - The charter captures the right high-risk boundaries for a Tauri app, especially
native command capability, secret storage, packaging/signing, and frontend/backend typing.
It is still only a thin planning note: no platform matrix, no CI evidence model, no
exception policy, and no concrete scanner rules for Tauri config, Rust commands, or
permissions.

## Findings

- high: `docs/docs/standards/stacks/tauri-react-desktop.md` - No full rubric exists; this
  is not yet assessable as a standard.
- medium: `docs/docs/standards/stacks/tauri-react-desktop.md` - `Docs KB` composition may
  be valid for VCQA's desktop monitor, but docs are not inherent to the Tauri React stack
  and need justification.
- medium: `docs/docs/standards/stacks/tauri-react-desktop.md` - Detection signals are
  incomplete; they omit Cargo/Tauri config variants, capabilities, permissions, Rust
  command annotations, updater/signing config, and platform packaging files.
- medium: `docs/docs/standards/stacks/tauri-react-desktop.md` - Rule surface names
  important areas but does not define required evidence or failure severity.

## Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| Scope and exclusions | 13/15 | Clear Tauri/React/TypeScript scope and exclusions. |
| Composition grounding | 11/15 | Strong links to Tauri, React, TypeScript, Web Security; Docs KB needs rationale. |
| VCQA-owned rule surface | 14/20 | High-risk desktop boundaries are identified. |
| Detection and checkability | 8/15 | Basic `src-tauri/` detection exists; real scanner surfaces are underspecified. |
| Evidence and claim backing | 4/10 | Tauri item links upstream docs; stack page does not cite specifics. |
| CI/evidence expectations | 1/10 | No test/build/signing/package gates are named. |
| Exceptions and anti-gaming | 1/10 | No policy for dev builds, unsigned local builds, mock commands, generated code, or demo apps. |
| Maintenance readiness | 2/5 | Planned status is explicit, but no edition/review schedule. |

Total: **54/100**

## Evidence Reviewed

- `docs/docs/standards/assessment.md`
- `docs/docs/standards/stacks/tauri-react-desktop.md`
- `docs/docs/standards/items/tauri.md`
- `docs/docs/standards/items/react.md`
- `docs/docs/standards/items/typescript.md`
- `docs/docs/standards/items/web-security.md`
- `docs/docs/standards/items/docs-kb.md`

## Claims Not Proven

- `vibecodeqa/app desktop monitor` currently follows this shape.
- Keychain storage, signing, and filesystem watch safety are implemented in any reference
  repo.
- Scanner signals can reliably distinguish privileged production code from demo/dev-only
  code.

## Required Fixes

- Add platform-specific evidence requirements for macOS/Windows/Linux packaging and
  signing.
- Define scanner-visible rules for Tauri capabilities, command handlers,
  filesystem/shell access, and secure storage.
- Add CI expectations: Rust checks, frontend typecheck/build, Tauri build or dry-run
  package, and command-contract tests.

## Useful Follow-ups

- Create `ref-tauri-react-desktop`.
- Decide whether Docs KB is part of this stack or only a VCQA product-specific
  composition.
