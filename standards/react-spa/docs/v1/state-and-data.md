# 4 · State & data

A static SPA has **no backend of its own**. The only "server" is an external API or a
platform SDK, reached from code that already lives in the user's browser. That single fact
drives this page twice over: it decides where secrets may live (nowhere client-side), and it
decides how remote data is fetched (through a cache library that models failure, because
there is no server layer to hide a bad response behind). State comes first — keep it local,
keep it derived, and never hand-mirror what the API already owns.

## Rules

### R-DATA-1 · No secret in client source or bundle

**Rule.** No private secret — API key, bearer token, DB credential, signing key, `client_secret` —
appears anywhere in client source or in the built `dist/` bundle; `import.meta.env` is used
**only** for values that are safe to publish, and secrets never carry a `VITE_` prefix.

**Why.** This is the archetype's #1 non-negotiable. A static SPA ships its **entire** source
to the browser: everything in the bundle is readable with view-source or a devtools network
tab. There is no server tier to keep a secret in. Worse, Vite **inlines every `VITE_`-prefixed
env var into the bundle at build time** as a literal string — so `VITE_API_KEY` is not
"configuration," it is a secret published to every visitor. A private credential belongs
behind the API/SDK provider (the provider authenticates the request server-side, or issues a
short-lived scoped token via an OAuth/redirect flow); the client holds at most a public,
revocable, rate-limited identifier.

```ts
// ❌ BAD — inlined into the bundle, visible to every visitor
const key = import.meta.env.VITE_OPENAI_API_KEY;
fetch('https://api.openai.com/v1/chat', {
  headers: { Authorization: `Bearer ${key}` },
});

// ✅ GOOD — only public config in the client; the provider holds the secret
const apiBase = import.meta.env.VITE_API_BASE_URL; // public, safe to publish
fetch(`${apiBase}/chat`, {
  headers: { Authorization: `Bearer ${session.accessToken}` }, // short-lived, user-scoped
});
```

!!! warning "`VITE_` means public"
    Treat the `VITE_` prefix as a label that says "print this on a billboard." If a value
    would be dangerous on a billboard, it must not be a `VITE_` var — route it through the
    platform SDK or a provider endpoint that authenticates server-side.

**vcqa.** No high-entropy strings or known key shapes (`sk-`, `AKIA`, `-----BEGIN … KEY-----`,
JWT literals) in `src/**` or `dist/**`; no `VITE_`-prefixed env name matching
`/KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL/i`; secrets absent from `.env` files that are committed.

### R-DATA-2 · Fetch remote data through a server-cache library

**Rule.** Remote reads go through a server-state / query library (house choice: **TanStack
Query**), not ad-hoc `useEffect` + `fetch` scattered across components.

**Why.** Data owned by an external API is not React state — it is a cache of something that
lives elsewhere. A query library gives caching, request de-duplication, retries, background
refetch, and consistent loading/error status for free. Hand-rolled `useEffect` + `fetch`
re-implements all of that badly: duplicate in-flight requests, waterfalls, stale closures,
missing cleanup. Because the SPA has no server to smooth over a slow or failing upstream, the
client must be disciplined about caching and retry itself.

```tsx
// ✅ GOOD — cache, dedupe, retry, status all handled
const { data, isPending, isError } = useQuery({
  queryKey: ['project', id],
  queryFn: ({ signal }) => getProject(id, signal),
});
```

**vcqa.** `@tanstack/react-query` (or an equivalent server-cache lib) present and used for
remote reads; flag components that call `fetch`/`axios` directly inside `useEffect` for data
loading.

### R-DATA-3 · Model loading AND error states

**Rule.** Every remote read renders a distinct **loading** state and a distinct **error**
state; a failed fetch never renders as empty, blank, or a permanent spinner.

**Why.** With no server, the client is the only place a failure can surface. A network blip,
a 500 from the third-party API, or an expired token must become visible UI (a retry, a
message), not a white screen. "Happy-path only" rendering is a correctness bug in this
archetype, not a polish gap.

