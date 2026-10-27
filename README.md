# Avenirs ESR workspace

PNPM workspace containing the Cofolio and Backoffice applications.

## Layout

- `apps/avenirs-cofolio-client`: Cofolio application and application-specific tooling.
- `apps/avenirs-cofolio-client/a11y`: accessibility suite using the app dependencies.
- `apps/avenirs-cofolio-client/e2e`: existing E2E package, included in the workspace with its own dependency versions.
- `apps/avenirs-cofolio-backoffice-client`: Backoffice application, API contract and application-specific tooling.
- `apps/avenirs-cofolio-backoffice-client/a11y`: Backoffice accessibility suite.
- `packages/config`: private placeholder; no shared configuration is exported yet.
- `packages/shared/api/specs`: shared OpenAPI contracts, exposed by `@avenirs-esr/shared`.
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

API and feature generators belong to their application, not the workspace root. E2E shortcuts belong to Cofolio:

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

## Shared API contracts

The Cofolio `avenir-esr.swagger.json` contract lives in `packages/shared/api/specs`. Cofolio resolves `@avenirs-esr/shared/api/specs/avenir-esr.swagger.json` through the shared package's exports in its local `orval.config.ts`. Backoffice uses its own contract at `apps/avenirs-cofolio-backoffice-client/api-specs/avenir-esr.swagger.json`.

Each application keeps its own generation configuration, generated client and HTTP transport. Clients are generated into the owning application's `src/api/avenir-esr/generated` directory using its local `customFetch`. The shared package contains static JSON and requires no build step.

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

Application READMEs document their architecture. Application dependencies on the published DSAV package are declared separately in their manifests.

## Git tooling

Husky, Commitlint and lint-staged are configured at the repository root. Staged application files are linted with their owning application's ESLint configuration.
