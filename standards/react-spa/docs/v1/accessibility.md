# 9 · Accessibility

Accessibility is not a layer you add later — it falls out of writing the markup correctly the
first time. A client-rendered SPA carries two extra burdens a server-rendered page doesn't:
routing never reloads the document, so focus and screen-reader context don't reset on their
own, and content arrives asynchronously, so status has to be announced deliberately. These
rules target WCAG 2.2 AA and are written so a scanner can name the exact violation.

## Rules

### R-A11Y-1 · Semantic HTML first — landmarks and heading order

**Rule.** Pages use real landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`) with a
single `<main>`, and headings descend in order (`<h1>` → `<h2>` → …) without skipping levels.

**Why.** Landmarks and a correct heading outline are how screen-reader users navigate — they
jump by region and by heading. A `<div>` soup with no landmarks or a heading tree that skips from
`<h1>` to `<h4>` gives them no map of the page. Semantics also give browsers and assistive tech
behavior for free.

**vcqa.** Exactly one `<main>`; `<nav>`/`<header>`/`<footer>` present; heading levels don't skip
(no `<h4>` without a preceding `<h3>` in the same section).

### R-A11Y-2 · Buttons are buttons — an `onClick` div is a finding

**Rule.** Anything that performs an action is a `<button>`; anything that navigates is an `<a
href>`. A `<div>`/`<span>` with an `onClick` and no button role, tabindex, and key handler is a
violation.

**Why.** Native `<button>`/`<a>` are focusable, keyboard-operable (Enter/Space), and announced
with the right role — for free. A clickable `<div>` is invisible to keyboard and screen-reader
users: it can't be tabbed to and does nothing on Enter. Retrofitting `role`+`tabIndex`+key
handlers onto a div reinvents the button, badly.

```tsx
// ✅ real button — focusable, keyboard-operable, announced
<button onClick={save}>Save</button>

// ❌ inaccessible: no focus, no keyboard, no role
<div onClick={save}>Save</div>
```

**vcqa.** No `onClick` on a non-interactive element (`div`/`span`) without a matching `role`,
`tabIndex`, and keyboard handler; prefer the finding be "use a `<button>`".

### R-A11Y-3 · Everything interactive is keyboard-operable

**Rule.** Every interactive control is reachable and operable by keyboard alone (Tab/Shift-Tab
to reach, Enter/Space/arrows to operate), in a logical order; no interaction is mouse-only, and
no positive `tabIndex` values reorder the natural flow.

**Why.** Keyboard operability is the foundation of access for motor-impaired, screen-reader, and
power users. Custom widgets built on non-native elements routinely lose it. Positive `tabIndex`
(`tabIndex={3}`) creates a confusing focus order that diverges from the visual/DOM order.

**vcqa.** No `tabIndex` > 0; custom interactive widgets have key handlers; drag/hover-only
interactions have a keyboard equivalent.

### R-A11Y-4 · Visible focus — never `outline: none` without a replacement

**Rule.** Focused elements have a **visible** focus indicator. Removing the default outline
(`outline: none` / `focus:outline-none`) is only allowed when a clearly visible replacement
(ring, border, background) is applied in the same rule.

**Why.** Keyboard users rely on the focus ring to know where they are. Stripping it — a common
"cleanup" — leaves them lost with no visual cursor. A replacement (Tailwind `focus-visible:ring`)
keeps the aesthetic while preserving the affordance; `:focus-visible` shows it for keyboard, not
mouse, users.

```tsx
// ✅ removes default only alongside a visible replacement
<button className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500">…</button>

// ❌ focus becomes invisible
<button className="outline-none">…</button>
```

**vcqa.** No `outline: none` / `focus:outline-none` without an accompanying
`focus`/`focus-visible` ring/border/background in the same class list or rule.

### R-A11Y-5 · ARIA fills gaps only — correct roles and accessible names

**Rule.** ARIA is used only where native HTML can't express the semantics; custom widgets carry
the correct `role` and an accessible name (`aria-label`/`aria-labelledby`), and icon-only
controls have a label. No redundant or conflicting ARIA on native elements (e.g. `role="button"`
on a `<button>`).

**Why.** "No ARIA is better than bad ARIA." Native elements already announce correctly; adding
roles on top can override and break them. Where you *do* build a custom widget, the role and name
are what a screen reader announces — an icon-only button with no name reads as "button, button".

```tsx
// ✅ icon-only control gets a name
<button aria-label="Close dialog"><XIcon /></button>

