# Avenirs Cofolio Client

The Avenirs Cofolio project is a comprehensive portfolio management system designed to support lifelong portfolio development for citizens. It aims to:

- Enable continuity in portfolio approaches throughout a citizen's life
- Facilitate awareness, recognition, and promotion of skills and competencies
- Support the development of life projects (personal, educational, career orientation, professional development, and civic engagement)
## Project Structure

- `src/`: Source code
  - `assets/`: Static assets
  - `common/`: Shared utilities and cross-cutting concerns
    - `api/`: API services and HTTP client configuration
      - `http.client.ts`: Axios-based HTTP client setup
    - `composables/`: Reusable Vue composition functions
    - `exceptions/`: Error handling infrastructure
  - `components/`: Reusable UI components
  - `features/`: Feature modules
    - `student/`: Student module with complete folder structure
    - `staff/`: Staff module with complete folder structure
  - `layouts/`: Application layouts
  - `plugins/`: Vue plugins
  - `router/`: Routing configuration
  - `store/`: State management
  - `ui/`: Core UI components
  - `views/`: Main application views

## Project Architecture

The project follows a feature-based architecture with a clear separation of concerns:

### Feature-Based Organization

Each feature module (`student`, `staff`) follows a consistent internal structure:

```
features/
├── student/                 # Student module
│   ├── components/          # Student-specific UI components
│   ├── composables/         # Student-specific Vue composition functions
│   ├── layouts/             # Layout structures for student views
│   ├── queries/             # Data fetching logic using TanStack Query
│   ├── views/               # Student page components
│   ├── index.ts             # Module entry point and exports
│   └── routes.ts            # Student route definitions
├── staff/                 # Staff module
│   ├── components/          # Staff-specific UI components
│   ├── composables/         # Staff-specific Vue composition functions
│   ├── layouts/             # Layout structures for staff views
│   ├── queries/             # Staff-specific data fetching
│   ├── views/               # Staff page components
│   └── ...                  # Similar structure as student module
```

This modular approach ensures that:
- Each user role has dedicated, purpose-built interfaces
- Code is organized by domain rather than technical function
- Features can be developed, tested, and maintained independently
- Clear boundaries exist between different parts of the application

## Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Preview production build
npm run preview

# Build for production
npm run build

# Run all tests (unit + e2e)
npm run test

# Run only unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:watch
```

### Local Development with Design System (npm link)

When developing the design system (`@avenirs-esr/avenirs-dsav`) locally alongside this project, use npm link for live updates:

**Initial Setup:**

1. In the design system repository (`avenirs-dsav`):
```bash
cd /path/to/avenirs-dsav
npm install
npm link
```

2. In this project (`avenirs-cofolio-client`):
```bash
npm link @avenirs-esr/avenirs-dsav
```

**Development Workflow:**

In the design system repository, use watch mode to automatically rebuild on changes:
```bash
cd /path/to/avenirs-dsav
npm run build:watch
```

This command runs in parallel:
- `vite build --watch` - Rebuilds the library on file changes
- `vue-tsc --watch` - Regenerates TypeScript declarations

Then start the dev server in this project:
```bash
npm run dev
```

**Important Notes:**
- TypeScript configuration automatically excludes the symlinked library's `node_modules` to prevent type conflicts
- Changes in the design system are reflected immediately in this project
- No need to manually rebuild or reinstall after each change

**To Unlink:**
```bash
npm unlink @avenirs-esr/avenirs-dsav
npm install @avenirs-esr/avenirs-dsav
```

## Features

- Student portfolio management
- Staff assessment tools
- Asset organization
- Progress tracking

## Tech Stack

- **Frontend Framework**: Vue.js
- **State Management**: Pinia
- **Routing**: Vue Router
- **API Client**: Axios
- **Data Fetching**: TanStack Vue Query
- **UI Framework**: DSAV (Design System AVENIR(s)) via @avenirs-esr/avenirs-dsav
- **Build Tool**: Vite
- **Language**: TypeScript
- **Testing**:
  - Unit Testing: Vitest 3.1

## Contributing

### Business Rules

**IMPORTANT**: When a component relies on an important business rule (a non-trivial condition that decides whether an action is allowed, a value that must be derived from domain data, etc.), that rule **MUST** be extracted into a dedicated `rules` file rather than being inlined in the component.

#### Why?

- Business rules are the part of the code most likely to change and to be reused across components
- Keeping them in the component buries domain logic inside presentation concerns
- Extracted rules are pure functions that are trivial to unit test in isolation
- A single source of truth prevents the same rule from being re-implemented (and drifting) in several places

#### Where do they live?

Activity-related rules live in `src/common/activities/rules/activities.rules.ts`. More generally, put rules in a `rules/` folder scoped to the domain they belong to (`src/common/{domain}/rules/{domain}.rules.ts`, or inside the relevant feature when the rule is feature-specific).

#### Pattern

Each rule is an exported, documented pure function that takes the domain DTO(s) and returns a primitive/derived value:

```typescript
// src/common/activities/rules/activities.rules.ts
import { type DeclaredActivityDetailsDTO, EFeedbackStatus } from '@/api/avenir-esr'

