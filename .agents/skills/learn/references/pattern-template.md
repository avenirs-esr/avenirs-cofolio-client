# Pattern / convention template

Patterns live in a thematic conventions skill (`<slug>-testing-conventions`,
`<slug>-api-conventions`, …). Each rule is one section in SKILL.md — or in
`references/<topic>.md` once the skill holds many rules, with SKILL.md listing them as
one-liners.

## Rule section format

~~~markdown
### Prefer `vi.waitFor` over `await nextTick()` for async assertions

**Rule:** In component tests, wait for async UI updates with `vi.waitFor(...)` instead of
one or more `await nextTick()` calls.

**Why:** `nextTick` only flushes one Vue render cycle; when the update depends on a
resolved promise (API mock, store action) it may need several ticks, which makes tests
flaky or forces `nextTick` chains. `vi.waitFor` retries until the assertion passes or
times out.

**Applies to:** `*.spec.ts` component tests under `src/**`. Not needed for purely
synchronous prop/slot rendering.

❌ Avoid
```ts
await wrapper.find('button').trigger('click')
await nextTick()
await nextTick()
expect(wrapper.text()).toContain('Saved')
```

✅ Prefer
```ts
await wrapper.find('button').trigger('click')
await vi.waitFor(() => expect(wrapper.text()).toContain('Saved'))
```

**Source:** stated by the user on <YYYY-MM-DD> / seen in `<path>`.
~~~

## Guidance

- Base the example on real code from the repo when one exists (cite the path); otherwise
  write a minimal, realistic one in the project's stack and style.
- If the new rule contradicts an existing one in the skill, replace the old one and say
  so in the report — don't keep both.
- Add the rule's keywords (APIs, library names, situations) to the skill description so
  it triggers when someone writes that kind of code.