// ❌ redundant role, and no name on the icon button
<button role="button"><XIcon /></button>
```

**vcqa.** No redundant ARIA roles on native elements; icon-only buttons/links have
`aria-label`/`aria-labelledby`; custom widgets (`role="dialog"|"tab"|"menu"…`) carry the required
attributes.

### R-A11Y-6 · Images have `alt`; decorative images have empty `alt`

**Rule.** Every `<img>` has an `alt` attribute — descriptive for meaningful images, **empty**
(`alt=""`) for purely decorative ones. Missing `alt` is a finding.

**Why.** Screen readers announce a missing `alt` by reading the filename — noise. A meaningful
image needs a text equivalent; a decorative one needs `alt=""` so it's skipped entirely. The
distinction is deliberate, not optional.

```tsx
<img src={chart} alt="Revenue up 20% quarter over quarter" />  // ✅ meaningful
<img src={swirl} alt="" />                                      // ✅ decorative, skipped
```

**vcqa.** No `<img>` without an `alt` attribute; decorative images use `alt=""` (not a filename
or omission).

### R-A11Y-7 · Color contrast meets AA; information is never color-only

**Rule.** Text meets WCAG AA contrast (**4.5:1** normal, **3:1** large/UI), and any information
conveyed by color (error, status, selected) is **also** conveyed by text, icon, or shape.

**Why.** Low-contrast text is unreadable for low-vision users and in sunlight. Color-only
signaling ("the red ones failed") is invisible to color-blind users — roughly 1 in 12 men. A text
label or icon alongside the color makes the meaning available to everyone.

```tsx
// ✅ color + icon + text, not color alone
<span className="text-red-600"><AlertIcon aria-hidden /> Failed</span>
```

**vcqa.** Text/background token pairs meet 4.5:1 (3:1 large); status/error UI carries a
text/icon signal in addition to color.

### R-A11Y-8 · Form fields are labeled and errors are associated

**Rule.** Every input has an associated `<label>` (or `aria-label`/`aria-labelledby`), and
validation errors are linked to the field via `aria-describedby` with `aria-invalid`. See the
**[Forms](forms.md)** page for the full field-level contract.

**Why.** An unlabeled input is announced as just "edit text" — the user has no idea what to type.
An error message that isn't programmatically tied to its field is never read in context. This is
the single most common real-world a11y failure, which is why Forms owns the detail.

**vcqa.** Inputs have a `<label htmlFor>`/`id` pair or an `aria-label`; error text is referenced
by `aria-describedby` and the field sets `aria-invalid` when invalid (cross-ref `R-FORM-*`).

### R-A11Y-9 · Async status is announced via live regions

**Rule.** Content that appears asynchronously without a focus change — toasts, "Saved",
loading/error banners, search-result counts — is inside an `aria-live` region (`polite` for
status, `assertive`/`role="alert"` for errors) present in the DOM before it updates.

**Why.** A screen-reader user watching nothing move gets no signal that a save succeeded or a
request failed — the visual-only toast is silent to them. A live region announces the change
without stealing focus. The region must exist before the update, or the change may not be
announced.

```tsx
// ✅ announced without moving focus
<div aria-live="polite">{status}</div>
<div role="alert">{error}</div>
```

**vcqa.** Async status/toast/error UI is rendered inside an `aria-live`/`role="status"`/
`role="alert"` region; the region container is persistent, not mounted alongside the message.

### R-A11Y-10 · Manage focus on route change and modal open/close

**Rule.** On client route navigation, focus (and typically scroll) moves to a sensible target —
the new page's `<h1>` or main region. When a dialog opens, focus moves **into** it and is
**trapped**; on close, focus **returns** to the element that opened it.

**Why.** This is the SPA-specific rule. A full page load resets focus to the top; client routing
does not — so after navigating, a keyboard/screen-reader user is stranded on a link that no
longer exists, with no announcement of the new page. Likewise a modal that doesn't trap focus
lets Tab wander behind it. Prefer a headless dialog primitive that handles trap/restore for you.

```tsx
// ✅ move focus to the new page on navigation
useEffect(() => { mainRef.current?.focus(); }, [pathname]);
```

**vcqa.** A route-change focus/scroll handler exists; dialogs use a focus-trapping primitive (or
implement trap + restore); a bare `{open && <div className="modal">…}` with no focus management =
finding.

### R-A11Y-11 · Respect `prefers-reduced-motion`

**Rule.** Non-essential animation and transitions are disabled or reduced under
`@media (prefers-reduced-motion: reduce)`; nothing large auto-plays, parallaxes, or moves for
users who asked to opt out.

**Why.** Vestibular disorders make large motion physically nauseating. Honoring the OS-level
reduce-motion preference is a one-line media query that prevents real harm; ignoring it is a AA
failure.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

**vcqa.** A `prefers-reduced-motion: reduce` query (or Tailwind `motion-reduce:` variants) gates
non-trivial animation/transition.

### R-A11Y-12 · Document language, and axe in the test suite

**Rule.** The HTML sets `<html lang="…">`, and the project runs an automated accessibility check
— **jest-axe/vitest-axe** on component tests and/or **`@axe-core/playwright`** in E2E — in CI.

**Why.** `lang` tells the screen reader which pronunciation/voice to use; without it, content is
read in the wrong accent, sometimes unintelligibly. An axe pass catches the mechanical failures
(missing labels, contrast, roles) automatically so they never regress — the machine-checkable
floor beneath manual testing.

```ts
// ✅ component-level a11y assertion
expect(await axe(container)).toHaveNoViolations();
```

**vcqa.** `index.html` has `<html lang>`; `jest-axe`/`vitest-axe` or `@axe-core/playwright` is a
dependency and invoked in tests/CI.

## Checklist

- [ ] Semantic landmarks + ordered headings (**R-A11Y-1**)
- [ ] Actions are `<button>`/`<a>`, not `onClick` divs (**R-A11Y-2**)
- [ ] Fully keyboard-operable; no positive `tabIndex` (**R-A11Y-3**)
- [ ] Visible focus; no `outline:none` without a replacement (**R-A11Y-4**)
- [ ] ARIA fills gaps only; correct roles + accessible names (**R-A11Y-5**)
- [ ] All `<img>` have `alt`; decorative `alt=""` (**R-A11Y-6**)
- [ ] AA contrast; info not conveyed by color alone (**R-A11Y-7**)
- [ ] Labeled fields + associated errors (see Forms) (**R-A11Y-8**)
- [ ] Async status in live regions (**R-A11Y-9**)
- [ ] Focus managed on route change + modal open/close (**R-A11Y-10**)
- [ ] `prefers-reduced-motion` respected (**R-A11Y-11**)
- [ ] `<html lang>` set; axe runs in CI (**R-A11Y-12**)
