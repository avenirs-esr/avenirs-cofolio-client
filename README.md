# Avenirs ESR workspace

This first workspace increment contains Cofolio only. Backoffice integration and CI/deployment migration are separate follow-ups.

## Layout

- `apps/avenirs-cofolio-client`: Cofolio application and application-specific tooling.
- `apps/avenirs-cofolio-client/a11y`: accessibility suite using the app dependencies.
- `apps/avenirs-cofolio-client/e2e`: existing E2E package, included in the workspace with its own dependency versions.
- `packages/config`: private placeholder; no shared configuration is exported yet.
- `packages/shared/api/specs`: shared OpenAPI contracts, exposed by `@avenirs-esr/shared`.
- `.github`: repository workflows, kept at root and unchanged in this increment.

## Local setup

Use Node 26 from `.nvmrc` and PNPM 10.34.2 from `packageManager`.

```sh
pnpm install --frozen-lockfile
```

Place your private Cofolio environment file at `apps/avenirs-cofolio-client/.env`; use its `.env.example` as the template. When migrating an existing checkout, move the old root app `.env` privately to that location. Keep E2E-specific environment at `apps/avenirs-cofolio-client/e2e/.env`. Do not commit environment secrets.

Run from the repository root:

```sh
pnpm dev
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

Root development, build, preview, type-check, lint, format, and test commands run the corresponding scripts of direct applications under `apps/*` in parallel. They exclude `packages/*` and nested test packages. To target only Cofolio, use `pnpm --filter avenirs-cofolio-client run <script>`, for example `pnpm --filter avenirs-cofolio-client dev`.

`pnpm test` runs unit tests, not E2E. App scripts run with the app as their working directory. Build artifacts live in `apps/avenirs-cofolio-client/dist`.

API/feature generators and E2E shortcuts belong only to the Cofolio app, not the workspace root:

```sh
pnpm --filter avenirs-cofolio-client run generate:api
pnpm --filter avenirs-cofolio-client run generate:feature
pnpm --filter avenirs-cofolio-client run e2e
pnpm --filter avenirs-cofolio-client run e2e:chrome
pnpm --filter avenirs-cofolio-client run e2e:install
pnpm --filter avenirs-cofolio-client run e2e:report
```

## Shared API contracts

The single `avenir-esr.swagger.json` contract lives in `packages/shared/api/specs`. Cofolio resolves `@avenirs-esr/shared/api/specs/avenir-esr.swagger.json` through the shared package's exports in its local `orval.config.ts`.

Each application keeps its own generation configuration, generated client, and HTTP transport. Cofolio still generates into `apps/avenirs-cofolio-client/src/api/avenir-esr/generated` using its existing `customFetch`. A future Backoffice app can declare the same workspace dependency and consume the same contract without inheriting Cofolio's authentication or request context. The shared package contains static JSON and requires no build step.

## Browser suites

The accessibility and E2E packages use different Playwright versions. Install Chromium through each package's executable:

```sh
pnpm --dir apps/avenirs-cofolio-client exec playwright install chromium
pnpm --dir apps/avenirs-cofolio-client/e2e exec playwright install chromium
```

For the existing local MSW setup:

```sh
VITE_ENABLE_MSW=true pnpm build:development
CI=true pnpm test:a11y
```

Then start the local preview in one terminal:

```sh
pnpm preview:development --host 127.0.0.1 --port 4173 --strictPort
```

Run desktop Chromium E2E in another terminal:

```sh
VITE_API_URL=http://localhost:4173/cofolio/ MSW_MODE_ON=true pnpm --filter avenirs-cofolio-client run e2e --project=chromium
```

The explicit E2E URL avoids private environment overrides targeting a real service. E2E scenarios and accessibility rules are unchanged; existing baseline failures are not disabled by this migration.

The retained app README documents the application architecture. Its old npm installation/linking examples are historical; use the workspace PNPM commands above. Local DSAV linking is not part of this increment; the declared published DSAV dependency is retained.

## Scope limitation

Existing `.github` reusable workflows and deployment infrastructure still assume the old npm/root-app layout. Local success does not imply CI or deployment compatibility. Do not merge into deployment branches until the coordinated follow-up is complete.
