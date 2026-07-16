# 12 · Security

Frame every rule here with one fact: **the entire client is public.** Everything you ship —
source, comments, config, any string in the bundle — is downloadable and readable by
anyone. There is no server of your own to hide behind, and the browser running your code is
hostile. A static SPA's security is about *what you refuse to ship* and *how you constrain
what the page is allowed to do*.

## Rules

### R-SEC-1 · No secret in the bundle (canonical: R-DATA-1)

**Rule.** No private credential — API key, access token, DB string, signing secret — is
present in client source or the built output. This is governed canonically by
**R-DATA-1**; every rule below assumes it holds.

**Why.** A static build ships its whole source to the browser. A "hidden" key in a
`.ts` file, a `VITE_`-prefixed secret (Vite **inlines** those into the bundle), or a value
in a committed `.env` that gets bundled is fully exposed. Secrets live behind the API /
identity provider, never in the client.

```ts
// ❌ inlined into the bundle, visible in DevTools → Sources
const key = import.meta.env.VITE_OPENAI_KEY;

// ✅ the client calls your provider/SDK; the secret stays server-side
const res = await sdk.ai.complete(prompt);
```

**vcqa.** Scan built `dist/` and source for high-entropy strings / known key shapes; flag
any `VITE_`/`import.meta.env` value whose name matches `KEY|SECRET|TOKEN|PASSWORD`.

### R-SEC-2 · Ship a Content-Security-Policy

**Rule.** The app is served with a `Content-Security-Policy` that at minimum constrains
`default-src`, `script-src`, and `connect-src` to known origins.

**Why.** CSP is the main runtime containment a static app has: it limits where scripts can
load from and where the page can exfiltrate to, blunting injected-script and XSS impact.
Without a backend to add request-time defenses, the CSP header (set at the host/CDN) is the
control plane.

**vcqa.** A CSP is present (host config, `_headers`, or `<meta http-equiv>`); flag its
absence, and flag `script-src` containing `'unsafe-eval'`.

### R-SEC-3 · No inline handlers or inline scripts under CSP

**Rule.** Behaviour is attached in code (`addEventListener` / React event props), not via
inline `onclick=`/`<script>`; styling avoids inline `style`-driven logic that needs
`'unsafe-inline'`.

**Why.** A strict CSP without `'unsafe-inline'` **silently breaks** inline `onclick` and
inline `<script>` — a recurring "the button does nothing in prod" failure. Writing handlers
in modules keeps a strict CSP viable, which is the whole point of shipping one.

```html
<!-- ❌ dies under a strict CSP -->
<button onclick="openMenu()">Menu</button>
<!-- ✅ external module, CSP-safe -->
<button data-menu>Menu</button>
```

**vcqa.** Flag inline `on*=` attributes and inline `<script>` blocks in emitted HTML when a
non-`unsafe-inline` CSP is present.

### R-SEC-4 · Treat `dangerouslySetInnerHTML` as a last resort, sanitized

**Rule.** Raw HTML injection is avoided; where unavoidable (rendered Markdown, rich text),
the HTML is sanitized with a vetted sanitizer (DOMPurify) before it reaches the DOM.

**Why.** `dangerouslySetInnerHTML` with untrusted or user/AI-authored content is the
classic SPA XSS vector, and in a static app XSS means full control of the origin and any
token stored in it.

**vcqa.** Flag `dangerouslySetInnerHTML` whose value is not passed through a known
sanitizer; flag rendered Markdown/HTML without sanitization.

### R-SEC-5 · Auth via an external provider, tokens handled per its guidance

**Rule.** Authentication is delegated to an OAuth/OIDC provider or platform SDK; the app
does not roll its own crypto or password handling, and follows the provider's token-storage
guidance (prefer provider-managed `httpOnly` cookies over hand-storing tokens in
`localStorage`).

**Why.** With no server of its own, a static SPA cannot keep a session secret. Provider
SDKs handle refresh, rotation, and (with `httpOnly` cookies) keep the token unreachable from
JS — so an XSS bug can't simply read it out of `localStorage`.

