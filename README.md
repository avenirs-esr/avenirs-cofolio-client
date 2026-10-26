# Avenirs ESR workspace

This PNPM workspace contains the Cofolio application under `apps/avenirs-cofolio-client` and shared packages under `packages`.

## Layout

- `apps/avenirs-cofolio-client`: Cofolio application and application-specific tooling.
- `apps/avenirs-cofolio-client/a11y`: accessibility suite using the app dependencies.
- `apps/avenirs-cofolio-client/e2e`: E2E package with its own dependency versions.
- `packages/config`: private placeholder; no shared configuration is exported yet.
- `packages/shared/api/specs`: shared OpenAPI contracts, exposed by `@avenirs-esr/shared`.
- `.github`: repository workflows, kept at root and calling reusable workflows from `avenirs-esr/avenirs-workflows@main`.
- `pnpm-workspace.yaml`: workspace members and dependency build-script permissions.
- `pnpm-lock.yaml`: the single lockfile for the root, applications, shared packages, and nested E2E package.

Git hooks, commitlint configuration, editor configuration, and `.github` are at the root. Vite, Vitest, TypeScript, ESLint, and Orval configuration are owned by the Cofolio app in `apps/avenirs-cofolio-client`.

## Local setup

Use Node 26 from `.nvmrc` and PNPM 10.34.2 from the root `packageManager` field. With nvm installed, select the runtime and check the package manager before installing from the repository root:

```sh
nvm use
pnpm --version
pnpm install --frozen-lockfile
```

Install dependencies once at the workspace root, including those of the nested E2E package. All workspace members use PNPM and share the root lockfile. A frozen installation checks that the manifests match the lockfile. When changing a dependency, update the owning manifest and root lockfile together using PNPM.

The root `prepare` lifecycle installs Husky hooks. Cofolio's `prepare` generates its API client, and its `postgenerate:api` formats the generated API code.

Place your private Cofolio environment file at `apps/avenirs-cofolio-client/.env`; use its `.env.example` as the template. Keep E2E-specific environment at `apps/avenirs-cofolio-client/e2e/.env`. Do not commit environment secrets.

## Run commands across the workspace

Run these commands from the repository root:

```sh
pnpm lint
pnpm build
pnpm test
```

### All workspace packages with a matching script

These root scripts use `pnpm --parallel run <script>`. They run the matching script in workspace packages, excluding the root package itself. Packages that do not define that script are skipped.

| Root command | Purpose |
| --- | --- |
| `pnpm lint` | Lint all workspace packages that define `lint`. |
| `pnpm format` | Run each matching `format` script; Cofolio uses ESLint with `--fix`. This modifies files. |
| `pnpm build` | Build all workspace packages that define `build`. Cofolio runs a full type-check and a production Vite build. |
| `pnpm clean:dist` | Remove build output in packages that define `clean:dist`. |
| `pnpm test` or `pnpm test:unit` | Run matching unit-test scripts, not E2E scenarios. |
| `pnpm test:watch` | Start matching unit-test watchers. |
| `pnpm test:coverage` | Run matching unit tests with coverage. |

The root `test:coverage:shard` script follows the same workspace-wide routing for CI shards.

Only Cofolio defines `lint` and `build`. `@avenirs-esr/shared` contains static API contracts, `@avenirs-esr/config` is a placeholder, and the nested `e2e` package has its own named scripts. A package participates in a workspace command when it defines the corresponding script.

### Direct applications only

Other root scripts use `pnpm --parallel --filter './apps/*' run <script>`. They target direct applications under `apps/*`, excluding `packages/*` and nested test packages:

| Root command | Purpose |
| --- | --- |
| `pnpm dev` | Start application development servers. |
| `pnpm type-check` | Type-check applications. |
| `pnpm build-only` | Produce production bundles without the separate full type-check. |
| `pnpm build:development` | Type-check and build applications in development mode. |
| `pnpm build-only:development` | Build development-mode bundles without the separate full type-check. |
| `pnpm preview` or `pnpm preview:development` | Serve existing application build output; these commands do not build it. |
| `pnpm test:a11y` | Run application accessibility suites and their cleanup. |

