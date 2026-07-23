# Web Accessibility

Accessibility covers semantics, keyboard behavior, focus, ARIA, and contrast for UI surfaces.

## Upstream references

- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## What upstream owns

- WCAG success criteria
- ARIA widget patterns
- baseline accessibility semantics

## What VCQA owns

- code-level detection mapping.
- minimum acceptance gates for UI stacks.

## Detection signals

- web UI files such as `index.html` or `*.tsx`
- component libraries
- docs or app pages rendered in a browser

## Composed standards

- [React SPA](../stacks/react-spa.md)

## Combination-born guidelines

- React plus custom controls requires keyboard and focus behavior tied to component state.
- Docs KB plus search/navigation requires accessible document structure and skip-friendly headings.
- VS Code webviews need accessibility checks inside a constrained host shell.
