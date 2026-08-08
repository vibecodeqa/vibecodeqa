# Firestore Rules And Indexes

`firestore.rules` is the entire server-side authorization model for every direct client
read and write. It is a program, it is deployed, and it is almost never reviewed as either.
Indexes are the same file class with a different failure mode: absent, they fail only in
production.

## R-RULES-1 - Rules are a versioned, reviewed, deployable artifact

**Severity.** `blocker`

**Rule.** `firestore.rules` - and Storage rules where Storage is used - is committed,
referenced by `firebase.json`, and reaches production only through reviewed CI.

**Why.** A rules file edited in the console is an unreviewed production change to the whole
authorization model, made by one person, with no diff and no rollback. The committed file
then silently disagrees with production until the next deploy overwrites the fix.

**Evidence.**

- Source/config: `firebase.json` naming the rules files; `rules_version = '2'` at the top
  of each.
- Runtime/deploy: the workflow step that deploys rules, and the absence of any documented
  console-editing procedure.
- Exception: an emergency console change requires an `acceptedException` with owner, an
  issue link, and a follow-up commit landing before a stated expiry date.

**vcqa.** Flag a repo with Firestore usage and no committed rules file; flag
`rules_version` below `'2'`; flag Storage usage with no Storage rules.

**References.** <https://firebase.google.com/docs/firestore/security/get-started>,
<https://firebase.google.com/docs/rules/manage-deploy>

## R-RULES-2 - Rules are unit-tested against the emulator, and the tests include denials

**Severity.** `blocker`

**Rule.** An emulator-backed suite using `@firebase/rules-unit-testing` asserts at minimum:
an unauthenticated read is denied; a non-owner read of a private document is denied; an
owner read and write succeed; and a write to a server-owned field is denied.

**Why.** Rules cannot be reviewed by reading them - the interaction between nested matches,
wildcards, and `get()` calls is not tractable by eye. A suite with only `assertSucceeds`
cases proves the app works and says nothing about whether anyone else can read the data,
which is the only question the file exists to answer.

**Evidence.**

- CI/artifacts: `firebase emulators:exec --only firestore "<test command>"` with a JDK
  provisioned, and test output showing the `assertFails` cases by name.
- Negative evidence: at least one denial assertion per collection that holds user data.
- Exception: `evidence-only` downgrade for a repo with documented manual rules review,
  carrying approver, expiry, and review date.

**vcqa.** Count `assertFails` against `assertSucceeds`; flag suites with zero denial
assertions, and flag a rules-tests job with no JDK setup step - the emulator needs a JVM and
the job will otherwise fail or, worse, be marked non-blocking to make it stop failing.

**References.** <https://firebase.google.com/docs/rules/unit-tests>,
<https://firebase.google.com/docs/emulator-suite/install_and_configure>

## R-RULES-3 - Rules default-deny and validate document shape

**Severity.** `high`

**Rule.** No `allow read, write: if true` at any path; create and update rules constrain the
writable key set with `hasOnly` and validate types and bounds.

**Why.** Firestore rules are default-deny only until the first broad `match`. Without a
key-set constraint, a client can add arbitrary fields to a document it legitimately owns -
including fields the server later reads as trusted input.

**Evidence.**

- Source/config: `firestore.rules`, with the constrained key set visible per collection.
- CI/artifacts: tests covering an unknown extra field and an out-of-range value, both
  denied.
- Exception: `acceptedException` for a genuinely open collection such as a public feed,
  naming the data and the rate limiting or App Check control that replaces the constraint.

**vcqa.** Flag blanket allows, wildcard `{document=**}` write rules, and rules with no
`hasOnly`/`affectedKeys` constraint on any client-writable collection.

**References.** <https://firebase.google.com/docs/firestore/security/rules-conditions>,
<https://firebase.google.com/docs/reference/rules/rules.Map#hasonly>

## R-RULES-4 - Elevation is a server-verified claim, never a client-held key

**Severity.** `blocker`

**Rule.** Admin and privileged access derives from a custom claim checked as
`request.auth.token.<claim> == true`, and a client can never grant itself that claim: the
document or field the claim is derived from is not client-writable.

**Why.** The commonest Firebase authorization bug is a rule that reads `isAdmin` out of the
user's own profile document, which the same user may write. The rule looks like a check and
is a formality.

**Evidence.**

- Source/config: the rules predicate, plus the user-profile rules that forbid self-granting
  the field.
- CI/artifacts: a test in which a caller presents a truthy-but-not-`true` claim - the string
  `"true"`, or `1` - and is denied.
- Exception: none. A client-writable role is not this control with an exception.

**vcqa.** Flag rules that read a role out of a client-writable document without a
compensating write rule; flag claim comparisons that rely on truthiness rather than
equality with `true`.

**References.** <https://firebase.google.com/docs/auth/admin/custom-claims>,
<https://firebase.google.com/docs/firestore/security/rules-conditions#access_other_documents>

## R-INDEX-1 - Composite indexes are committed and match the queries the code issues

**Severity.** `high`

**Rule.** `firestore.indexes.json` is committed, and every composite query the codebase
issues has a matching index entry.

**Why.** The emulator does **not** enforce index requirements. A suite that is green
against the emulator can still fail in production the first time the query runs, and the
error arrives as a runtime failure in a user's session rather than in CI.

**Evidence.**

- Source/config: `firestore.indexes.json`, and a declared inventory of composite queries if
  the check is declaration-based.
- CI/artifacts: a check mapping each declared or extracted query to an index entry, failing
  on a query with no index.
- Runtime/deploy: a live-project query smoke check where one exists - this is the only
  evidence that closes the emulator gap completely.
- Exception: `evidence-only` where index management is delegated to console auto-creation,
  with owner and review date; note that auto-creation happens after the first failure.

**vcqa.** Flag `.where(...).orderBy(...)` combinations with no matching index entry, and
record whether the check is declaration-based (a human keeps the inventory current) or
extraction-based (the code is the source of truth). Declaration-based checks should be
reported as weaker.

**References.** <https://firebase.google.com/docs/firestore/query-data/index-overview>,
<https://firebase.google.com/docs/firestore/query-data/indexing>

## R-INDEX-2 - No unexplained indexes

**Severity.** `low`

**Rule.** Every committed composite index is traceable to a query in the codebase.

**Why.** Orphan indexes cost write throughput and storage on every document write, and they
are the residue of queries that were removed - which means nobody knows whether removing
the index is safe.

**Evidence.**

- CI/artifacts: the same check as R-INDEX-1, additionally failing on an index no query
  needs.
- Exception: `acceptedException` naming an index reserved for an out-of-band consumer such
  as a BigQuery export or an admin script.

**vcqa.** Report orphan indexes as `low` findings, listing them individually rather than as
a count.

**References.** <https://firebase.google.com/docs/firestore/query-data/index-overview>
