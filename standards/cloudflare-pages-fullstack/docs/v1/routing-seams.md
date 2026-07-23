# Routing Seams

## R-SEAM-1 - Reserve the API namespace

**Rule.** Pages Functions own the API namespace, normally `/api/*`; SPA routes must not
shadow that namespace.

**Why.** A route collision can cause API requests to return `index.html` or allow UI
routing to bypass expected server behavior.

```text
good:
  functions/api/users.ts
  src/routes/settings.tsx

bad:
  functions/api/users.ts
  src/routes/api/users.tsx
```

**vcqa.** Compare frontend route declarations and Functions paths for namespace overlap.

## R-SEAM-2 - Preserve SPA fallback without swallowing APIs

**Rule.** Unknown UI routes fall back to the frontend entrypoint, but API routes still
dispatch to Functions or return API-shaped 404s.

**Why.** Deep links and API calls have different failure modes. A Pages deployment must
make both predictable.

**vcqa.** Check routing config and preview smoke tests for one UI deep link and one missing
API route.

## R-SEAM-3 - Keep route parameters consistent across the seam

**Rule.** Dynamic route names used by frontend links and Function handlers should describe
the same resource identity.

**Why.** Divergent route parameters create subtle bugs such as `/accounts/:id` in the UI
calling `/api/customers/:customerId` without a documented mapping.

**vcqa.** Compare route patterns and API client calls; flag undocumented mismatches.

## R-SEAM-4 - Use explicit API clients or fetch wrappers

**Rule.** Browser code should call same-origin APIs through a small API client or wrapper,
not through scattered ad hoc fetch strings.

**Why.** A seam is easier to validate when URL construction, auth headers, error handling,
and response parsing are centralized.

**vcqa.** Flag repeated literal `/api/` fetches where no API client abstraction exists.