```tsx
// ✅ GOOD
if (isPending) return <Spinner label="Loading project…" />;
if (isError)   return <ErrorState error={error} onRetry={refetch} />;
return <ProjectView project={data} />;
```

**vcqa.** Components consuming query results branch on both the pending and error flags (or an
error boundary wraps them); flag a query whose error case has no rendered path.

### R-DATA-4 · Validate responses at the boundary

**Rule.** Data from an external API is parsed/validated at the fetch boundary (e.g. a Zod
schema) into a typed value; responses are never blind-cast with `as` to a TypeScript type.

**Why.** An external API is untrusted input — its shape can drift, a field can go null, an
error envelope can arrive where a success body was expected. A cast (`data as Project`) is a
compile-time lie that does nothing at runtime; the malformed value then crashes deep in the
render tree where the cause is unrecoverable. Validating once at the boundary turns a remote
contract violation into one catchable error, and gives you a single Zod schema shared with
forms (see R-FORM-3).

```ts
// ❌ BAD — a lie the runtime never checks
const project = (await res.json()) as Project;

// ✅ GOOD — parsed and typed at the seam
const project = ProjectSchema.parse(await res.json());
```

**vcqa.** Fetch/response bodies pass through a validator (`.parse`/`.safeParse` or equivalent)
before use; flag `as <Type>` casts applied directly to `await res.json()` / response data.

### R-DATA-5 · Abort in-flight requests on unmount

**Rule.** Fetches pass an `AbortSignal` and are cancelled when the component unmounts or the
query key changes.

**Why.** A static SPA is a long-lived single page; users navigate between views without a full
reload. A fetch that resolves after its component has unmounted either throws a state-update
warning or, worse, races a newer request and shows stale data. Passing the signal (TanStack
Query supplies one to `queryFn`) makes cancellation automatic.

```ts
async function getProject(id: string, signal?: AbortSignal) {
  const res = await fetch(`${apiBase}/projects/${id}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return ProjectSchema.parse(await res.json());
}
```

**vcqa.** `fetch` calls in data-loading code accept a `signal`; raw `useEffect` fetches
without an `AbortController` cleanup are flagged.

### R-DATA-6 · Handle offline and failed fetch gracefully

**Rule.** The app degrades gracefully when a request fails or the network is offline — a
usable message and a retry path, not an unhandled rejection or a crash.

**Why.** There is no server to catch, log, and translate an upstream failure. The client is
the last line of defence, so a dropped connection or a 503 from the third-party API must
resolve to recoverable UI. Retries should be bounded (the query lib's default backoff), not an
infinite hammer on a downed endpoint.

**vcqa.** Query error boundaries or per-query error UI exist; global `unhandledrejection`
paths from fetches are absent; retry counts are bounded (not `retry: Infinity`).

### R-STATE-1 · Local-first state

**Rule.** Component state starts with `useState` / `useReducer` and is lifted only as far as
the nearest common ancestor that needs it; global stores are not the default.

**Why.** Most state is local — an input value, an open/closed toggle, a hovered row. Reaching
for a global store or Context on day one couples unrelated components and makes every change a
cross-cutting one. Local state keeps the blast radius of a change to one subtree and keeps
re-renders scoped.

```tsx
// ✅ GOOD — local until proven otherwise
const [open, setOpen] = useState(false);

// ❌ BAD — global store for a single component's toggle
const open = useUiStore((s) => s.projectPanelOpen);
```

**vcqa.** Presence of a global store (Redux/Zustand) whose slices are each read by a single
component is flagged as over-globalized; leaf UI state uses local hooks.

### R-STATE-2 · Derive, don't duplicate

**Rule.** Values computable from existing state or props are derived during render (optionally
`useMemo`), not copied into a second `useState` and kept in sync by hand.

**Why.** Duplicated state drifts. A `useEffect` that copies a prop into state, or a second
`useState` mirroring a filtered list, creates two sources of truth that fall out of sync on
the first edge case. Derivation has exactly one source and cannot drift.

```tsx
// ❌ BAD — duplicated, kept in sync by an effect
const [full, setFull] = useState(user);
useEffect(() => setFull(user), [user]);

