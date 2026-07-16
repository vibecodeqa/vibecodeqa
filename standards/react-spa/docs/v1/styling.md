# 5 · Styling

The house styling choice is **Tailwind CSS v4** wired through `@tailwindcss/vite`. Tailwind
does not change the archetype — a static SPA styles itself the same way whatever you pick —
but the choice is scored, and v4 has one structural rule that trips up every repo migrated
from muscle memory: **v4 is CSS-first**. Configuration, tokens, and theme live in your CSS
via `@theme`, and there is **no `tailwind.config.js`**. The rest of this page is about keeping
the styling layer cheap (a static app pays for every runtime byte), tokenized, themeable in
both light and dark, and disciplined enough that a scanner can read intent from the class
lists.

## Rules

### R-STYLE-1 · Tailwind v4 via the Vite plugin

**Rule.** Tailwind is installed as **v4** and wired through the `@tailwindcss/vite` plugin in
`vite.config.ts`; the old PostCSS-plugin pipeline (`postcss.config` + `tailwindcss` as a
PostCSS plugin) is not used.

**Why.** v4's Vite plugin is faster, needs no PostCSS scaffolding, and is the supported path
for the house stack. A repo still on the PostCSS plugin is on the v3-era pipeline and will not
honour the CSS-first config this page requires.

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
```

**vcqa.** `tailwindcss` satisfies `>=4`; `@tailwindcss/vite` present and referenced in
`vite.config.*`; no `tailwindcss` entry inside a `postcss.config.*` plugins list.

### R-STYLE-2 · No `tailwind.config.js` — configure in CSS

**Rule.** There is **no `tailwind.config.js`/`.ts`**; Tailwind configuration lives in CSS. A
JS/TS Tailwind config file in a v4 repo is drift and is flagged.

**Why.** v4 is CSS-first: the framework reads its configuration from your stylesheet, not from
a JS module. A `tailwind.config.js` copied in from a v3 tutorial is silently ignored for
theme purposes and misleads every reader into thinking that is where tokens live. One source
of configuration (the CSS) removes the ambiguity.

```css
/* ❌ BAD — v3 muscle memory, ignored by v4's theme system */
/* tailwind.config.js with theme.extend.colors … */

/* ✅ GOOD — src/index.css */
@import 'tailwindcss';
@theme {
  --color-brand: oklch(0.62 0.19 255);
}
```

**vcqa.** No `tailwind.config.{js,ts,cjs,mjs}` at repo/app root when `tailwindcss@>=4` is
present; theme customization appears under `@theme` in CSS instead.

### R-STYLE-3 · Design tokens in `@theme`

**Rule.** Color, spacing, type-scale, radius and similar design tokens are declared as theme
variables in `@theme { }` (surfacing as CSS custom properties), not hard-coded ad-hoc across
components.

**Why.** Tokens are the single source of truth for the design system. Declared in `@theme`
they generate matching utilities **and** are available as `var(--color-brand)` for the rare
raw-CSS case, so the palette can change in one place. Scattering literal hex values across
components makes a theme change a find-and-replace hazard.

```css
@theme {
  --color-surface: oklch(1 0 0);
  --color-ink:     oklch(0.2 0.02 260);
  --spacing-gutter: 1.5rem;
  --radius-card:    0.75rem;
}
```

**vcqa.** A non-trivial `@theme` block defines the palette/scale; flag repeated literal color
values (`#rrggbb`, `rgb(...)`) across components where a token exists.

### R-STYLE-4 · Dark mode: both schemes styled, one strategy

**Rule.** Dark mode is driven by a single explicit strategy — a `dark:` variant tied to a root
`class`/`data-theme` on `<html>` — and **both** light and dark are actually styled; the app
does not render legible in only one scheme.

**Why.** A static SPA renders in whatever scheme the visitor's OS/toggle asks for; shipping
only light (or dark) means half your users get unreadable contrast with no server to detect
and fix it. Pinning the strategy to a root attribute lets a user toggle override the OS
preference deterministically.

```css
/* src/index.css — v4 custom-variant for class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));
```
```tsx
// ✅ both schemes styled from tokens
<div className="bg-surface text-ink dark:bg-surface-dark dark:text-ink-dark" />
```

**vcqa.** A dark strategy is configured (root class/`data-theme` + `dark:` variants present);
components that set a light background/text without a `dark:` counterpart are flagged.

### R-STYLE-5 · No unstructured runtime CSS-in-JS

**Rule.** Styling does not use a runtime CSS-in-JS library (`styled-components`, `emotion`)
for general component styling; utilities + tokens (and plain CSS where needed) do the work.

**Why.** Runtime CSS-in-JS ships a styling engine to the browser and serializes styles during
render — bundle weight and per-render cost that a static app has no reason to pay when
Tailwind resolves everything at build time to a static stylesheet. It also fights SSR-free
hydration and complicates the CSP.

**vcqa.** `styled-components` / `@emotion/*` absent from dependencies; no `styled.\`` / `css\``
template-literal styling in `src/**` (build-time zero-runtime CSS is fine).

### R-STYLE-6 · Prefer tokens over arbitrary-value soup

