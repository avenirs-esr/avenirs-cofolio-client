# Avenirs Cofolio Back-office Client

The Avenirs Cofolio Back-office Client is an administration interface for managing platform content and configuration. It initially focuses on two main features:

- **Terms of Service Management**: Create and manage the platform's Terms of Service (CGU).
- **Skills Reference Management**: Manage skills references used within the Avenirs Cofolio ecosystem.

## Project Structure

- `src/`: Source code
  - `assets/`: Static assets
  - `common/`: Shared utilities and cross-cutting concerns
    - `api/`: API services and HTTP client configuration
      - `http.client.ts`: Axios-based HTTP client setup
    - `composables/`: Reusable Vue composition functions
    - `exceptions/`: Error handling infrastructure
    - `types/`: Shared TypeScript types
    - `utils/`: Generic utility functions
  - `components/`: Reusable application components
  - `features/`: Feature modules
    - `skills-references/`: Skills reference management
    - `terms-of-service/`: Terms of Service management
  - `layouts/`: Application layouts
  - `plugins/`: Vue plugins
  - `router/`: Routing configuration
  - `store/`: State management
  - `ui/`: Core UI components
  - `views/`: Main application views

## Project Architecture

The project follows a feature-based architecture with a clear separation of concerns.

### Feature-Based Organization

Each feature module groups the components and logic related to a specific business domain.

```text
features/
├── skills-references/
│   ├── components/       # Feature-specific UI components
│   ├── composables/      # Feature-specific Vue composables
│   ├── layouts/          # Feature-specific layouts, when needed
│   ├── queries/          # Data fetching logic using TanStack Vue Query
│   ├── views/            # Feature page components
│   ├── index.ts          # Module entry point and exports
│   └── routes.ts         # Feature route definitions
└── terms-of-service/
    ├── components/
    ├── composables/
    ├── layouts/
    ├── queries/
    ├── views/
    ├── index.ts
    └── routes.ts
```

This modular approach ensures that:

- Each feature has a clearly defined responsibility.
- Code is organized by business domain rather than technical function alone.
- Features can be developed, tested, and maintained independently.
- Shared code remains separate from feature-specific implementations.

## Setup & Development

Use Node 26 and PNPM 10.34.2. Install dependencies from the workspace root:

```sh
pnpm install --frozen-lockfile
```

Run application commands from the workspace root:

```sh
pnpm --filter avenirs-cofolio-backoffice-client run dev
pnpm --filter avenirs-cofolio-backoffice-client run type-check
pnpm --filter avenirs-cofolio-backoffice-client run lint
pnpm --filter avenirs-cofolio-backoffice-client run format
pnpm --filter avenirs-cofolio-backoffice-client run preview
pnpm --filter avenirs-cofolio-backoffice-client run build
pnpm --filter avenirs-cofolio-backoffice-client run test
pnpm --filter avenirs-cofolio-backoffice-client run test:watch
pnpm --filter avenirs-cofolio-backoffice-client run generate:api
```

The development server uses `http://localhost:5174/cofolio-back-office/`, separate from Cofolio's default port 5173. It fails if port 5174 is already in use instead of silently selecting another port.

The application uses `/cofolio-back-office/` as its default base path. Place its private environment file next to this README, using `.env.example` as a template. The API contract remains in `api-specs/avenir-esr.swagger.json` and generated clients are written to `src/api/avenir-esr/generated/`.

Accessibility uses a dedicated preview on port 4174:

```sh
VITE_ENABLE_MSW=true pnpm --filter avenirs-cofolio-backoffice-client run build:development
CI=true pnpm --filter avenirs-cofolio-backoffice-client run test:a11y
```

Git hooks and editor configuration are owned by the workspace root. The DSAV dependency is declared in this application's `package.json` and resolved by the workspace lockfile.

## Features

- Terms of Service management
- Skills reference management

## Tech Stack

- **Frontend Framework**: Vue.js 3
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **API Client**: Axios
- **Data Fetching**: TanStack Vue Query
- **UI Framework**: DSAV (Design System AVENIR(s)) via `@avenirs-esr/avenirs-dsav`
- **Build Tool**: Vite
- **Testing**:
  - Unit Testing: Vitest

## Contributing

### Business Rules

**IMPORTANT**: When a component relies on an important business rule (a non-trivial condition that determines whether an action is allowed or a value must be derived from domain data), that rule **MUST** be extracted into a dedicated `rules` file rather than being inlined in the component.

#### Why?

- Business rules are likely to change and may be reused across components.
- Keeping business logic in components mixes domain logic with presentation concerns.
- Extracted rules are pure functions that are straightforward to unit test in isolation.
- A single source of truth prevents rules from being reimplemented inconsistently.

#### Where Do They Live?

Place rules in a `rules/` folder scoped to the domain they belong to.

For example:

- Shared rules: `src/common/{domain}/rules/{domain}.rules.ts`
- Feature-specific rules: `src/features/{feature}/rules/{feature}.rules.ts`

#### Pattern

Each rule should be an exported, documented pure function that accepts domain data and returns a primitive or derived value.

```typescript
// Example: src/features/terms-of-service/rules/terms-of-service.rules.ts

export function canPublishTermsOfService(
  hasContent: boolean,
  hasRequiredApproval: boolean,
): boolean {
  return hasContent && hasRequiredApproval;
}
```

The example above is illustrative. Adapt the rule and its inputs to the actual business requirements.

Rules must be:

- **Pure**: No side effects, API calls, or store access.
- **Unit tested**: Co-located `*.rules.test.ts` files following the project's BDD testing conventions.

### Stub Files and Barrel Exports

**IMPORTANT**: Stub files (`*.stub.ts`) must **NEVER** be exported from feature barrel files (`index.ts`).

#### Why?

- Stub files are development and testing artifacts.
- Exporting them from barrel files can cause test-only code to be included in production bundles.
- Keeping them separate avoids unnecessary bundle size and dependencies.

#### Correct Pattern

**Do not** export stubs from barrel files:

```typescript
// Avoid
export { ComponentStub } from "./components/Component/Component.stub";
```

**Instead**, import stubs directly in test files:

```typescript
import { ComponentStub } from "./Component.stub";
```

### Commit Conventions

This repository uses [Commitlint](https://commitlint.js.org/) to enforce consistent and conventional commit messages.

The configuration extends `@commitlint/config-conventional` with custom rules.

#### Allowed Commit Types

- `feat` – A new feature
- `fix` – A bug fix
- `docs` – Documentation changes
- `refactor` – Code refactoring
- `test` – Adding or modifying tests
- `build` – Changes to build tools or dependencies
- `revert` – Reverting a previous commit

#### Commit Message Rules

| Rule | Description |
| --- | --- |
| `type-enum` | Only allows the types listed above |
| `type-case` | Commit type must be lowercase |
| `type-empty` | Commit type must not be empty |
| `subject-case` | No restriction on subject casing |

#### Example Commit Messages

```text
feat: add terms of service management
fix: handle invalid skills reference data
docs: update project documentation
```

### ARIA Authoring Practices Guide

When developing components, refer to the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) to support accessible and consistent interactions.

Useful references include:

- [Design Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Practices](https://www.w3.org/WAI/ARIA/apg/practices/)