export function computeRemainingFeedbacks (declaredActivityDetails: DeclaredActivityDetailsDTO) {
  return declaredActivityDetails.activity.feedbackAllowedIterations - (declaredActivityDetails.feedbacks?.length ?? 0)
}

export function canCreateFeedbackRequest (declaredActivityDetails: DeclaredActivityDetailsDTO, remainingFeedbacks: number) {
  const lastFeedback = declaredActivityDetails.feedbacks?.at(0)
  return remainingFeedbacks !== 0 && lastFeedback?.status !== EFeedbackStatus.IN_PROCESS
}
```

The component just consumes the rule (typically wrapped in a `computed`):

```typescript
import { canCreateFeedbackRequest, computeRemainingFeedbacks } from '@/common/activities/rules/activities.rules'

const remainingFeedbacks = computed(() => computeRemainingFeedbacks(declaredActivityDetails))
const isRequestFeedbackDisabled = computed(() => !canCreateFeedbackRequest(declaredActivityDetails, remainingFeedbacks.value))
```

Rules must be:
- **Pure** — no side effects, no API calls, no store access
- **Unit tested** — co-located `*.rules.test.ts` following the project's BDD testing conventions

Reference implementation: `src/common/activities/rules/activities.rules.ts` used by `PerspectiveTabActions.vue`.

### Stub Files and Barrel Exports

**IMPORTANT**: Stub files (`.stub.ts`) should **NEVER** be exported from feature barrel files (`index.ts`).

#### Why?

- Stub files are development/testing artifacts only
- Including them in barrel exports causes Vite to bundle them in production builds
- This increases bundle size unnecessarily with test-only code
- Stubs should only be imported directly in test files

#### Correct Pattern

**❌ DON'T** export stubs from barrel files:
```typescript
// ❌ src/features/student/featureName/index.ts
export { ComponentStub } from './components/Component/Component.stub'
```

**✅ DO** import stubs directly in test files:
```typescript
// ✅ src/features/student/featureName/components/Component/Component.test.ts
import { ComponentStub } from './Component.stub'

// OR from relative path
import { ComponentStub } from '../Component/Component.stub'
```

### Commit conventions

This repository uses [Commitlint](https://commitlint.js.org/) to enforce consistent and conventional commit messages.

This setup extends the conventional commit configuration (`@commitlint/config-conventional`) and adds custom rules:

✅ Allowed Commit Types

The following commit types are allowed:

- `feat` – A new feature
- `fix` – A bug fix
- `docs` – Documentation changes
- `refactor` – Code refactoring (no feature or bug fix)
- `test` – Adding or modifying tests
- `build` – Changes to build tools or dependencies
- `revert` – Revert a previous commit

🔠 Commit Message Rules

| Rule           | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `type-enum`    | Only allows the types listed above                                          |
| `type-case`    | Commit type must be **lowercase**                                           |
| `type-empty`   | Commit type **must not** be empty                                           |
| `subject-case` | No restriction on subject casing (rule is disabled for flexibility)         |

 ✅ Example Commit Messages

```
feat: add user login functionality
fix: handle null pointer in dashboard
docs: update installation guide
```

### ARIA Authoring Practices Guide

When developing components, please refer to the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) to ensure accessibility compliance.
You can find [design patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) and [best practices](https://www.w3.org/WAI/ARIA/apg/practices/) for implementing accessible web components.