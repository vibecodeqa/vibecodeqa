# 6 · Forms

Forms are where a static SPA touches the outside world hardest: user input goes in the
browser, but the app has **no server of its own** to enforce anything. That reframes every
rule here. Client-side validation is UX — it makes the form pleasant and fast — but it is
**never** the security boundary, because the real check has to happen at the external API or
platform provider that actually mutates data. Beyond that, forms are an accessibility surface
(labels, error wiring, focus) and a double-submit hazard. The house tools are **React Hook
Form** for anything past a trivial input and **Zod** for a schema shared with the typed API
boundary.

## Rules

### R-FORM-1 · Controlled inputs by default

**Rule.** Inputs are controlled (value + change handler, or an RHF-registered field) so form
state has one source of truth; uncontrolled DOM-read-on-submit is not the default.

**Why.** Controlled inputs keep the rendered UI and the data model in lockstep — validation,
conditional fields, and derived UI all read from one place. Ad-hoc `document`/`ref` reads at
submit time scatter the truth and break the moment a field's value needs to drive anything.

```tsx
// ✅ GOOD — RHF-registered (controlled under the hood)
<input {...register('email')} aria-invalid={!!errors.email} />
```

**vcqa.** Text inputs are controlled or RHF-registered; flag `<input>` read via `ref.current.value`
/ `document.querySelector` at submit as the primary data path.

### R-FORM-2 · A form library past trivial

**Rule.** Anything beyond a single-field/trivial form uses a form library (house choice:
**React Hook Form**) rather than a hand-rolled tangle of `useState` per field.

**Why.** Multi-field forms hand-managed with one `useState` each accrete duplicated validation,
manual error tracking, and re-render storms on every keystroke. RHF centralizes registration,
validation, dirty/touched tracking, and submit state — less code and fewer bugs, at negligible
bundle cost.

**vcqa.** Forms with more than ~2 fields use `react-hook-form`; flag forms driving many fields
through individual `useState` + manual validation.

### R-FORM-3 · Zod schema shared with the API boundary

**Rule.** Form validation uses a **Zod** schema, and that same schema (or its inferred type) is
the one used to validate/type the external API request and response boundary — a single source
of truth, not two hand-kept-in-sync definitions.

**Why.** The form and the API describe the same data. One Zod schema gives you the form
resolver, the TypeScript type (`z.infer`), and the boundary parser from R-DATA-4 — so a field
added or a constraint changed updates form and API together. Two separate definitions drift,
and drift means the form accepts what the provider rejects (or vice versa).

```ts
// schema shared by the form resolver and the API boundary
export const ProjectInput = z.object({
  name: z.string().min(1).max(80),
  budgetCents: z.number().int().nonnegative(),
});
export type ProjectInput = z.infer<typeof ProjectInput>;
```
```tsx
const form = useForm<ProjectInput>({ resolver: zodResolver(ProjectInput) });
```

**vcqa.** `zod` present; the form resolver schema is imported/reused where the API request/
response is validated; flag a form with a bespoke validation schema separate from the boundary
type.

### R-FORM-4 · Validate on submit, refine on blur

**Rule.** Validation runs on submit and, for a better feel, re-validates touched fields on blur/
change; it does not gate the very first keystroke of an untouched field with an error.

**Why.** Validating a field the user hasn't finished typing is hostile — errors flash before
there's anything to fix. Submit-time validation guarantees correctness at the moment it
matters; on-blur re-validation of already-touched fields gives fast feedback without nagging.
RHF's `mode: 'onTouched'` / `reValidateMode: 'onChange'` expresses this.

**vcqa.** Form validation triggers on submit; per-field errors surface after touch/blur, not on
mount of a pristine field.

### R-FORM-5 · Accessible errors wired to the field

**Rule.** Validation errors are programmatically associated with their input:
`aria-invalid` on the field, `aria-describedby` pointing at the error text, the message
rendered as text (not colour alone), and focus moved to the first invalid field on failed
submit.

**Why.** With no server round-trip to re-render a full error page, the client owns the entire
error experience. A screen-reader user must be told which field failed and why; a keyboard user
must land on it. Colour-only errors fail colour-blind users. This wiring is what makes an error
perceivable to everyone.

