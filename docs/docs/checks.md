---
icon: lucide/list-checks
---

# The 34 checks

VibeCode QA runs **34 checks across 7 categories**. Each check is scored 0–100 and weighted into a single composite score (weights sum to 100; the five AI Analysis checks are weight 0 — informational). Every issue in the report ships with a copy-pasteable fix prompt.

## Foundations <small>(23% of score)</small>

### Project Structure

`weight 6%` · `high priority`

**What it checks.** Checks for standard project files: package.json, tsconfig.json, LICENSE, README, .gitignore, lockfile. Verifies test-to-source file ratio and that essential scripts (test, build) exist.

!!! warning "Why it matters"
    Missing config files cause build failures in CI. Missing LICENSE makes the project legally ambiguous. No lockfile means non-reproducible builds — a dependency update can break production silently.

!!! tip "How to fix"
    Ensure every project has package.json, tsconfig.json, LICENSE, .gitignore, and a lockfile. Add 'test' and 'build' scripts. Aim for at least one test file per source file.

### Lint

`weight 5%` · `high priority`

**What it checks.** Runs the project's linter (Biome or ESLint, auto-detected) and counts errors and warnings. Lint rules catch bugs, enforce consistency, and prevent common mistakes before they reach production.

!!! warning "Why it matters"
    Unlinted code accumulates inconsistencies and latent bugs. Studies show that projects with active linting have 15-20% fewer production defects (Microsoft Research, 2019).

!!! tip "How to fix"
    Fix all lint errors. Warnings can be addressed incrementally. If no linter is configured, add Biome (@biomejs/biome) — it's the fastest linter for TypeScript with zero config needed.

### Type Check

`weight 6%` · `critical priority`

**What it checks.** Runs tsc --noEmit to find TypeScript compilation errors. Type errors mean the code may crash at runtime in ways the compiler could have prevented.

!!! warning "Why it matters"
    Type errors are bugs. Every unresolved type error is a potential runtime crash. TypeScript's type system exists to prevent entire categories of bugs — ignoring it negates its value.

!!! tip "How to fix"
    Fix all type errors. If you're migrating from JavaScript, enable strict mode gradually — start with 'strict: true' and fix errors file by file.

### Type Safety

`weight 3%` · `medium priority`

**What it checks.** Counts unsafe type patterns: 'as any' casts, explicit ': any' annotations, @ts-ignore directives, @ts-nocheck, and non-null assertions (!.). Each weakens the type system's protection.

!!! warning "Why it matters"
    'as any' silences the type checker at that point — any bug the types would have caught now slips through. @ts-ignore and @ts-nocheck disable type checking entirely for a line or file. Accumulated 'any' usage correlates with higher defect density.

!!! tip "How to fix"
    Replace 'as any' with proper types or type guards. Use 'unknown' instead of 'any' when the type is genuinely unknown. Remove @ts-ignore comments by fixing the underlying type issue.

### Code Standards

`weight 3%` · `medium priority`

**What it checks.** Checks coding conventions: file naming (PascalCase for components, kebab-case for modules), file size limits (>300 lines flagged), code smells (console.log, var, ==, eval, innerHTML, TODO/FIXME), config hygiene (strict mode), and framework best practices (Tailwind vs inline styles).

!!! warning "Why it matters"
    Large files are hard to review and test. console.log in production leaks internal data. var causes hoisting bugs. == causes type coercion surprises. eval/innerHTML are security vulnerabilities. Inconsistent naming makes the codebase harder to navigate.

!!! tip "How to fix"
    Split files over 300 lines. Replace console.log with a proper logger or remove it. Use const/let, ===, and safe DOM APIs. Enable TypeScript strict mode.

## Quality <small>(26% of score)</small>

### Error Handling

`weight 3%` · `high priority`

**What it checks.** Detects poor error handling: empty catch blocks, throw string literals, swallowed .catch(), floating promises, JSON.parse without try-catch, infinite loops, process.exit() in library code, and missing unhandledRejection handlers.

!!! warning "Why it matters"
    Empty catch blocks silently swallow errors. throw 'string' loses stack traces. Unhandled JSON.parse crashes on malformed input. Missing Error Boundaries in React cause the entire app to crash on render errors. Unhandled promise rejections crash Node.js 15+.

!!! tip "How to fix"
    Handle or log every catch. Use throw new Error() for stack traces. Wrap JSON.parse in try-catch. Add Error Boundaries in React. Add process.on('unhandledRejection') in server entry points.

### Complexity

`weight 5%` · `high priority`

**What it checks.** Measures cognitive complexity of each function: how many branches (if/else/switch/for/while/ternary/&&/||) and how many lines. Functions over 60 lines or with complexity over 15 are flagged.

