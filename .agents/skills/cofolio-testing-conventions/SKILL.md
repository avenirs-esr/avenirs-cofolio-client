---
name: cofolio-testing-conventions
description: "Cofolio unit test conventions using BddTest and shared MSW handlers and fixtures. Use when adding or refactoring Vue component, composable, API-dependent or utility tests, including MSW handler placement, in Cofolio apps or packages/shared."
metadata:
  learned-at: "2026-11-27"
  source-commit: "cb943eaab"
---

# Cofolio testing conventions

## Structure scenarios with BddTest

For Cofolio unit tests, use `BddTest` from `@avenirs-esr/avenirs-dsav/test-utils` instead of bare `describe`/`it`. Organize scenarios as `given` → `when` → `then`, with `and` for additional conditions. Use Vitest hooks for setup and cleanup, and make each scenario title describe its actual assertions.

Use ordinary `forEach` around BDD scenarios for cases across context types. See `apps/avenirs-cofolio-client/src/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.test.ts` and `apps/avenirs-cofolio-client/src/features/student/associations/composables/use-association-limit/use-association-limit.test.ts`.

Source: user correction, 2026-11-17, “Recommence avec mon pattern BddTest”.

## Exercise API calls through MSW

Do not mock the API module or its hooks. Use the actual API client with MSW handlers and fixtures, overriding handlers with `server.use(...)` when a scenario needs a specific response. Await observable query results or requests before asserting. See `apps/avenirs-cofolio-client/src/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.test.ts` and `apps/avenirs-cofolio-client/src/__mocks__/msw/handlers/student/associations.handlers.ts`.

Source: user correction, 2026-11-17, “Il ne faut jamais mock l'api mais utiliser les handlers et fixtures MSW”.

## Keep MSW handlers out of test files

Never create `http.*` handlers inside test files. Add reusable and scenario-specific handlers to the matching `__mocks__/msw/handlers/*.handlers.ts` module and response data to `__mocks__/fixtures/*.fixtures.ts`, then import those handlers and use `server.use(...)` when a scenario needs to override defaults. To assert outgoing request details, observe the MSW server events rather than creating an ad hoc handler in the test.

Source: user correction, 2026-11-27, “La création de handlers est interdite dans les fichiers de tests.”
