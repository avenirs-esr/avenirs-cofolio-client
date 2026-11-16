# Consumer and test migration checklist

Search the entire workspace for the original component directory, its basename, public type/stub names, old i18n prefix, and every `vi.mock` path. Include `.vue`, `.ts`, `.tsx`, `.json` and any docs or stories that reference it. Inspect and retain existing user edits; don't discard previously fixed tests.

| Location | Import / test concern |
|---|---|
| Moved component, nested children, composables | Replace `@/` app aliases with `#shared/*` or public package imports; remove app-only state or use props/injection where appropriate; preserve props, emits, slots, styles and assets. |
| `packages/shared/src/ui/index.ts` | Export runtime component, and types/stubs if users need them. Root `src/index.ts` already re-exports `#shared/ui`. |
| Cofolio + Backoffice view/component imports | Import the named component from `@avenirs-esr/shared`; adjust stubs and types imports too; do not deep-import `packages/shared/src/` from apps. |
| Moved `.test.ts` / `.stub.ts` | Fix subject import, `vi.mock` module specifiers, mock factories, any copied app-only fixtures and i18n setup. Shared tests commonly use `#shared/ui/...`, `#shared/test-utils/unit/index` and `BddTest()`; compare adjacent shared UI tests. |
| Existing consumer tests in both apps | Fix component imports, stub imports, `vi.mock` paths, component stubbing and snapshots/translated text expectations. Tests may have been manually changed already: verify instead of rewriting. |

`packages/shared/vitest.config.ts` runs UI tests in a jsdom project; `packages/shared/vitest-setup.ts` initializes shared test behavior. Inventory the moved component and **every consumer component/view whose code or test changed** in shared, Cofolio and Backoffice. Find their colocated `*.test.ts` files, including tests the user already fixed manually, and run every impacted test file. Use explicit paths relative to each package root, grouping files by package:

```bash
pnpm --filter @avenirs-esr/shared exec vitest run src/ui/components/<category>/<ComponentName>/<ComponentName>.test.ts src/ui/components/<category>/<SharedConsumer>/<SharedConsumer>.test.ts
pnpm --filter avenirs-cofolio-client exec vitest run src/features/<feature>/views/<View>/<View>.test.ts src/features/<feature>/components/<Consumer>/<Consumer>.test.ts
pnpm --filter avenirs-cofolio-backoffice-client exec vitest run src/features/<feature>/views/<View>/<View>.test.ts
```

These are examples: include only packages that have impacted tests and replace placeholders with **all actual affected test paths**. Do not invoke `vitest run` without file paths or run full package suites. Verify both languages' locale JSON parses, no old component path/import/mock remains, and no stale `t()` keys remain. Report the test files run, failures, missing impacted tests or checks that could not run; do not claim passing tests without running them.
