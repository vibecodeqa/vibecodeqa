# Trusted Server Boundaries

Cloud Functions exist in this stack for one reason: to perform the writes no client can be
trusted to perform. That makes the Function and the rules file two halves of one control.
Either half alone is decoration.

## R-FUNCTIONS-1 - Privileged mutations are performed by the server, not by any client

**Severity.** `blocker`

**Rule.** Any write a client must not be trusted to make is performed by a Cloud Function
or equivalent trusted backend, **and** `firestore.rules` forbids the client path that the
Function performs.

**Why.** If the rules still allow the client to make the write directly, the Function is
decoration: an attacker does not have to call it. This is the rule that makes the whole
page mean something, and it is the one most often half-implemented - the Function is
written, the rules are never tightened.

**Evidence.**

- Source/config: the callable or trigger that performs the write, and the rules clause
  forbidding the same write to clients.
- CI/artifacts: a rules test proving the client path is denied, including for a client that
  holds the admin claim - an admin user is still a client.
- Exception: none. A repo in which the client can perform the write is not implementing
  this control.

**vcqa.** For each field written by a Function through the Admin SDK, check that the rules
deny that field to clients. A Function and a permissive rule together score worse than no
Function, because the Function implies a boundary that is not there.

**References.** <https://firebase.google.com/docs/functions/callable>,
<https://firebase.google.com/docs/firestore/security/rules-structure>

## R-FUNCTIONS-2 - Callable inputs are validated and unknown fields are rejected

**Severity.** `high`

**Rule.** Every callable and HTTP handler validates its payload against an explicit schema,
rejects unexpected fields rather than ignoring them, and bounds string lengths and
identifier formats.

**Why.** The Admin SDK bypasses security rules by design, so inside a Function the handler
is the only validator left in the system. Ignoring an unknown field is how a caller
smuggles one into a spread-merge write.

**Evidence.**

- Source/config: the schema or parser, applied before any use of the payload.
- CI/artifacts: unit tests for malformed, oversized, and extra-field payloads, each
  asserting rejection rather than a default.
- Exception: `acceptedException` for an internal-only trigger with no external caller,
  naming what restricts invocation.

**vcqa.** Flag handlers that read `request.data.<field>` without a preceding validation
step, and validators that strip unknown fields silently instead of rejecting them.

**References.** <https://firebase.google.com/docs/functions/callable>,
<https://firebase.google.com/docs/functions/beta/organize-functions>

## R-FUNCTIONS-3 - Trusted patches touch only server-owned fields, and errors do not leak internals

**Severity.** `medium`

**Rule.** An Admin SDK write updates only the fields the server owns, never silently
rewriting owner content, and thrown errors map to a stable error contract without exposing
internal messages.

**Why.** An Admin SDK `set()` without `merge` replaces the document, including the user
content the client legitimately owns - a data-loss bug wearing an authorization fix's
clothing. Raw error messages from a privileged context leak collection names, document
paths, and occasionally credentials.

**Evidence.**

- Source/config: the patch builder that constructs the update, and the error mapper.
- CI/artifacts: a unit test asserting the **exact** key set of the patch, so a new field
  cannot be added without updating the test.
- Exception: `acceptedException` for a documented full-document rewrite, naming what
  reconstructs the client-owned fields.

**vcqa.** Flag Admin SDK `set()` without `merge`, patches assembled by spreading the
request payload, and `catch` blocks that re-throw raw messages to the caller.

**References.** <https://firebase.google.com/docs/firestore/manage-data/add-data>,
<https://firebase.google.com/docs/functions/callable#handle_errors>

## R-CLAIM-1 - Every privileged handler re-verifies the claim server-side

**Severity.** `blocker`

**Rule.** The handler checks `request.auth` and the custom claim with a strict identity
comparison against `true`, independently of any client-side gate and independently of the
rules file.

**Why.** The client-side gate is a UI affordance an attacker does not run. The rules file
does not apply to the Admin SDK. If the handler does not check, nothing does - a
signed-in user with no privileges can call the callable directly.

**Evidence.**

- Source/config: the guard, executed before any privileged work and before any expensive
  read.
- CI/artifacts: unit tests for three callers - unauthenticated, signed-in without the
  claim, and holding a truthy-but-not-`true` claim - each asserting rejection.
- Exception: none for a handler that performs a privileged write.

**vcqa.** Flag privileged handlers with no `request.auth` check, and loose truthiness
checks on claims; a `if (request.auth?.token.admin)` guard passes for the string `"false"`.

**References.** <https://firebase.google.com/docs/auth/admin/custom-claims>,
<https://firebase.google.com/docs/functions/callable#handle_authentication>

## R-CLAIM-2 - Client-side privilege gates are documented as UX only

**Severity.** `low`

**Rule.** Any client-side "is admin" check is annotated as an affordance, pointing at the
two server checks - the rules predicate and the handler guard - that actually enforce it.

**Why.** An unlabelled client-side check is read by the next maintainer as the enforcement
point, and the server check is then "simplified" away as duplication.

**Evidence.**

- Source/config: the comment or doc comment on the client-side check naming both server
  checks.
- CI/artifacts: a widget test asserting the non-admin path renders no privileged controls -
  which is a usability guarantee, not a security one, and should be described that way.
- Exception: `acceptedException` where the client has no privilege-dependent UI at all.

**vcqa.** Flag a client-side role check with no corresponding server check; report the
client test as UX evidence and never as authorization evidence.

**References.** <https://firebase.google.com/docs/auth/admin/custom-claims>

## R-FUNCTIONS-4 - Functions are typechecked, tested, and built before they can be deployed

**Severity.** `high`

**Rule.** The Functions package runs a locked install, a strict typecheck, unit tests, and
a build - both in CI and in the `firebase.json` `predeploy` hooks.

**Why.** A Function is deployed from a local build by whoever runs the CLI. Without
`predeploy` hooks, a green CI run does not constrain what a human deploys from a dirty
working tree. Running the same gates in both places is what makes the CI result binding.

**Evidence.**

- Source/config: `firebase.json` `predeploy` naming the install, typecheck, test, and build
  commands; a committed lockfile.
- CI/artifacts: a Functions job running on the same Node major as `functions[].runtime`.
- Exception: `acceptedException` where deploys are only ever performed by CI from a clean
  checkout, naming the control that prevents a local deploy.

**vcqa.** Compare the CI Node version against `functions[].runtime` and flag a mismatch;
flag an empty or absent `predeploy` array, and an install step that is not lockfile-exact.

**References.** <https://firebase.google.com/docs/cli#predeploy_and_postdeploy_hooks>,
<https://firebase.google.com/docs/functions/manage-functions>