The root `test:a11y:run` and `test:a11y:cleanup` scripts use the same direct-application filter. Accessibility tests are separate from the nested E2E suite.

Each package script runs with that package as its working directory. Cofolio build output is written to `apps/avenirs-cofolio-client/dist`.

## Target a single application or package

Use the package's `name` from its `package.json`, not its directory name, with `--filter`. For example, from the repository root:

```sh
pnpm --filter avenirs-cofolio-client run dev
pnpm --filter avenirs-cofolio-client run lint
pnpm --filter avenirs-cofolio-client run build
pnpm --filter avenirs-cofolio-client run test:unit
```

You can also run `pnpm run <script>` from inside `apps/avenirs-cofolio-client` to run that app's script directly. Keep dependency installation at the workspace root.

API/feature generators and E2E shortcuts belong only to the Cofolio app, not the workspace root:

```sh
pnpm --filter avenirs-cofolio-client run generate:api
pnpm --filter avenirs-cofolio-client run generate:feature
pnpm --filter avenirs-cofolio-client run e2e
pnpm --filter avenirs-cofolio-client run e2e:chrome
pnpm --filter avenirs-cofolio-client run e2e:install
pnpm --filter avenirs-cofolio-client run e2e:report
```

The app's E2E shortcuts delegate to its nested `e2e` package. For a script exposed only by that package, target it by name:

```sh
pnpm --filter e2e run lint:tsc
```

Forward PNPM script arguments directly, for example `pnpm --filter avenirs-cofolio-client run e2e --project=chromium`; do not add npm's extra `--` separator.

## Shared API contracts

The Swagger/OpenAPI source is `packages/shared/api/specs/avenir-esr.swagger.json`. Applications consume this shared contract without keeping their own copies.

| Responsibility | Location |
| --- | --- |
| Shared Swagger/OpenAPI document | `packages/shared/api/specs/avenir-esr.swagger.json` |
| Shared package and asset exports | `packages/shared/package.json` (`@avenirs-esr/shared`) |
| Cofolio generation configuration | `apps/avenirs-cofolio-client/orval.config.ts` |
| Generated API client and types | `apps/avenirs-cofolio-client/src/api/avenir-esr/generated/` |
| Cofolio HTTP mutator | `apps/avenirs-cofolio-client/src/api/avenir-esr/fetch-instance/fetch-instance.ts` |

Cofolio declares `@avenirs-esr/shared` with `workspace:*`. Its Orval configuration resolves `@avenirs-esr/shared/api/specs/avenir-esr.swagger.json` through the shared package's exports, so generation does not depend on a hard-coded relative path to the contract.

After updating the shared contract, regenerate and check Cofolio from the repository root:

```sh
pnpm --filter avenirs-cofolio-client run generate:api
pnpm --filter avenirs-cofolio-client run type-check
```

The generation command also runs `postgenerate:api`. Generated files are ignored by Git and must not be hand-edited; change the source contract or app-owned generation configuration instead.

API generation configuration, generated clients, and HTTP transport are app-owned. Cofolio uses its `customFetch` mutator; the shared package contains only the static contract and requires no build step.

## Browser suites

The accessibility and E2E packages use different Playwright versions. Install Chromium through each package's executable:

```sh
pnpm --dir apps/avenirs-cofolio-client exec playwright install chromium
pnpm --dir apps/avenirs-cofolio-client/e2e exec playwright install chromium
```

For local browser tests with MSW:

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

The explicit E2E URL ensures the tests target the local preview rather than a real service configured in the environment.

The [app README](apps/avenirs-cofolio-client/README.md) describes the application architecture. Use this workspace README for setup and commands. The app uses its declared published DSAV dependency.

## CI and deployment paths

Repository workflows are under `.github/workflows` and call the shared workflows on `@main`. Quality, accessibility, and E2E callers set `working-directory: apps/avenirs-cofolio-client`; accessibility explicitly builds with `pnpm run build-only:development`.

The deploy-on-develop workflow delegates deployment to the shared `deploy-workflow.yaml@main`. The application build output is `apps/avenirs-cofolio-client/dist`, and the environment file is `apps/avenirs-cofolio-client/.env`. Deployment infrastructure is managed in `srv-dev`.