!!! warning "Why it matters"
    Complex functions are the #1 source of bugs. Research shows defect density increases exponentially with cyclomatic complexity above 10 (McCabe, 1976). Complex code is also harder to review, test, and modify safely.

!!! tip "How to fix"
    Extract complex functions into smaller ones. Use early returns to reduce nesting. Replace conditional chains with lookup tables or strategy patterns. Aim for functions under 30 lines with complexity under 10.

### Duplication

`weight 5%` · `medium priority`

**What it checks.** Detects copy-pasted code blocks of 6+ lines across source files. Duplication is measured as a percentage of total source lines involved in duplicate blocks.

!!! warning "Why it matters"
    Duplicated code means bugs must be fixed in multiple places. Miss one copy and the bug persists. DRY (Don't Repeat Yourself) violations increase maintenance cost linearly with each copy.

!!! tip "How to fix"
    Extract duplicated logic into shared functions or modules. If two files share the same pattern, create a helper. If the duplication is across repos, consider vendoring a shared module.

### Documentation

`weight 3%` · `low priority`

**What it checks.** Checks README quality (existence, length, sections) and JSDoc coverage (what percentage of exported functions/classes have documentation comments).

!!! warning "Why it matters"
    Undocumented code is hard to onboard to and easy to misuse. Missing README means new contributors can't get started. Undocumented exports become tribal knowledge that leaves when people leave.

!!! tip "How to fix"
    Write a README with: what it does, how to install, how to run, how to develop. Add JSDoc comments to all public exports — even a one-line description helps.

### React Patterns

`weight 3%` · `high priority`

**What it checks.** Checks React-specific patterns: conditional hook calls (violates Rules of Hooks), missing key props in .map(), index as key, prop spreading on DOM elements, and excessive inline handlers.

!!! warning "Why it matters"
    Conditional hooks cause React to crash at runtime. Missing keys cause incorrect reconciliation — items can swap, duplicate, or lose state. Index keys break when lists are reordered or filtered.

!!! tip "How to fix"
    Never call hooks inside conditions, loops, or nested functions. Always provide a unique, stable key in .map(). Avoid spreading unknown props onto DOM elements. Extract inline handlers for readability.

### Accessibility

`weight 4%` · `high priority`

**What it checks.** Checks common accessibility violations: images without alt text, click handlers on non-interactive elements without keyboard support, form controls without labels, autoFocus usage, positive tabIndex, and missing html lang attribute.

!!! warning "Why it matters"
    1 in 4 adults has a disability (CDC). Missing alt text makes images invisible to screen readers. Click-only divs exclude keyboard users. Unlabeled inputs are unusable with assistive technology. Missing lang attribute breaks screen reader pronunciation.

!!! tip "How to fix"
    Add alt text to all images (use alt="" for decorative). Use <button> for clickable elements, not <div onClick>. Label all form controls with <label>, aria-label, or aria-labelledby. Set lang on <html>.

### Best Practices

`weight 3%` · `medium priority`

**What it checks.** Advisory check for industry-standard CI/CD, supply chain, and repo hygiene practices. Checks: GitHub Actions with explicit permissions, OIDC instead of long-lived tokens, pinned action SHAs, frozen lockfile in CI, committed lockfile, engine constraints, SECURITY.md, CODEOWNERS, CONTRIBUTING.md, .env.example, pre-commit hooks, automated dependency updates (Dependabot/Renovate).

!!! warning "Why it matters"
    Missing CI/CD practices lead to supply chain attacks (tj-actions breach affected 23,000 repos in 2025). Long-lived tokens can be stolen from CI logs. Unpinned actions allow tag-poisoning. No lockfile means non-reproducible builds. No SECURITY.md means vulnerabilities go unreported.

!!! tip "How to fix"
    Pin third-party actions to SHA. Use OIDC trusted publishing instead of tokens. Set explicit permissions in workflows. Add SECURITY.md, CODEOWNERS, and CONTRIBUTING.md. Configure Dependabot or Renovate for automated dependency updates. Add pre-commit hooks.

## Testing <small>(15% of score)</small>

### Testing

`weight 15%` · `critical priority`

**What it checks.** Deep assessment of test quality across 6 dimensions: pyramid presence (unit/integration/component/E2E layers), test execution (pass/fail), coverage (statement/branch/line/function), file pairing (test file per source file), test quality (assertion density, mock ratio, snapshot ratio), and E2E tool detection (Playwright/Cypress).

!!! warning "Why it matters"
    Code without tests is code you can't safely change. Missing test layers mean entire categories of bugs go undetected: unit tests catch logic bugs, integration tests catch API contract breaks, E2E tests catch user-visible regressions. Low coverage means large portions of code are never exercised.

!!! tip "How to fix"
    Follow the testing pyramid: many unit tests, some integration tests, fewer E2E tests. Aim for >80% branch coverage. Every source file should have a corresponding test file. Use Playwright for E2E if you have a web frontend.

## Architecture <small>(9% of score)</small>

### Architecture

`weight 5%` · `high priority`

**What it checks.** Analyzes the import graph to detect structural problems: circular dependencies, god modules (imported by >50% of files), orphan modules (dead code), high fan-out (importing too many modules), and connector modules (high coupling). Generates an SVG architecture diagram.

!!! warning "Why it matters"
    Circular dependencies create build order issues and make refactoring impossible without breaking changes. God modules become bottlenecks — any change ripples through the entire codebase. High coupling means you can't change one module without testing everything it touches.

!!! tip "How to fix"
    Break circular deps by extracting shared types to a separate file. Split god modules by concern. Reduce fan-out by co-locating related code. Use dependency injection for loose coupling.

### Performance

`weight 4%` · `medium priority`

**What it checks.** Detects barrel imports that defeat tree-shaking, heavy dependencies with lighter alternatives, static imports of large libraries that could be lazy-loaded, and runtime CSS-in-JS overhead.

!!! warning "Why it matters"
    Barrel files (index.ts re-exports) prevent bundlers from tree-shaking unused code, bloating bundles by 2-10x. Heavy dependencies like moment.js add 300KB when date-fns does the same in 7KB. Static imports of visualization libraries delay initial page load.

!!! tip "How to fix"
    Replace barrel re-exports with direct imports. Swap heavy deps for lighter alternatives. Use dynamic import() for large libraries only needed on interaction. Prefer zero-runtime CSS (Tailwind, CSS Modules) over styled-components.

## Security <small>(16% of score)</small>

### Secrets

`weight 6%` · `critical priority`

**What it checks.** Scans source files for hardcoded secrets: AWS keys, GitHub tokens, Stripe keys, OpenAI/Anthropic API keys, Google API keys, private keys, and generic secret patterns. Checks 14 regex patterns against every non-test source file. Delegates to gitleaks when installed.

!!! warning "Why it matters"
    Hardcoded secrets in source code are the #1 cause of credential leaks. Once pushed to Git, secrets are in the history forever — even if deleted in a later commit. Leaked API keys can be exploited within minutes by automated scanners.

!!! tip "How to fix"
    Never hardcode secrets. Use environment variables or a secret manager (Bitwarden, AWS Secrets Manager, Cloudflare Secrets). If a secret was committed, rotate it immediately — deleting the file is not enough.

### Security Patterns

`weight 5%` · `critical priority`

**What it checks.** Static analysis for 31 vulnerability patterns mapped to CWE IDs. Covers: XSS, injection, weak crypto, prototype pollution, path traversal, SSRF, credential storage (localStorage/sessionStorage/cookies/connection strings/hardcoded passwords), and missing security headers. Delegates to eslint-plugin-security when installed (adds ReDoS, timing attacks, non-literal require/fs).

!!! warning "Why it matters"
    These patterns represent the most commonly exploited vulnerabilities in web applications (OWASP Top 10). A single XSS or injection vulnerability can lead to account takeover, data theft, or complete system compromise.

!!! tip "How to fix"
    Replace innerHTML with textContent or DOM APIs. Never use eval(). Use parameterized queries for SQL. Use crypto.randomUUID() instead of Math.random() for tokens. Validate all user input before use in file paths or URLs.

### Dependencies

`weight 5%` · `high priority`

**What it checks.** Runs npm/pnpm audit to find known vulnerabilities (CVEs) in dependencies. Also checks for outdated packages — major version gaps indicate potential security debt and breaking API changes.

!!! warning "Why it matters"
    Vulnerable dependencies are the most common attack vector for supply chain attacks. 84% of codebases contain at least one known vulnerability in their dependencies (Synopsys OSSRA 2024). Outdated major versions often have unpatched security issues.

!!! tip "How to fix"
    Run 'pnpm audit' regularly and fix critical/high vulnerabilities immediately. Keep dependencies updated — use Dependabot or Renovate for automated PRs. Pin versions with a lockfile.

## AI Readiness <small>(11% of score)</small>

### Confusion Index

`weight 6%` · `high priority`

**What it checks.** Measures naming ambiguity that causes LLMs to misunderstand or edit the wrong code. Checks: file name confusability (Levenshtein distance + synonym detection), generic function/variable names, export name collisions across files, and ambiguous abbreviations.

!!! warning "Why it matters"
    GPT-4o drops 28.6 percentage points on code summarization when names are ambiguous (arXiv:2510.03178). LLMs editing similar-named files is the #1 reported failure mode in AI-assisted development. Generic names like process(), handle(), data cause models to misinterpret intent.

!!! tip "How to fix"
    Use descriptive, unique names. Avoid synonym files (utils.ts + helpers.ts — pick one). Avoid generic exports. Disambiguate abbreviations (use 'authentication' not 'auth' if both auth meanings exist in the codebase).

### Context Locality

`weight 5%` · `high priority`

**What it checks.** Measures how self-contained code is for LLM consumption. Checks: token density per file, import count, circular dependencies, and context sinks (files that import many modules but export little). Based on the finding that LLMs lose 30%+ accuracy for information in the middle of long contexts.

!!! warning "Why it matters"
    Files over ~4000 tokens exceed the 'sweet spot' for LLM attention (Liu et al. 2023 'Lost in the Middle'). Circular dependencies create infinite loops in LLM code navigation. Heavy import chains force LLMs to load many files, burning context window budget (Chroma 'Context Rot' 2025).

!!! tip "How to fix"
    Keep files under 400 lines / 4000 tokens. Limit imports to <15 per file. Break circular dependencies. Co-locate related code to reduce cross-file jumps.

## AI Analysis <small>(Pro · informational)</small>

### Doc Coherence

`weight Pro` · `high priority`

**What it checks.** LLM-powered analysis that detects contradictions between documentation and code. Finds stale README claims, incorrect JSDoc parameters, outdated CHANGELOG references, and comments that no longer match the implementation.

!!! warning "Why it matters"
    Stale documentation is worse than no documentation — it actively misleads developers and LLMs. When README says 'supports X' but the feature was removed, new contributors waste time. When JSDoc says a param is required but code treats it as optional, callers crash.

!!! tip "How to fix"
    Enable doc-coherence with a VibeCode QA Pro subscription. The LLM scans all documentation against the actual code and surfaces contradictions with specific file references.

### Code Coherence

`weight Pro` · `high priority`

**What it checks.** LLM-powered analysis that detects internal contradictions within the codebase itself. Finds inconsistent validation logic, conflicting defaults across modules, naming convention drift, dead config flags, and behavioral mismatches.

!!! warning "Why it matters"
    Incoherent codebases are the #1 source of 'it works on my machine' bugs. When module A validates email with regex and module B uses a different regex, some emails pass one and fail the other. When timeouts differ across modules, race conditions emerge under load.

!!! tip "How to fix"
    Enable code-coherence with a VibeCode QA Pro subscription. The LLM analyzes cross-module patterns and surfaces behavioral contradictions that static analysis cannot detect.

### Comment Staleness

`weight Pro` · `medium priority`

**What it checks.** Detects stale comments: TODOs older than 6 months, numeric claims that don't match code ("handles 3 cases" but switch has 5), commented-out code blocks, and @deprecated without replacement. LLM-powered semantic mismatch detection with Pro.

!!! warning "Why it matters"
    Stale comments mislead developers and AI agents. A TODO from 2024 wastes attention. A comment saying '3 cases' when there are 5 causes readers to miss branches. Commented-out code blocks signal incomplete refactoring and confuse LLM context windows.

!!! tip "How to fix"
    Delete TODOs that won't be done — create issues instead. Delete commented-out code (it's in git history). Update numeric claims when adding branches. Add replacement info to @deprecated.

