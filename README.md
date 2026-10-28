# Avenirs ESR workspace

PNPM workspace containing the Cofolio and Backoffice applications.

## Layout

- `apps/avenirs-cofolio-client`: Cofolio application and application-specific tooling.
- `apps/avenirs-cofolio-client/a11y`: accessibility suite using the app dependencies.
- `apps/avenirs-cofolio-client/e2e`: existing E2E package, included in the workspace with its own dependency versions.
- `apps/avenirs-cofolio-backoffice-client`: Backoffice application, API contract and application-specific tooling.
- `apps/avenirs-cofolio-backoffice-client/a11y`: Backoffice accessibility suite.
- `packages/shared`: shared HTTP engine, exceptions, error codes, locale definitions, OpenAPI contracts and test support, exposed by `@avenirs-esr/shared`.
- `packages/shared/test-utils`: unit mounting/setup helpers and accessibility audit support, exposed through the shared package's test-utils subpaths.
- `.github`: repository workflows.

## Local setup

Use Node 26 from `.nvmrc` and PNPM 10.34.2 from `packageManager`.

```sh
pnpm install --frozen-lockfile
```

Place private application environment files at `apps/avenirs-cofolio-client/.env` and `apps/avenirs-cofolio-backoffice-client/.env`, using each application's `.env.example` as a template. Keep E2E-specific environment at `apps/avenirs-cofolio-client/e2e/.env`. Do not commit environment secrets.

Run from the repository root:

