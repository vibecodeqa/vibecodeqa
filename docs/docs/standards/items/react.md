# React

React is the UI framework used for component rendering and stateful browser interfaces.

## Upstream references

- [React Documentation](https://react.dev/)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

## What upstream owns

- component and hook semantics
- Rules of Hooks
- React API behavior

## What VCQA owns

- component/routing conventions only where the stack shape requires them.
- detection mapping for hook and component anti-patterns.

## Detection signals

- `react` and `react-dom` dependencies
- `*.tsx` components
- routing/build dependencies that indicate SPA or SSR shape

## Composed standards

- [React SPA](../stacks/react-spa.md)
- [Tauri React Desktop](../stacks/tauri-react-desktop.md)

## Combination-born guidelines

- React plus static hosting creates a no-server boundary: client guards cannot protect private data.
- React plus VS Code webviews requires CSP and command bridge rules that normal React docs do not cover.
- React plus Tauri means privileged operations move behind Tauri commands, not frontend code.
