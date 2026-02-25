# E2E Testing Guide - Playwright-BDD

This document describes the patterns and conventions used for End-to-End testing in Avenirs Cofolio using **Playwright-BDD** with the **decorator pattern**.

## Directory Structure

```
e2e/
├── tests/                                    # Gherkin feature files
│   └── {role}/                               # e.g. student/
│       └── {featureName}/                    # e.g. home/, lifeProject/
│           ├── {featureName}.feature         # Desktop scenarios
│           ├── {featureName}.deferred.feature # Deferred scenarios (excluded in REVIEW_MODE)
│           └── {featureName}.mobile.feature  # Mobile-specific scenarios
├── framework/                                # Framework layer
│   ├── shared/                               # Role-agnostic shared layer
│   │   ├── base/
│   │   │   ├── BaseObject.ts                 # Base class for all ComponentObjects
│   │   │   └── BasePage.ts                   # Base class for PageObjects (with shared steps)
│   │   ├── componentObjects/                 # Shared UI component objects
│   │   ├── constants/
│   │   │   └── routes.ts                     # Route path constants
│   │   ├── fixtures/
│   │   │   └── fixtures.ts                   # Playwright fixture registry (only)
│   │   ├── hooks/
│   │   │   └── dataset.hook.ts               # Dataset tag hooks
│   │   ├── steps/                            # Shared BDD step fixtures
│   │   ├── test-data/
│   │   │   └── users.ts                      # User dataset definitions
│   │   └── utils/                            # Shared utilities (i18n, waits, dimensions)
│   └── {role}/                               # e.g. student/
│       ├── shared/                           # Shared across all pages of that role
│       │   ├── componentObjects/             # Role-shared component objects
│       │   └── steps/                        # Role-shared BDD step fixtures
│       └── {featureName}/                    # e.g. home/, lifeProject/trajectories/
│           ├── {Role}{Page}Page.ts           # PageObject
│           ├── types.ts                      # (optional) feature-specific types
│           └── componentObjects/             # Page-specific component objects
├── .features-gen/                            # Auto-generated spec files (DO NOT EDIT)
├── playwright.config.ts
├── global-setup.ts
├── global-teardown.ts
├── package.json
├── tsconfig.json
└── .env
```

---

## Architecture

The framework is organized in **4 layers**, each with strict responsibilities:

```
┌─────────────────────────────────────────────────────┐
│  Feature files (.feature)                           │  Gherkin scenarios
├─────────────────────────────────────────────────────┤
│  PageObjects / Steps fixtures                       │  @Fixture + @Given/@When/@Then
│  (StudentHomePage, StudentLayoutSteps, ...)         │
├─────────────────────────────────────────────────────┤
│  ComponentObjects                                   │  Locators + actions, NO decorators
│  (StudentLayout, SkillsWidget, PageTitle, ...)      │
├─────────────────────────────────────────────────────┤
│  Base classes                                       │
│  (BaseObject, BasePage)                             │
└─────────────────────────────────────────────────────┘
```

### Layer 1 — Base Classes

**`BaseObject`** — base for all ComponentObjects:
```typescript
export abstract class BaseObject {
  protected constructor (protected readonly root: Locator, protected page?: Page) {}

  getRoot () { return this.root }
  async click () { await this.root.click() }
  async isVisible () { await expect(this.root).toBeVisible() }
}
```

**`BasePage`** — base for PageObjects, provides shared page-level steps:
```typescript
export abstract class BasePage {
  protected constructor (public page: Page) {}

  @Given('the page is displayed on mobile viewport')
  async verifyMobileViewport () { ... }

  @When('the user scrolls down through the page')
  async scrollDown () { ... }

  @Then('no horizontal scrolling is required')
  async verifyNoHorizontalScroll () { ... }
}
```

---

### Layer 2 — ComponentObjects

ComponentObjects encapsulate locators and actions for a **specific UI component**. They:
- **Extend `BaseObject`**
- Receive the component root element (or `Page`) in the constructor
- Expose `get*()` locator methods and `verify*()` / action methods
- **NEVER** use `@Given`, `@When`, `@Then` decorators
- **NEVER** use `@Fixture` decorator