// ✅ GOOD — derived every render
const fullName = `${user.first} ${user.last}`;
const active = items.filter((i) => i.active);
```

**vcqa.** Flag `useState` whose only writer is a `useEffect` copying a prop/other state;
flag state that mirrors a filter/sort/format of existing state.

### R-STATE-3 · Don't hand-mirror server data in client state

**Rule.** Data owned by the external API is not copied into `useState`/Context/a store and
manually re-synced; it is held by the server-cache library (R-DATA-2) as the single source of
truth.

**Why.** Server data in `useState` immediately goes stale and forces you to reinvent
invalidation, refetch, and cache coherence — the exact problems the query library already
solves. Two copies of the same remote entity guarantees a UI that shows different values in
different places.

```tsx
// ❌ BAD — a stale hand-managed copy of remote data
const [projects, setProjects] = useState<Project[]>([]);
useEffect(() => { getProjects().then(setProjects); }, []);

// ✅ GOOD — the cache owns it
const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
```

**vcqa.** Flag `useState`/store slices populated from a fetch and re-synced by effects; remote
entities live in the query cache, not component state.

### R-STATE-4 · Context for low-frequency global only

**Rule.** React Context carries low-frequency, broadly-read values (theme, current session/
user, locale); high-frequency or large-fan-out state uses a small dedicated store, not Context.

**Why.** Every Context consumer re-renders on **every** provider value change. That is fine for
a theme that flips rarely; it is a performance trap for state that updates on keystroke or
animation frame, because it re-renders the whole subtree. Split by update frequency, not by
"is it global."

**vcqa.** Context providers hold stable/low-frequency values; a Context whose value changes on
high-frequency input (typing, scroll, timer) is flagged for a store or local state.

### R-STATE-5 · Reach for a store only when the pain is real

**Rule.** A client store (house choice: **Zustand**) is introduced only when prop-drilling or
Context re-render churn is a demonstrated problem; Redux is not the default for a new SPA.

**Why.** State libraries are a cost — bundle weight, indirection, boilerplate — that a static
app pays on every load. Add one when local state and a lifted ancestor genuinely stop scaling
(deep prop-drilling, cross-cutting client state read by many components). Prefer a minimal
store (Zustand) over Redux's ceremony unless the team already runs Redux at scale.

!!! note "Order of reach"
    `useState` → lift to common ancestor → Context (low-frequency) → small store (Zustand).
    Server data skips this ladder entirely and lives in the query cache (R-STATE-3).

**vcqa.** If a store is present, prop-drilling depth or Context churn justifies it; a
brand-new SPA that ships Redux for trivial state is flagged; minimal-store choice preferred.

## Checklist

- [ ] No API key / token / credential in client source or `dist/`; no secret behind a `VITE_` var (**R-DATA-1**)
- [ ] Remote reads go through a server-cache library, not ad-hoc `useEffect` + `fetch` (**R-DATA-2**)
- [ ] Every remote read renders distinct loading and error states (**R-DATA-3**)
- [ ] External responses validated/typed at the boundary, never blind-cast (**R-DATA-4**)
- [ ] In-flight requests carry an `AbortSignal` and cancel on unmount (**R-DATA-5**)
- [ ] Offline / failed fetch degrades gracefully with bounded retries (**R-DATA-6**)
- [ ] State starts local (`useState`/`useReducer`), lifted only as needed (**R-STATE-1**)
- [ ] Derived values are computed, not duplicated into state (**R-STATE-2**)
- [ ] Server data lives in the query cache, not hand-mirrored in client state (**R-STATE-3**)
- [ ] Context used for low-frequency global only; high-frequency uses a store (**R-STATE-4**)
- [ ] A client store appears only when prop-drilling/Context churn is real; no default Redux (**R-STATE-5**)
