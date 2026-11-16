---
name: shared-component-extraction
description: "Move or extract a Vue component from Cofolio or Backoffice into packages/shared for use by both apps. Invoke with the source component name or path; inspect it, propose the precise shared destination and get user confirmation BEFORE moving files. Then migrate tests, stubs, i18n translations, exports, imports and vi.mock paths in both apps and run targeted checks."
metadata:
  learned-at: "2026-11-14"
  source-commit: "bce01b2f8"
---

# Extract an app component into `@avenirs-esr/shared`

Invoke this workflow with the name or source path of the component to move (for example, `/shared-component-extraction apps/avenirs-cofolio-client/src/common/components/cards/MyCard/MyCard.vue`). Do not ask the user to supply it again. This workflow applies to `apps/avenirs-cofolio-client` (Cofolio) and `apps/avenirs-cofolio-backoffice-client` (Backoffice). Use the existing [shared package reference](../avenirs-cofolio-client-shared-package-module/SKILL.md) for package-wide conventions.

## Mandatory checkpoint: confirm the destination

1. Resolve the source component from the name or path supplied with the invocation. If a name matches several components, ask which one; otherwise proceed without a source-path question. Inspect its `.vue`, siblings (`*.test.ts`, `*.stub.ts`, types, styles, child components), imports, consumers, and keys in **both** applications. Check whether its dependencies can run in `packages/shared` without importing an app-only router, store, plugin, alias, or feature.
2. Suggest an **exact path** such as `packages/shared/src/ui/components/navigation/ComponentName/ComponentName.vue`, following nearby `src/ui/components/{category}/...` naming. Show what files will move, dependencies requiring adaptation, proposed public exports and the proposed new translation key prefix derived from the **actual** shared directory. If the component is inherently app-specific, explain why and suggest extracting only its reusable portion.
3. **Stop and obtain explicit user confirmation of the suggested path before moving or editing the component, translations, or consumer code.** A user request to “move X to shared” alone is not approval of a destination. If the proposed path changes later, reconfirm it.

## After approval

1. Move the component and its associated test, stub, type and private child files to the confirmed directory. Preserve existing behavior; adjust internal imports so shared files use `#shared/*` for shared internals and package imports for external dependencies. Shared must not depend on either app's `@/` aliases or app-local state. Keep DSAV components in `@avenirs-esr/avenirs-dsav`, not this package.
2. Export the component (and types/stub **if needed by consumers**) in `packages/shared/src/ui/index.ts`, which feeds `packages/shared/src/index.ts`. Consumers in both apps import from `@avenirs-esr/shared`, not from `#shared/*` or a deep internal path. Do not add new package exports unless the barrel cannot serve the use case.
3. For `en` and `fr`, move **component-owned** keys into `packages/shared/src/i18n/locales/{en,fr}.json` under the namespace matching the confirmed new shared path, e.g. `global.components.navigation.ComponentName.*` for `src/ui/components/navigation/ComponentName/`. Update every `t(...)` and test assertion to the new key. Remove only the migrated keys from Cofolio and Backoffice locale files, preserving adjacent keys and any keys still used by other components. Check locale conflicts and differences between apps before choosing text. See [localization.md](references/localization.md).
4. Replace imports in all consumers (views, other components, composables, barrels, tests and stubs) across **both** apps. Search by component name, original path, exported type/stub names, and old translation key; fix dynamic imports and `vi.mock('...')` paths too. Preserve or fix the tests the user already modified instead of replacing them wholesale. For shared tests, resolve mocks and fixtures using `#shared/*` and shared test utilities; app tests import runtime/stubs from `@avenirs-esr/shared` as exported.
5. After moving the component and fixing its tests, **run the unit-test files for every impacted component/view in shared, Cofolio and Backoffice**: the moved component's tests and each changed consumer's colocated tests. Pass explicit test-file paths to Vitest in each relevant workspace; do not run full package or workspace suites. Search again for old path/key and stale mocks, review the diff for unrelated locale deletion, and report which tests ran, any failures and any impacted component without a test. See [verification.md](references/verification.md).

Do **not** remove a translation merely because its original component moved: if another consumer still uses it, migrate that use or keep the key as appropriate. Do not move app-specific business translations unless the shared component itself owns them. Never edit generated API files; do not use `any` or add code comments in new code.

## Relevant locations

| Concern | Path |
|---|---|
| Shared UI / public barrel | `packages/shared/src/ui/components/`, `packages/shared/src/ui/index.ts` |
| Shared locales / loaded messages | `packages/shared/src/i18n/locales/{en,fr}.json`, `packages/shared/src/i18n/index.ts` |
| Cofolio locales | `apps/avenirs-cofolio-client/src/locales/{en,fr}.json`, `src/features/**/locales/{en,fr}.json` |
| Backoffice locales | `apps/avenirs-cofolio-backoffice-client/src/locales/{en,fr}.json`, `src/features/**/locales/{en,fr}.json` |
| App i18n merge order | Each app's `src/plugins/vue-i18n/vue-i18n.ts` |
| Shared UI tests | `packages/shared/src/ui/**/*.test.ts`, `packages/shared/vitest.config.ts` |
