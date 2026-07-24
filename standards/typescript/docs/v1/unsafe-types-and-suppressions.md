# Unsafe types and suppressions

## R-ANY-1 - `any` is not used on owned boundaries

**Rule.** `any` must not appear on owned boundary code, public exports, parsed external
data, environment/config values, tool inputs, API responses, or package surface types
without a local reason.

**Why.** `any` disables checking exactly where the compiler should protect callers and
runtime boundaries.

**vcqa.** Flag `: any`, `as any`, `<any>`, `Array<any>`, and `Record<string, any>` in owned
source, weighted higher near public or external boundaries.

**References.**

- TypeScript Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>

## R-ASSERT-1 - Unsafe assertions are justified

**Rule.** Type assertions must narrow a known compiler limitation or interop boundary; they
must not replace validation, checking, or correct modeling.

**Why.** A cast tells the compiler to trust the developer. At a runtime boundary, that trust
can turn malformed data into a production crash.

**vcqa.** Flag repeated `as Type`, double assertions through `unknown`, non-null
assertions, and assertions immediately after `json()`, env reads, config reads, or tool
arguments.

**References.**

- TypeScript Handbook: <https://www.typescriptlang.org/docs/handbook/intro.html>

## R-SUPPRESS-1 - TypeScript suppressions are self-expiring

**Rule.** `@ts-ignore` is banned. `@ts-expect-error` must include a reason and should fail
when the expected error disappears.

**Why.** Permanent suppressions hide fixed errors and new errors alike. Explained
`@ts-expect-error` comments keep escape hatches visible and reviewable.

**vcqa.** Flag `@ts-ignore`, `@ts-nocheck`, unexplained `@ts-expect-error`, and suppressions
in public or boundary code.

**References.**

- TSConfig Reference: <https://www.typescriptlang.org/tsconfig/>
