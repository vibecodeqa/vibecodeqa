# VibeCode QA palette

Every value below was read out of shipping code or sampled from shipping
artwork on 2026-08-18. Nothing here is aspirational — if a colour is not in this
file, it is not currently used by a VibeCode QA surface.

## Web palette (canonical for the website and the web app)

Declared once in `index.html` as CSS custom properties on `:root`, and mirrored
in `app/src/index.css` for the dashboard. These two files agree on `--accent`,
which is what makes indigo the product's web identity.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#09090b` | Page background. Near-black, very slightly cool. |
| `--card` | `#111115` | Panel / card surface. |
| `--border` | `#1e1e24` | Hairlines, dividers, card borders. |
| `--text` | `#e5e5e5` | Body text. |
| `--muted` | `#6b7280` | Secondary text, labels, captions. |
| `--accent` | `#818cf8` | Primary indigo. Links, CTAs, the `VQ` mark. |
| `--accent2` | `#6366f1` | Deeper indigo. Gradient partner, pressed states. |
| `--pass` | `#22c55e` | Passing check. |
| `--fail` | `#ef4444` | Failing check. |
| `--warn` | `#eab308` | Warning check. |
| `--pro` | `#f59e0b` | Paid-tier / Pro accent. |

One colour used by the site is **not** a token: `#a78bfa`, the light violet at
the end of the hero headline gradient (`linear-gradient(135deg, var(--accent), #a78bfa)`).
The OG card reuses it for the same purpose. If the palette is ever formalised
further, this is the first value that deserves a token.

### Contrast note

Measured against `--bg` (`#09090b`), WCAG 2.1 contrast ratios are:

| Foreground | Ratio on `--bg` | Verdict |
|---|---|---|
| `--text` `#e5e5e5` | 15.79:1 | Passes AAA. |
| `--warn` `#eab308` | 10.37:1 | Passes AAA. |
| `--pass` `#22c55e` | 8.73:1 | Passes AAA. |
| `--accent` `#818cf8` | 6.67:1 | Passes AA at any size. |
| `--fail` `#ef4444` | 5.29:1 | Passes AA for normal text. |
| `--muted` `#6b7280` | 4.12:1 | **Fails AA for normal text** (needs 4.5:1). |

`--muted` is the one to watch. It is acceptable for large text (AA large needs
3:1) but it fails for small body copy, and it disappears entirely once a social
platform downscales an image to thumbnail width. The OG card therefore uses
`#b0b0ba` (9.25:1) for its subheading and reserves `--muted` for the all-caps
labels, which survive downscaling because they are large and letter-spaced.
That is a deliberate departure from the token, documented here rather than
silently introduced.

Both mark colours are comfortable on the same background — amber `#ffc131` at
12.24:1 and cyan `#24c8db` at 9.81:1 — which is why the GitHub avatar export is
flattened onto `--bg` rather than onto white.

## Mark palette (the desktop icon)

Sampled directly from `logo/icon-512.png`. The mark uses exactly two opaque
colours over full transparency — there is no third colour, no gradient, and no
white plate.

| Swatch | Hex | Share of canvas |
|---|---|---|
| Amber | `#ffc131` | 9.7% |
| Cyan | `#24c8db` | 9.7% |
| Transparent | — | 75.3% |

## These are two palettes, not one

This is the single most important fact in this folder, so it is stated plainly:

**The ring mark shares no colour with the web palette.** Amber `#ffc131` and
cyan `#24c8db` do not appear anywhere in `index.html` or `app/src/index.css`.
The nearest web token is `--pro` (`#f59e0b`), and it is not a match — it is a
different hue used for a different purpose.

So VibeCode QA currently ships two visual identities:

- **Indigo `VQ`** on the website, the web app, and every favicon.
- **Amber + cyan rings** on the desktop app's dock icon and installers.

Neither is wrong; they simply were never reconciled. Until somebody decides,
`README.md` records which one is canonical for which surface, and no asset in
this folder mixes them. Do not "harmonise" them by recolouring one to match the
other in a drive-by change — recolouring the rings needs the vector source that
does not exist yet, and recolouring the web accent would touch 17 pages plus the
dashboard.
