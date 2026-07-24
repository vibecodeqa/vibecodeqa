# UI and component tests

## R-UI-1 - Component tests assert user-visible behavior

**Rule.** UI and component tests must query rendered output by role, label, text, or other
user-visible semantics instead of component internals, CSS classes, or implementation
state.

**Why.** Internal assertions break on refactors and miss regressions users can see.
User-centered queries also exercise part of the accessibility contract.

**vcqa.** Flag component tests dominated by `querySelector`, class-name checks,
test-id-only querying, shallow rendering, or direct state inspection when role/label/text
queries would be possible.

**References.**

- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>

## R-UI-2 - Async UI states are tested

**Rule.** Async UI surfaces must test loading, success, empty, and error states when those
states exist.

**Why.** UI often fails in transitions: blank loading screens, unhandled errors, stale
empty states, and disabled controls that never recover.

**vcqa.** Flag async components with tests that assert only the successful final state and
never assert loading or error output.

**References.**

- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>

## R-A11Y-1 - Interaction tests use accessible controls

**Rule.** Component and UI tests that click, type, select, or navigate must target
accessible controls when the UI is intended for users.

**Why.** A test that can only interact through invisible selectors can pass while keyboard
and assistive-technology users cannot operate the UI.

**vcqa.** Flag UI tests that interact exclusively through hidden selectors, raw DOM nodes,
or brittle component internals instead of accessible controls.

**References.**

- Testing Library Guiding Principles:
  <https://testing-library.com/docs/guiding-principles>