### Dead Patterns

`weight Pro` · `high priority`

**What it checks.** Detects leftover code from incomplete refactors — the signature debt of AI-assisted development. Finds fallback code paths to old implementations, parallel systems doing the same thing, dead defensive guards, hardcoded feature flags with unreachable branches, orphaned abstractions, and redundant wrappers.

!!! warning "Why it matters"
    Vibe-coded projects accumulate dead patterns fast. When AI refactors code, it creates fallbacks to the old way 'just in case' — but those fallbacks never get cleaned up. Over time, you end up with two implementations of everything, config flags that are always true, and catch blocks that fall back to code that should have been deleted months ago. This doubles the surface area for bugs and confuses both humans and AI tools navigating the codebase.

!!! tip "How to fix"
    Enable dead-patterns with a VibeCode QA Pro subscription. The LLM analyzes code clusters to find refactor leftovers that static analysis cannot detect — parallel implementations, dead fallbacks, and orphaned abstractions.

### Test Audit

`weight Pro` · `high priority`

**What it checks.** Detects fake, shallow, and misleading tests — the 'test theater' that inflates coverage without verifying behavior. Finds empty test bodies, trivial assertions (expect(true).toBe(true)), weak-only checks (.toBeDefined), mock-heavy tests, skipped tests, and tests whose names don't match what they actually verify.

!!! warning "Why it matters"
    AI-generated tests often look real but test nothing. An empty test body always passes. expect(true).toBe(true) is a tautology. Tests with more mocks than assertions test the mock setup, not your code. This creates a false sense of safety — your coverage number goes up while your actual protection stays zero. Refactors break real behavior but all tests still pass because they never tested real behavior.

!!! tip "How to fix"
    Enable test-audit with a VibeCode QA Pro subscription. The LLM analyzes each test to determine if its assertions actually verify the behavior described in its name.