```sh
pnpm dev
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

Root `dev`, `build-only`, development-build, preview, `type-check` and accessibility commands target direct applications under `apps/*`. Root `build`, `clean:dist`, `lint`, `format` and unit-test/watch/coverage commands run matching scripts across workspace packages in parallel; packages without that script are skipped. The nested Cofolio E2E package has no matching unit-test or app-build scripts.

To target one application, use `pnpm --filter avenirs-cofolio-client run <script>` or `pnpm --filter avenirs-cofolio-backoffice-client run <script>`.

`pnpm test` runs unit tests, not E2E. App scripts run with the app as their working directory. Build artifacts live in each application's `dist` directory.

Application API-client and feature generators belong to their application, not the workspace root. E2E shortcuts belong to Cofolio:

```sh
pnpm --filter avenirs-cofolio-client run generate:api
pnpm --filter avenirs-cofolio-client run generate:feature
pnpm --filter avenirs-cofolio-backoffice-client run generate:api
pnpm --filter avenirs-cofolio-backoffice-client run generate:feature
pnpm --filter avenirs-cofolio-client run e2e
pnpm --filter avenirs-cofolio-client run e2e:chrome
pnpm --filter avenirs-cofolio-client run e2e:install
pnpm --filter avenirs-cofolio-client run e2e:report
```

## Dependency catalogues

External dependency versions are maintained in `pnpm-workspace.yaml`. Package manifests use `catalog:` for the default catalogue; internal packages keep `workspace:*` references.

The applications share the default Vue, Vue i18n, DSAV and TanStack Form entries. TanStack Form uses `~1.15.0`. Named `backoffice` and `e2e` catalogues preserve the remaining package-specific versions and resolutions through `catalog:backoffice` and `catalog:e2e` references.

Change dependency ranges in the owning catalogue rather than repeating versions in package manifests. Update the root lockfile after changing a catalogue and verify installation with `pnpm install --frozen-lockfile`.

## Shared runtime

The private `@avenirs-esr/shared` package exposes TypeScript sources through these entry points:

- `@avenirs-esr/shared`: transport factory, interceptor manager, transport types, HTTP status codes, exceptions, error codes, locale mappings, `hasStringField` and the shared `EmptyState`, `ErrorMessage` and `Loader` components. The transport factory requires an explicit `baseUrl`.
- `@avenirs-esr/shared/test-utils`: mounting helpers, explicit test setup, accessibility helpers and shared component stubs.

Shared UI components and API definitions are imported directly from `@avenirs-esr/shared`, and co-located component stubs are imported from `@avenirs-esr/shared/test-utils`. HTTP instances, authentication/session handling, application headers, routers, translations and i18n instances stay local. Both app solution tsconfigs reference the shared package solution, which includes its runtime, Node configuration and test projects; app-specific compiler configurations remain local.

Shared package checks run independently:

```sh
pnpm --filter @avenirs-esr/shared run type-check
pnpm --filter @avenirs-esr/shared run lint
pnpm --filter @avenirs-esr/shared run test:coverage
```

## Test utilities

The `@avenirs-esr/shared/test-utils` entry point exports `mountComponent`, `createMountComposable` and `mountWithRouter` as TypeScript sources. Test support belongs to the existing shared package rather than a separate workspace package.

The existing application test utilities re-export the component and router helpers. Each application configures its composable mounting facade with its own i18n instance; Cofolio additionally supplies its persisted Pinia factory, while Backoffice uses a plain Pinia. Optional plugins and their default settings are unchanged.

The same entry point exports the setup and accessibility helpers:

- `setupWarningHandler` installs the strict warning handler explicitly from each local setup.
- `setupMswLifecycle` registers the lifecycle using the calling application's Vitest hooks and deferred local server loader. MSW servers, handlers, i18n initialization and polyfills stay local.
- `waitMswToStart` and `createA11yAudit` provide the accessibility engine. Each application supplies its own Axe builder, HTML reporter and report writer; the common engine excludes user content, requests HTML only for violations and retains the failing assertion. Routes, render waits, report keys, absolute report destinations and Playwright configurations stay application-owned. The wait helper retains its networkidle-only behavior.

Vue, Vue Test Utils, Pinia, TanStack Query and Playwright are optional peers and explicit development dependencies of shared. Runtime consumers do not acquire mandatory test-tool dependencies. Vitest lifecycle hooks and Axe/reporting dependencies are supplied locally rather than importing a second runner or replacing an application's analysis engine. Shared component stubs are co-located under `src/ui` and exported from `@avenirs-esr/shared/test-utils`; application-specific stubs remain local.

Each utility's `.test.ts` file is co-located with its implementation under `src/` or `test-utils/`. The library TypeScript projects exclude tests; the dedicated test project includes them. The shared Vitest configuration defines a Node `runtime` project and a JSDOM `test-utils` project. No JavaScript library build is required.

```sh
pnpm --filter @avenirs-esr/shared exec vitest run --project runtime
pnpm --filter @avenirs-esr/shared exec vitest run --project test-utils
pnpm --filter @avenirs-esr/shared run test:coverage
```

## Shared API contracts

The Cofolio `avenir-esr.swagger.json` contract lives in `packages/shared/api/specs`. Cofolio resolves `@avenirs-esr/shared/api/specs/avenir-esr.swagger.json` through the shared package's exports in its local `orval.config.ts`. Backoffice uses its own contract at `apps/avenirs-cofolio-backoffice-client/api-specs/avenir-esr.swagger.json`.

Each application keeps its own client generation configuration, generated client and configured HTTP instance. Clients are generated into the owning application's `src/api/avenir-esr/generated` directory using its local `customFetch` and the shared transport engine. Shared TypeScript sources are compiled by the consuming application's tooling; there is no separate library bundling step.

`packages/shared/orval.config.ts` generates only the common `EErrorCode` enum from the shared Swagger, without generating a client or changing either application's Swagger. Workspace installation generates this enum before dependent application lifecycles. Generated shared files are ignored and must not be edited manually. To regenerate explicitly:

```sh
pnpm --filter @avenirs-esr/shared run generate:api
```

## Browser suites

The accessibility and E2E packages can use different Playwright versions. Install Chromium through each package's executable:

```sh
pnpm --dir apps/avenirs-cofolio-client exec playwright install chromium
pnpm --dir apps/avenirs-cofolio-backoffice-client exec playwright install chromium
pnpm --dir apps/avenirs-cofolio-client/e2e exec playwright install chromium
```

For the existing local MSW setup:

```sh
VITE_ENABLE_MSW=true pnpm build:development
CI=true pnpm test:a11y
```

The accessibility suites start their own previews: Cofolio uses port 4173, and Backoffice uses port 4174. To run only Backoffice accessibility, use `CI=true pnpm --filter avenirs-cofolio-backoffice-client run test:a11y` after building the development bundle with MSW enabled.

For Cofolio E2E, start only its local preview in one terminal:

```sh
pnpm --filter avenirs-cofolio-client run preview:development --host 127.0.0.1 --port 4173 --strictPort
```

Run desktop Chromium E2E in another terminal:

```sh
VITE_API_URL=http://localhost:4173/cofolio/ MSW_MODE_ON=true pnpm --filter avenirs-cofolio-client run e2e --project=chromium
```

The explicit E2E URL avoids private environment overrides targeting a real service. E2E scenarios and accessibility rules are unchanged; existing baseline failures are not disabled by this migration.

Application READMEs document their architecture. Both applications declare the published DSAV package through the same default catalogue entry.

## Git tooling

Husky, Commitlint and lint-staged are configured at the repository root. Staged application files are linted with their owning application's ESLint configuration.
