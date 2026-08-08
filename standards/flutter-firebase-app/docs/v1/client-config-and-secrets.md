# Client Config Versus Server Secrets

Firebase has an unusually confusing secret boundary: the config block it hands you looks
exactly like a credential and is not one, while the thing that *is* a credential arrives as
an innocuous-looking JSON file. Teams that get this backwards spend their effort hiding the
public half.

## R-CLIENT-1 - Public Firebase client config is committed and documented as public

**Severity.** `low`, escalating to `medium` when the missing explanation has led to a real
secret being mishandled - a repo with a scrubbed `firebase_options.dart` and a committed
service account fails at `medium`.

**Rule.** The API key, app id, project id, sender id, auth domain, and storage bucket may
be committed, and the repo states in prose why they are not secrets and what actually
protects the data.

**Why.** A Firebase web API key is an identifier, not an authorization token; the
protection is the security rules and App Check. Teams that believe otherwise routinely
"protect" the config with environment plumbing while leaving an Admin SDK key in the tree,
and reviewers who believe otherwise raise the committed config as the finding and stop
looking.

**Evidence.**

- Source/config: a committed `firebase_options.dart` or equivalent.
- Docs: a `SECURITY.md` (or README) section that names the boundary explicitly and points
  at the rules file as the real control.
- Exception: `acceptedException` where a client identifier is genuinely restricted, naming
  the restriction.

**vcqa.** Do **not** report committed `FirebaseOptions` as a leak. Instead flag a repo that
carries client config and has no written statement about the boundary, and flag a repo that
hides the public config while committing server credentials.

**References.** <https://firebase.google.com/docs/projects/api-keys>,
<https://firebase.google.com/docs/app-check>

## R-SECRET-1 - No server credential or signing material is committed

**Severity.** `blocker`

**Rule.** Service-account JSON, Admin SDK private keys, PEM private keys,
`.runtimeconfig.json`, Firebase CI deploy tokens, VAPID private keys, Android keystores and
`key.properties`, and Apple `.p8`/`.p12`/`.mobileprovision` files are absent from the
working tree and from history.

**Why.** Each of these bypasses the entire authorization model this standard spends five
other pages establishing. An Admin SDK key ignores security rules by design.

**Evidence.**

- Source/config: `.gitignore` entries covering the patterns.
- CI/artifacts: a check that scans **git-tracked** files - a `.gitignore` entry is not
  evidence, because `git add -f` defeats it and because ignore rules do not apply to files
  already tracked.
- Negative evidence: the check's passing output, retained per run.
- Exception: none for a live credential. A revoked, documented historical leak requires
  owner, rotation evidence, and the rotation date.

**vcqa.** Scan tracked files for both the filename patterns and the content patterns
(`"type": "service_account"`, `-----BEGIN PRIVATE KEY-----`); scan history where available.
Report a `.gitignore`-only defence as not meeting the rule.

**References.** <https://firebase.google.com/docs/admin/setup>,
<https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-SECRET-2 - The built artifact carries no server credential

**Severity.** `high`

**Rule.** The scan in R-SECRET-1 also runs over the built web bundle, and over the mobile
artifact where practical.

**Why.** Source cleanliness does not imply artifact cleanliness. A `--dart-define`, a
generated file, an asset copied by a build step, or a dependency that inlines its own
config can all introduce a key that exists nowhere in the repository.

**Evidence.**

- CI/artifacts: a scan step that runs **after** `flutter build web`, over `build/web`, and
  its output.
- Negative evidence: the passing scan retained alongside the build evidence.
- Exception: `acceptedException` where the artifact is not produced in CI, naming where it
  is produced and how it is scanned there.

**vcqa.** Look for a post-build scan over the build output directory. A source-only scan is
partial credit and should be reported as such rather than as a pass.

**References.** <https://docs.flutter.dev/deployment/web>,
<https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-CLIENT-2 - Functions secrets use a secret manager, not runtime config or env literals

**Severity.** `high`

**Rule.** Server-side secrets reach Cloud Functions through `firebase functions:secrets` /
Secret Manager or CI-injected environment variables; they are never committed and never
returned to a client.

**Why.** The deprecated `functions.config()` mechanism stores secrets in a project config
blob that is easy to dump and easy to commit as `.runtimeconfig.json` while debugging.
Secret Manager gives versioning, access control, and an audit trail.

**Evidence.**

- Source/config: `defineSecret` declarations or a `secrets: [...]` binding on each function
  that needs one; absence of a committed `.runtimeconfig.json`.
- CI/artifacts: the deploy step that grants secret access, without printing the value.
- Exception: `acceptedException` for a documented migration window off `functions.config()`,
  with an expiry date.

**vcqa.** Flag `functions.config()` usage, committed `.runtimeconfig.json`, secrets read
from a plain literal, and any handler that returns a secret-derived value to the caller.

**References.** <https://firebase.google.com/docs/functions/config-env>,
<https://cloud.google.com/secret-manager/docs>