**Rule.** Utilities reference theme tokens (`text-ink`, `p-gutter`, `rounded-card`); arbitrary
values (`text-[#3b82f6]`, `p-[13px]`) are the rare exception, not the norm.

**Why.** Arbitrary values bypass the design system — every `[#hex]` is a token that should
exist but doesn't, and a magic pixel count is a spacing scale someone ignored. A wall of
arbitrary values means the tokens aren't doing their job, and the design drifts value by
value.

```tsx
// ❌ BAD — arbitrary soup, bypasses the scale
<div className="mt-[13px] text-[#3b82f6] p-[7px]" />
// ✅ GOOD — token-driven
<div className="mt-4 text-brand p-2" />
```

**vcqa.** Density of arbitrary-value utilities (`[...]`) per component is below a small
threshold; a component whose color/spacing is mostly arbitrary values is flagged.

### R-STYLE-7 · Variants via a disciplined helper, not string concat

**Rule.** Conditional/variant class lists are composed with a disciplined helper (`clsx` /
`cva` / `tailwind-merge`), not string concatenation or nested template-literal ternaries.

**Why.** Hand-built `` `btn ${primary ? 'bg-brand' : ''} ${size === 'lg' ? 'p-4' : 'p-2'}` ``
strings produce conflicting utilities (two `p-*`), stray whitespace, and unreadable diffs.
`cva`/`clsx` make variants declarative and let `tailwind-merge` resolve conflicts to the last
writer, so the rendered class list is predictable.

```tsx
// ✅ GOOD
const button = cva('rounded-card font-medium', {
  variants: { intent: { primary: 'bg-brand text-white', ghost: 'bg-transparent text-ink' },
              size:   { sm: 'px-2 py-1', lg: 'px-4 py-2' } },
});
<button className={button({ intent, size })} />
```

**vcqa.** Multi-variant components use `clsx`/`cva`/`cn`; flag `className` built by string
concatenation or chained template-literal ternaries with duplicate utility prefixes.

### R-STYLE-8 · Responsive, no horizontal scroll

**Rule.** Layout is responsive with mobile-first utilities and constrained max-widths; the
page body never scrolls horizontally, and wide content (tables, code, diagrams) scrolls inside
its own container.

**Why.** A static SPA is opened on every viewport with no server to sniff the device and
branch. A fixed-width layout or an unconstrained wide element produces a horizontally-scrolling
page — the classic broken-on-mobile symptom. Relative units, flex/grid, `max-w-*`, and
`overflow-x-auto` on the wide child keep the body honest.

**vcqa.** Responsive prefixes (`sm:`/`md:`/`lg:`) present; potential overflow sources (fixed
`w-[…px]` wider than viewport, unwrapped wide tables) are flagged; wide children use an
`overflow-x-auto` wrapper.

### R-STYLE-9 · Respect `prefers-reduced-motion`

**Rule.** Non-essential animation and transition is gated behind `prefers-reduced-motion` (via
Tailwind's `motion-reduce:`/`motion-safe:` variants or a media query); nothing large moves for
a user who asked motion off.

**Why.** Reduced-motion is an accessibility and comfort requirement (vestibular disorders).
Because the SPA renders client-side, honouring the OS preference is entirely the app's job.

```tsx
<div className="motion-safe:transition-transform motion-safe:hover:scale-105" />
```

**vcqa.** Transition/animation utilities are paired with `motion-safe:`/`motion-reduce:` or a
`prefers-reduced-motion` media query exists; large unconditional animations are flagged.

### R-STYLE-10 · Minimal global CSS, one entry stylesheet

**Rule.** Global CSS is a single small entry stylesheet (`src/index.css`) that holds the
`@import 'tailwindcss'`, the `@theme` tokens, and a handful of base rules — not sprawling
hand-written global selectors or many competing global stylesheets.

**Why.** Every global rule is a specificity landmine and defeats the utility model. Keeping the
global surface tiny keeps styling predictable, keeps the shipped CSS small, and means the
tokens (not scattered globals) drive appearance.

**vcqa.** One primary global stylesheet imported at the entry; `@import 'tailwindcss'` present;
flag large hand-written global selector blocks or multiple competing global CSS files.

## Checklist

- [ ] Tailwind v4 via `@tailwindcss/vite`, not the PostCSS plugin (**R-STYLE-1**)
- [ ] No `tailwind.config.js`; configuration lives in CSS (**R-STYLE-2**)
- [ ] Design tokens declared in `@theme` (**R-STYLE-3**)
- [ ] Single dark-mode strategy tied to a root class; both schemes styled (**R-STYLE-4**)
- [ ] No runtime CSS-in-JS (`styled-components`/`emotion`) (**R-STYLE-5**)
- [ ] Tokens over arbitrary-value soup (**R-STYLE-6**)
- [ ] Variants via `clsx`/`cva`/`tailwind-merge`, not string concat (**R-STYLE-7**)
- [ ] Responsive, no horizontal page scroll; wide content scrolls locally (**R-STYLE-8**)
- [ ] `prefers-reduced-motion` respected (**R-STYLE-9**)
- [ ] Minimal global CSS in one entry stylesheet (**R-STYLE-10**)