**Pattern — component scoped by root `Locator`** (received from parent):
```typescript
// e2e/framework/student/user/componentObjects/ProfileCard.ts
export class ProfileCard extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getProfileBanner () { return this.root.getByTestId('profile-banner') }
  getProfilePicture () { return this.root.getByTestId('profile-picture') }
  getStudentName () { return this.root.getByTestId('student-name') }

  async verifyProfileBanner () {
    await expect(this.getProfileBanner()).toBeVisible()
  }
}
```

**Pattern — component scoped by `Page`** (when component has a known `data-testid`):
```typescript
// e2e/framework/student/home/componentObjects/SkillsWidget.ts
export class SkillsWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-skills-widget'), page)
  }

  getCards () { return this.root.getByTestId('skill-card') }
  getCard (index: number) { return new SkillCard(this.getCards().nth(index)) }

  async verifyVisible () { await this.isVisible() }
}
```

**Pattern — layout component scoped by semantic element**:
```typescript
// e2e/framework/student/shared/componentObjects/StudentLayout.ts
export class StudentLayout extends BaseObject {
  constructor (protected page: Page) {
    super(page.locator('header'), page)
  }

  getMainNavigation () { return this.root.getByTestId('main-navigation').locator('nav') }
  getMailboxButton () { return this.root.getByTestId('mailbox-button').getByRole('button') }
}
```

---

### Layer 3 — Steps Fixtures and PageObjects

Both use `@Fixture` and step decorators. The distinction is **scope**:

| Type | Scope | Location |
|------|-------|----------|
| **Steps fixture** | Shared across pages (global layout, page title component) | `shared/steps/` or `{role}/shared/steps/` |
| **PageObject** | Single page | `{role}/{feature}/` |

#### Steps Fixture

For UI components that appear **identically on multiple pages** (same locators, same behavior). Steps are written once and reused everywhere the component appears.

```typescript
// e2e/framework/shared/steps/PageTitleSteps.ts
export
@Fixture<typeof test>('pageTitleSteps')
class PageTitleSteps {
  constructor (public page: Page) {}

  getPageTitle () {
    return new PageTitle(this.page.getByTestId('page-title'))
  }

  private getCurrentPageConfig () {
    const url = this.page.url()
    const configs = {
      [STUDENT_ROUTES.PROJECT.ACTIVITIES]: {
        title: t('student.buildProject.views.projectActivitiesView.title'),
        breadcrumbItems: [ ... ]
      },
      [STUDENT_ROUTES.PROJECT.TRAJECTORIES]: {
        title: t('student.global.views.studentProjectTrajectoriesView.title'),
        breadcrumbItems: [ ... ]
      }
    }
    const entry = Object.entries(configs).find(([route]) => url.includes(route))
    if (!entry) throw new Error(`No config for URL: ${url}`)
    return entry[1]
  }

  @Given('the page title is visible')
  async verifyPageTitleVisible () { await this.getPageTitle().verifyVisible() }

  @Then('the page title is correct')
  async verifyPageTitleCorrect () {
    await this.getPageTitle().verifyTitle(this.getCurrentPageConfig().title)
  }

  @Then('the breadcrumb is correct')
  async verifyBreadcrumbCorrect () {
    await this.getPageTitle().verifyBreadcrumbItems(this.getCurrentPageConfig().breadcrumbItems)
  }
}
```

Steps fixtures backed by a ComponentObject delegate all locator logic to it:
```typescript
// e2e/framework/student/shared/steps/StudentLayoutSteps.ts
export
@Fixture<typeof test>('studentLayoutSteps')
class StudentLayoutSteps {
  private layout: StudentLayout

  constructor (public page: Page) {
    this.layout = new StudentLayout(page)
  }

  @Then('the main navigation menu is visible')
  async verifyMainNavigationMenu () {
    await expect(this.layout.getMainNavigation()).toBeVisible()
  }

  @When('the user clicks on the BUILDING MY LIFE PROJECT menu')
  async openBuildingLifeProjectSubmenu () {
    await this.layout.getBuildingLifeProjectButton().click()
  }
}
```

#### PageObject

For steps **specific to a single page**. Composes ComponentObjects for locator access:

```typescript
// e2e/framework/student/home/StudentHomePage.ts
export
@Fixture<typeof test>('studentHomePage')
class StudentHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getSkillsWidget () { return new SkillsWidget(this.page) }

  @Then('the educational skills widget is visible')
  async verifyEducationalSkillsWidgetVisible () {
    await this.getSkillsWidget().verifyVisible()
  }

  @Then('skill cards are displayed')
  async verifySkillCards () {
    await this.getSkillsWidget().verifyCardsDisplayed()
  }
}
```

---

### Layer 4 — Fixture Registry (`fixtures.ts`)

**`fixtures.ts` is the only file that wires everything together.** It only imports and registers; it contains no step definitions or locators.

```typescript
// e2e/framework/shared/fixtures/fixtures.ts
import { PageTitleSteps } from '@e2e/framework/shared/steps/PageTitleSteps'
import { StudentLayoutSteps } from '@e2e/framework/student/shared/steps/StudentLayoutSteps'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'

interface Fixtures {
  pageTitleSteps: PageTitleSteps
  studentLayoutSteps: StudentLayoutSteps
  studentHomePage: StudentHomePage
}

export const test = base.extend<Fixtures>({
  pageTitleSteps: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new PageTitleSteps(page))
  },
  studentLayoutSteps: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentLayoutSteps(page))
  },
  studentHomePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentHomePage(page))
  }
})
```

---

## Decision Guide

### Does this ComponentObject need a Steps fixture?

Not every ComponentObject needs its own Steps fixture. The question is whether the component has **behavior that Gherkin scenarios need to verify directly**.

**`ProfileCard` — ComponentObject only, no Steps fixture**

`ProfileCard` is a pure display card: it shows data (banner, picture, name, bio) with no user interaction and no functional rules to verify beyond visibility. Its `verify*()` methods are called directly by the PageObject that owns it.

```typescript
// StudentProjectTrajectoriesPage.ts — PageObject uses ProfileCard directly
getProfileCard () { return new ProfileCard(this.page.getByTestId('profile-card')) }

@Then('the profile card is visible')
async verifyProfileCardVisible () {
  await this.getProfileCard().verifyCardContent()
}
```

There is no `ProfileCardSteps` fixture because: it appears in one place, has no clicks or interactions, and carries no functional rules of its own.

**`PageTitle` — ComponentObject + Steps fixture (`PageTitleSteps`)**

`PageTitle` is interactive (back button, expandable breadcrumb) and appears on every content page with page-specific title and breadcrumb items. These rules need to be verified in Gherkin, and they are the same steps regardless of which page they run on.

```typescript
// PageTitleSteps.ts — wraps PageTitle, resolves page-specific data at runtime
@Given('the page title is visible')
async verifyPageTitleVisible () { await this.getPageTitle().verifyVisible() }

@Then('the page title is correct')
async verifyPageTitleCorrect () {
  await this.getPageTitle().verifyTitle(this.getCurrentPageConfig().title)
}

@Then('the breadcrumb is correct')
async verifyBreadcrumbCorrect () {
  await this.getPageTitle().verifyBreadcrumbItems(this.getCurrentPageConfig().breadcrumbItems)
}

@When('the user clicks the back button')
async clickBackButton () { await this.getPageTitle().clickBackButton() }
```

A Steps fixture is needed when: the component appears on multiple pages, has user interactions (`click*`), or carries functional rules (correct title, correct breadcrumb structure) that belong in Gherkin scenarios.

**Decision summary:**

```
Does the component have interactions (clicks) or functional rules
that need to appear as Gherkin steps?
│
├─► YES → Create a Steps fixture wrapping the ComponentObject
│         Examples: PageTitleSteps, StudentLayoutSteps
│
└─► NO  → Use the ComponentObject directly from the PageObject
          Examples: ProfileCard, SkillCard, TraceCard
```

---

### Should this be a Steps fixture or a PageObject?

```
Is this component visible across multiple pages with the same locators?
│
├─► YES → Steps fixture in shared/steps/ or {role}/shared/steps/
│         Examples: PageTitleSteps (PageTitle component)
│                   StudentLayoutSteps (StudentLayout header)
│
└─► NO  → PageObject (specific to one page)
          Examples: StudentHomePage, StudentProjectActivitiesPage
```