```tsx
<input
  id="email"
  {...register('email')}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}
```

**vcqa.** Invalid inputs carry `aria-invalid` + `aria-describedby` tied to rendered error text;
a focus-first-error path exists on submit failure; errors are not signalled by colour alone.

### R-FORM-6 · Client validation is UX, not security

**Rule.** Client-side validation is treated as UX only; the app assumes the external API /
platform provider **re-validates and authorizes** every mutation, and never relies on the
client check as the enforcement point.

**Why.** The SPA has no server of its own — its entire source ships to the browser, and any user
can bypass the form and call the API directly with arbitrary values (devtools, curl, a modified
bundle). Client validation exists to help honest users, not to stop dishonest ones. The
authoritative check lives where the data is actually written: the third-party API or platform
SDK provider. A repo that treats the client rule as the security boundary is broken by design.

!!! warning "The form is not a gate"
    Never assume a value is safe because the form validated it. Length caps, permission
    checks, ownership checks, uniqueness — all must be enforced server-side by the provider.
    The client copy is a courtesy.

**vcqa.** No comment/code implies client validation is the authorization/security check;
mutations target an external API/SDK that owns enforcement; sensitive gating is not
client-only.

### R-FORM-7 · Disable submit while pending

**Rule.** The submit control is disabled (and shows a pending state) from the moment a submit
starts until the request settles, preventing double-submit.

**Why.** Between click and the external API's response there is real latency and no server-side
idempotency you control. An un-disabled button lets an impatient user fire the mutation two or
three times — duplicate records, double charges. Disabling on `isSubmitting` closes the window.

```tsx
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving…' : 'Save'}
</button>
```

**vcqa.** Submit buttons disable on `isSubmitting`/pending; flag a submit handler that calls the
API without guarding against re-entry.

### R-FORM-8 · Labels tied to inputs; no placeholder-as-label

**Rule.** Every input has a real label associated via `htmlFor`/`id` (or a wrapping `<label>`);
a placeholder is never the only label.

**Why.** A placeholder disappears on focus/input, leaving no persistent name for the field —
invisible to screen readers and a memory tax for everyone. An associated `<label>` is
announced, clickable to focus the field, and always visible. This is table stakes for a form to
be usable at all.

```tsx
// ✅ GOOD
<label htmlFor="email">Email</label>
<input id="email" type="email" {...register('email')} />
// ❌ BAD — placeholder pretending to be a label
<input placeholder="Email" {...register('email')} />
```

**vcqa.** Each input has an associated `<label htmlFor>` / wrapping label; flag inputs whose
only textual descriptor is `placeholder`.

### R-FORM-9 · Heavy inputs don't block the main thread

**Rule.** File and large-input handling (reading, parsing, hashing, image resize) runs without
freezing the UI — chunked/async APIs or a Web Worker for anything CPU-heavy, not a synchronous
main-thread loop.

**Why.** A static SPA has one main thread and no server to offload work to. A synchronous read
or parse of a multi-megabyte file locks the tab — no scroll, no cancel, no feedback. Async file
APIs (`File.stream()`, `FileReader` events) and a worker for heavy transforms keep the UI
responsive, and large uploads go straight to the provider/API rather than being buffered whole
in JS.

**vcqa.** File processing uses async/streamed APIs or a Web Worker for heavy work; flag
synchronous multi-MB reads/parses on the main thread; large uploads stream to the provider.

## Checklist

- [ ] Inputs controlled / RHF-registered by default (**R-FORM-1**)
- [ ] React Hook Form for anything past a trivial form (**R-FORM-2**)
- [ ] One Zod schema shared by form resolver and API boundary (**R-FORM-3**)
- [ ] Validate on submit, refine touched fields on blur (**R-FORM-4**)
- [ ] Errors wired with `aria-invalid`/`aria-describedby`, focus first error, not colour-only (**R-FORM-5**)
- [ ] Client validation treated as UX; provider re-validates every mutation (**R-FORM-6**)
- [ ] Submit disabled + pending state to block double-submit (**R-FORM-7**)
- [ ] Labels tied to inputs via `htmlFor`; no placeholder-as-label (**R-FORM-8**)
- [ ] File/large inputs handled off the main thread; uploads stream to the provider (**R-FORM-9**)
