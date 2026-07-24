# TypeScript Gold Standard

The TypeScript standard is the cross-cutting VibeCode QA rubric for typed source slices.
It applies when a repo slice contains TypeScript source or declares TypeScript as part of
its build, package, runtime, or public API contract.

Canonical version URL:
<https://vibecodeqa.online/standards/typescript/v1/>

This standard is not a generic TypeScript style guide. It defines the checkable glue VCQA
owns across stack shapes: strictness, runtime compatibility, type escape policy, boundary
validation, generated-code exceptions, declaration quality, and CI evidence.

## Latest edition

- [TypeScript v1](v1/index.md)

## Scope

This standard governs:

- `tsconfig` strictness and compiler options
- runtime-specific module, lib, and type settings
- project references and monorepo structure
- `any`, suppressions, assertions, and narrowing gaps
- typed plus runtime-validated external boundaries
- type-only imports and emitted module behavior
- generated code and migration exceptions
- declaration files and public API type surface
- CI gates and typecheck evidence

## Not in scope

- General language doctrine already owned by the TypeScript Handbook and TSConfig
  reference.
- Framework-specific component rules such as React props conventions, unless a stack
  standard explicitly adopts them.
- Runtime validation mechanics owned by Zod, OpenAPI, JSON Schema, or stack-specific
  boundary standards.