**vcqa.** Identify an auth provider/SDK; flag hand-rolled JWT verification in the client and
long-lived tokens persisted in `localStorage`/`sessionStorage`.

### R-SEC-6 · Security headers at the host

**Rule.** The host sends `X-Content-Type-Options: nosniff`, a sensible `Referrer-Policy`,
`Strict-Transport-Security`, and a frame-ancestors/`X-Frame-Options` control.

**Why.** These are free, host-level hardening (MIME-sniffing, referrer leakage,
downgrade/clickjacking) that a static deploy can set once in `_headers` or CDN config.

**vcqa.** Parse `_headers` / host config for the set above; flag missing entries.

### R-SEC-7 · External links are `rel="noopener noreferrer"`

**Rule.** Every `target="_blank"` anchor carries `rel="noopener noreferrer"`.

**Why.** Without `noopener`, the opened page can reach back through `window.opener` and
navigate your tab (reverse-tabnabbing); `noreferrer` avoids leaking the URL.

**vcqa.** Flag `target="_blank"` anchors lacking `rel="noopener"`.

### R-SEC-8 · All API data is untrusted input

**Rule.** Responses from any external API are validated at the boundary (schema/parse)
before use, not blind-cast to a type.

**Why.** A third-party or compromised API can return anything; a bare `as Response` gives a
false sense of safety and turns a bad payload into a runtime crash or an injection. Runtime
validation is defense-in-depth on data you don't control. (Boundary typing detail lives in
**R-DATA** / **R-TS**; this is the security framing.)

**vcqa.** Flag `fetch(...).json() as T` without a runtime parse/validation step on external
responses.

### R-SEC-9 · Dependency supply-chain hygiene

**Rule.** Dependencies are lockfile-pinned, audited (`pnpm audit` / Dependabot), and new
ones are vetted; no `postinstall`-scripting or obfuscated packages enter without review.

**Why.** Anything you install is bundled and executed in **users' browsers** — a malicious
or compromised dependency is a direct XSS/exfiltration channel with no server between it and
the victim. The supply chain *is* the attack surface for a static app.

**vcqa.** Lockfile present and committed; an audit step runs in CI; flag dependencies with
known criticals and unexpected install scripts.

### R-SEC-10 · No sensitive data in client storage or logs

**Rule.** PII and sensitive values are not persisted to `localStorage`/IndexedDB in the
clear and not written to `console` in production builds.

**Why.** Client storage is readable by any script on the origin (so, by any XSS) and by
anyone with the device; leftover `console.log` of tokens/PII leaks into shared machines and
error pipelines. A static app has no server-side vault, so minimize what it holds at all.

**vcqa.** Flag writes of auth/PII-shaped values to web storage; flag `console.*` of such
values in the production bundle.

## Checklist

- [ ] No private secret in source or `dist/`; no `VITE_`-inlined secrets (**R-SEC-1** / R-DATA-1)
- [ ] A Content-Security-Policy is served, no `'unsafe-eval'` (**R-SEC-2**)
- [ ] Handlers in modules, not inline `onclick`/`<script>`; strict CSP stays viable (**R-SEC-3**)
- [ ] `dangerouslySetInnerHTML` avoided or DOMPurify-sanitized (**R-SEC-4**)
- [ ] Auth via OAuth/OIDC provider; tokens handled per provider, prefer `httpOnly` (**R-SEC-5**)
- [ ] `nosniff` / `Referrer-Policy` / HSTS / frame control set at the host (**R-SEC-6**)
- [ ] `target="_blank"` links carry `rel="noopener noreferrer"` (**R-SEC-7**)
- [ ] External API data validated at the boundary, not blind-cast (**R-SEC-8**)
- [ ] Lockfile pinned + `pnpm audit`/Dependabot in CI; new deps vetted (**R-SEC-9**)
- [ ] No PII/tokens in web storage or production `console` logs (**R-SEC-10**)