### Should this be a ComponentObject or inline in a Steps/PageObject?

```
Does this UI element have its own locators and verification logic?
│
├─► YES → ComponentObject (extends BaseObject, no decorators)
│         Examples: SkillsWidget, ProfileCard, StudentLayout, PageTitle
│
└─► NO  → Inline locator in the Steps/PageObject that uses it
```

### Where does the ComponentObject go?

```
Is it used by a single page only?
│
├─► YES → {role}/{feature}/componentObjects/
│         Example: SideNavigation in student/lifeProject/trajectories/componentObjects/
│
└─► NO  → Is it student-specific?
           │
           ├─► YES → student/shared/componentObjects/
           │         Example: StudentLayout
           │
           └─► NO  → shared/componentObjects/
                      Example: PageTitle
```

---

## Feature Files (Gherkin)

### Structure

```gherkin
@feature-tag
Feature: Page Name

  Background:
    Given the student opens the home page

  Rule: Section Name

    Background:
      Given some shared precondition for this rule

    @high @tag
    Scenario: Description
      When the user does something
      Then the expected outcome is visible
```

### Desktop vs Mobile vs Deferred

- Desktop tests: `{featureName}.feature`
- Mobile tests: `{featureName}.mobile.feature` with `@mobile` tag
- Deferred tests: `{featureName}.deferred.feature` — excluded when `REVIEW_MODE=true`

Mobile feature files add the `@mobile` tag and use `Given the page is displayed on mobile viewport` (from `BasePage`):

```gherkin
@feature-tag @mobile
Feature: Page Name

  Background:
    Given the student opens the home page

  Rule: Responsive Behavior

    Background:
      Given the page is displayed on mobile viewport

    @medium @responsive
    Scenario: Mobile layout is correct
      Then the mobile menu button is visible
```

### Deferred Feature Files

When an entire Rule (Background + all scenarios) should be excluded in review/demo mode, move it to a **deferred feature file** (`{featureName}.deferred.feature`). These files are automatically ignored when `REVIEW_MODE=true` via `testIgnore` in the Playwright config.

```gherkin
@feature-tag
Feature: Page Name - Deferred

  Background:
    Given the student opens the home page

  Rule: Widget requiring full dataset

    Background:
      Given the widget is visible

    @high @dataset-full
    Scenario: Widget displays data
      Then the widget shows 3 items
```

**When to use deferred files vs separate scenarios:**
- Use `{featureName}.deferred.feature` when **all scenarios in a Rule** are excluded — this prevents Background steps from running and failing
- Keep scenarios in the main feature file when only **some scenarios in a Rule** need to run in review mode

---

## Gherkin Keywords

| Keyword | Purpose |
|---------|---------|
| `Given` | Setup/preconditions |
| `When` | User action |
| `Then` | Expected outcome |
| `And` | Continuation (inherits previous keyword type) |

`And` always inherits the meaning of the last primary keyword (`Given`, `When`, or `Then`).

---

## Naming Conventions

### Files

| Type | Naming | Example |
|------|--------|---------|
| PageObject | `{Role}{Page}Page.ts` | `StudentHomePage.ts` |
| Steps fixture | `{Component}Steps.ts` | `StudentLayoutSteps.ts`, `PageTitleSteps.ts` |
| ComponentObject | `{ComponentName}.ts` | `SkillsWidget.ts`, `ProfileCard.ts` |
| Feature (desktop) | `{feature}.feature` | `trajectories.feature` |
| Feature (deferred) | `{feature}.deferred.feature` | `home.deferred.feature` |
| Feature (mobile) | `{feature}.mobile.feature` | `trajectories.mobile.feature` |

### Methods

| Type | Prefix | Returns | Example |
|------|--------|---------|---------|
| Element getter | `get` | `Locator` | `getTitle()`, `getMailboxButton()` |
| ComponentObject getter | `get` | ComponentObject instance | `getSkillsWidget()`, `getProfileCard()` |
| Verification | `verify` | `Promise<void>` | `verifyVisible()`, `verifyBreadcrumb()` |
| Action | `click`, `fill`, `select` | `Promise<void>` | `clickSeeAllButton()` |

---

## Tags

