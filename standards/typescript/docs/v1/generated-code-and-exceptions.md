# Generated code and exceptions

## R-GEN-1 - Generated code is identifiable

**Rule.** Generated TypeScript must be identifiable by path, header, generator config, or
runbook, and must not be mixed indistinguishably with hand-owned source.

**Why.** Generated files often need different lint/type exceptions. If the boundary is not
clear, scanners and reviewers cannot tell whether a finding is fixable source or generator
output.

**vcqa.** Flag generated-looking files without generator metadata, generated directories
included as owned source, or hand source hidden in generated paths.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>

## R-GEN-2 - Generated outputs are reproducible or pinned

**Rule.** Generated TypeScript that is committed must be reproducible from checked-in
config, pinned generator versions, and documented commands, or explicitly treated as a
vendored artifact.

**Why.** Non-reproducible generated code drifts from the source contract and cannot be
reviewed reliably.

**vcqa.** Flag generated clients, schemas, or bindings with no generator command, no source
contract, or no pinned tool version.

**References.**

- npm package metadata:
  <https://docs.npmjs.com/cli/v11/configuring-npm/package-json/>

## R-EXCEPTION-1 - Type exceptions are narrow and reviewed

**Rule.** TypeScript exceptions for migration, generated code, third-party definitions, or
runtime interop must be narrow, documented, and periodically reviewed.

**Why.** Broad exceptions become permanent untyped zones. A good exception records why it
exists and when to remove it.

**vcqa.** Flag blanket `skipLibCheck` justification gaps, broad `exclude` patterns,
repo-wide suppression configs, and exception comments without owner/review trigger.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>