| Tag | Purpose |
|-----|---------|
| `@high` | Critical functionality |
| `@medium` | Important but not critical |
| `@mobile` | Mobile-specific scenarios |
| `@responsive` | Responsive behavior tests |
| `@page-title` | Page title component tests |
| `@dataset-full` | Requires a fully populated account — see [Datasets](#datasets) |
| `@dataset-nominal` | Requires a nominal account — see [Datasets](#datasets) |
| `@dataset-empty` | Requires an empty account — see [Datasets](#datasets) |
| `@{feature-name}` | Feature categorization (e.g., `@self-knowledge`) |

---

## Datasets

Some scenarios require specific backend data to be present. The dataset mechanism controls **which user token is injected** per scenario, pointing the test at a backend account that has the right data.

### How it works

A `BeforeScenario` hook in `dataset.hook.ts` injects extra HTTP headers before the scenario runs using `page.setExtraHTTPHeaders()`:

```typescript
// e2e/framework/shared/hooks/dataset.hook.ts
BeforeScenario({ tags: DatasetType.EMPTY }, async ({ page }) => {
  await page.setExtraHTTPHeaders({
    'x-dataset-empty': 'true',
    Authorization: `Bearer ${token}`,
  })
})
```

`page.setExtraHTTPHeaders()` injects headers at the browser level — before any Service Worker sees the request — which makes it work identically in both **MSW mode** and **pure API mode**.

The hook only runs when `shouldIntercept: true` — `@dataset-full` does **not** intercept because the default application token already points to a fully-populated account.

### Mocking architecture

The app supports two runtime modes controlled by `VITE_ENABLE_MSW`. The dataset hook is the same in both; only what handles the request differs.

#### MSW mode (`VITE_ENABLE_MSW=true`)

The app is served with a registered Service Worker (MSW) that intercepts all API requests in the browser. MSW handlers read the injected dataset header and return the appropriate mock response — the real backend is **never called**.

```
  Playwright Test          BeforeScenario Hook       Browser Page        MSW Service Worker      MSW Handler
        │                          │                       │                      │                    │
        │  scenario @dataset-empty │                       │                      │                    │
        │─────────────────────────>│                       │                      │                    │
        │                          │  setExtraHTTPHeaders( │                      │                    │
        │                          │  x-dataset-empty:true,│                      │                    │
        │                          │  Authorization: token)│                      │                    │
        │                          │──────────────────────>│                      │                    │
        │◄─────────────────────────│                       │                      │                    │
        │                          │                       │                      │                    │
        │        navigate + interact                        │                      │                    │
        │──────────────────────────────────────────────────>│                    │                    │
        │                          │                       │ fetch() + headers    │                    │
        │                          │                       │─────────────────────>│                   │
        │                          │                       │    ╔══════════════════╧══════╗            │
        │                          │                       │    ║ SW intercepts BEFORE    ║            │
        │                          │                       │    ║ network layer            ║            │
        │                          │                       │    ╚══════════════════╤══════╝            │
        │                          │                       │                       │  x-dataset-empty? │
        │                          │                       │                       │──────────────────>│
        │                          │                       │                       │                   │ createEmptyPaginatedDatasetResponse()
        │                          │                       │                       │                   │──────┐
        │                          │                       │                       │                   │◄─────┘
        │                          │                       │                       │ { data:[], ... }  │
        │                          │                       │◄──────────────────────│◄──────────────────│
        │                          │                       │  HTTP 200 (no real network call)
```

#### Pure API mode (`VITE_ENABLE_MSW=false`)

No Service Worker is registered. Requests go directly to the real backend. The injected token identifies which dataset user to use on the backend side.

```
  Playwright Test          BeforeScenario Hook       Browser Page         Real Backend (APIM)
        │                          │                       │                        │
        │  scenario @dataset-empty │                       │                        │
        │─────────────────────────>│                       │                        │
        │                          │  setExtraHTTPHeaders( │                        │
        │                          │  x-dataset-empty:true,│                        │
        │                          │  Authorization: token)│                        │
        │                          │──────────────────────>│                        │
        │◄─────────────────────────│                       │                        │
        │                          │                       │                        │
        │        navigate + interact                        │                        │
        │──────────────────────────────────────────────────>│                       │
        │                          │                       │ fetch() + headers       │
        │                          │                       │────────────────────────>│
        │                          │                       │                         │ token → identifies
        │                          │                       │                         │ empty-dataset user
        │                          │                       │◄────────────────────────│
        │                          │                       │  HTTP 200 { data: [] }  │
```

### Dataset tags

| Tag | Description | Token source | Intercepts |
|-----|-------------|--------------|------------|
| `@dataset-full` | Account with all data populated (skills, traces, events, …) | App default (`VITE_AVENIR_ESR_ACCESS_TOKEN`) | No |
| `@dataset-nominal` | Account with a representative but not exhaustive dataset | `NOMINAL_DATASET_ACCESS_TOKEN` env var | Yes |
| `@dataset-empty` | Account with empty datasets — used to test empty states | `EMPTY_DATASET_ACCESS_TOKEN` env var | Yes |

### Configuration

Add the token values in `e2e/.env` (copy from `e2e/.env.example`):

```bash
NOMINAL_DATASET_ACCESS_TOKEN=<token-for-nominal-account>
EMPTY_DATASET_ACCESS_TOKEN=<token-for-empty-account>
```

`@dataset-full` does not require a dedicated token — the application default token is used.

### Usage in feature files

Tag the scenario (not the feature) with the appropriate dataset tag:

```gherkin
@high @skills @dataset-full
Scenario: Skills widget displays 6 skills
  Then the skills widget shows 6 skills

@high @traces @dataset-full
Scenario: Traces widget displays 3 traces
  Then 3 trace cards are displayed
```

Scenarios without a dataset tag run with whatever token the application is configured with. Only tag a scenario when it **requires a specific data state** to be meaningful.

---

## Internationalization (i18n)

Always use `t()` for text assertions — never hardcode strings:

```typescript
import { t } from '@e2e/framework/shared/utils/i18n'

await expect(this.getTitle()).toHaveText(t('student.global.widgets.skills.title'))
```

The locale is initialized per fixture via `setLocaleFromPage(page)` in `fixtures.ts`.

---

## Running Tests

```bash
# Must be run from the e2e/ directory
cd e2e

# Generate spec files from feature files (required after any .feature change)
npx bddgen

# Run all tests
npm run e2e

# Run desktop tests only
npm run e2e -- --project=chromium

# Run mobile tests only
npm run e2e -- --project=mobile-chrome

# Run by tag
npm run e2e -- --grep "@self-knowledge"

# UI mode
npm run e2e:ui

# Show report
npm run e2e:report
```

> **Important**: `npx bddgen` must be run from the `e2e/` directory, not the project root.

---

## Playwright Configuration

```typescript
// playwright.config.ts
const testDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: [
    'framework/**/*Page.ts',
    'framework/**/*Steps.ts',
    'framework/shared/fixtures/fixtures.ts'
  ]
})
```

**Browser projects:**
- `chromium`, `firefox`, `webkit` — Desktop (skips `*.mobile.feature.spec.js` and `*.deferred.feature.spec.js` when `REVIEW_MODE=true`)
- `mobile-chrome`, `mobile-safari` — Mobile (only runs `*.mobile.feature.spec.js`)

**Key settings:**
- Base URL: `http://localhost:4173/cofolio/`
- Locale: `fr-FR`
- Timezone: `Europe/Paris`
- Desktop viewport: 1920×1080

---

## Workflow

1. **Write feature file** — Gherkin scenarios in `tests/`
2. **Create ComponentObjects** — extract locators into ComponentObject classes
3. **Create PageObject or Steps fixture** — add step definitions with decorators
4. **Register fixture** — add to `fixtures.ts`
5. **Generate specs** — `npx bddgen` (from `e2e/` directory)
6. **Run tests** — `npm run e2e`

---

## Troubleshooting

### "No BDD configs found" when running bddgen
Run `npx bddgen` from the `e2e/` directory, not the project root.

### Duplicate step definitions error
Each step pattern must be unique across all registered fixtures. If two fixtures define the same step text, extract it to a shared Steps fixture.

### Step not found / unresolved step
Ensure the fixture is registered in `fixtures.ts` and the steps glob in `playwright.config.ts` matches the file path.

### Tests not found after editing a feature file
Run `npx bddgen` to regenerate spec files.
