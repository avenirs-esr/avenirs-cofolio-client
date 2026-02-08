# E2E Testing Guide - Playwright-BDD

This document describes the patterns and conventions used for End-to-End testing in Avenirs Cofolio using **Playwright-BDD** with the **decorator pattern**.

## Directory Structure

```
e2e/
├── tests/                              # Gherkin feature files
│   └── student/
│       ├── home.feature                # Desktop feature file
│       └── home.mobile.feature         # Mobile-specific feature file
├── framework/                          # Page Objects, Component Objects & Step definitions
│   ├── shared/
│   │   ├── fixtures/
│   │   │   └── fixtures.ts             # Playwright fixtures registration
│   │   ├── utils/
│   │   │   ├── dimension.ts            # Viewport and breakpoint constants
│   │   │   ├── i18n.ts                 # Internationalization helper
│   │   │   └── waits.ts                # Wait utilities
│   │   └── base/
│   │       └── BaseObject.ts           # Base class for Page/Component Objects
│   └── student/
│       ├── home/
│       │   ├── StudentHomePage.ts      # PageObject with @Fixture decorator + step definitions
│       │   └── componentsObjects/      # Component Objects for the page
│       │       ├── SkillsWidget.ts
│       │       ├── TracesWidget.ts
│       │       ├── EventsWidget.ts
│       │       └── ...
│       ├── skills/
│       │   └── componentObjects/
│       │       └── SkillCard.ts        # Reusable component object
│       ├── traces/
│       │   └── componentObjects/
│       │       └── TraceCard.ts        # Reusable component object
│       └── ams/
│           └── componentObjects/
│               └── AmsCountIconText.ts # Shared component object
├── .features-gen/                      # Auto-generated spec files (DO NOT EDIT)
│   └── tests/
│       └── student/
│           ├── home.feature.spec.js
│           └── home.mobile.feature.spec.js
├── playwright.config.ts                # Playwright + BDD configuration
├── global-setup.ts                     # Global setup (environment loading)
├── global-teardown.ts                  # Global teardown
├── package.json                        # E2E dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
└── .env                                # Environment variables
```

## Playwright-BDD Architecture

### Key Concepts

1. **PageObject with Decorators**: Each page has a class decorated with `@Fixture` that contains both locators and step definitions (`@Given`, `@When`, `@Then`).

2. **ComponentObject**: Reusable UI components are encapsulated in separate classes without decorators. They are instantiated by PageObjects.

3. **Fixtures**: PageObjects are registered as Playwright fixtures in `fixtures.ts` and automatically injected into tests.

4. **Generated Specs**: The `bddgen` command generates spec files from feature files. These are stored in `.features-gen/` and should NOT be edited manually.

### PageObject Pattern (with Decorators)

```typescript
import { test } from '@e2e/framework/shared/fixtures/fixtures'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentHomePage')
class StudentHomePage {
  constructor (public page: Page) {}

  getSkillsWidget () {
    return new SkillsWidget(this.page)
  }

  // Step definitions with decorators
  @Given('the student opens the home page')
  async goto () {
    await this.page.goto('/cofolio/student')
  }

  @Then('the student home page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(/\/cofolio\/student/)
  }

  @When('the student clicks see all skills button')
  async clickSeeAllSkillsButton () {
    await this.getSkillsWidget().clickSeeAllButton()
  }
}
```

### ComponentObject Pattern (without Decorators)

```typescript
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class SkillsWidget {
  constructor (private page: Page) {}

  getContainer () {
    return this.page.getByTestId('skills-widget')
  }

  getSeeAllButton () {
    return this.getContainer().getByTestId('see-all-skills-btn')
  }

  async verifyVisible () {
    await expect(this.getContainer()).toBeVisible()
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
```

### Shared/Reusable ComponentObjects

For components used across multiple pages (e.g., AmsCountIconText):

```typescript
// e2e/framework/student/ams/componentObjects/AmsCountIconText.ts
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Locator } from '@playwright/test'

export class AmsCountIconText {
  private element: Locator

  constructor (parent: Locator) {
    this.element = parent.getByTestId('count-ams-icon-text')
  }

  async verify () {
    await expect(this.element).toBeVisible()
    const text = await this.element.textContent()
    // Validate using i18n
  }
}
```

Usage in other ComponentObjects:
```typescript
import { AmsCountIconText } from '@e2e/framework/student/ams/componentObjects/AmsCountIconText'

export class SkillCard {
  constructor (private root: Locator) {}

  getAmsCountIconText () {
    return new AmsCountIconText(this.root)
  }

  async verifyAmsCount () {
    await this.getAmsCountIconText().verify()
  }
}
```

## Fixture Patterns

### When to Create a Fixture

Use this decision tree to determine if a component should be a fixture:

```
Is the component a business workflow or stateful action?
(login, form submission, data setup)
│
├─► YES → Does it have a UNIQUE locator across all pages?
│         │
│         ├─► YES → Create as STANDALONE FIXTURE
│         │         (e.g., UpdateProfileDrawer with same test-id everywhere)
│         │
│         └─► NO  → Use INHERITANCE PATTERN
│                   (e.g., SkillForm used in AddSkillDrawer and EditSkillPage)
│
└─► NO (simple visual component like badge, counter, card)
    │
    └─► Create as COMPONENT OBJECT (no fixture)
        Use composition pattern
```

### Pattern 1: Standalone Fixture (Unique Locator)

When a component has the **same `data-testid`** on all pages, create it as a standalone fixture.

**Example: UpdateProfileDrawer**

The drawer has the same locator `data-testid="update-profile-drawer"` whether opened from HomePage or ProfilePage.

```typescript
// e2e/framework/student/profile/componentObjects/UpdateProfileDrawer.ts
import { Fixture, When, Then } from 'playwright-bdd/decorators'
import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export
@Fixture<typeof test>('updateProfileDrawer')
class UpdateProfileDrawer {
  readonly root

  constructor(public page: Page) {
    this.root = page.getByTestId('update-profile-drawer')
  }

  getNameInput() {
    return this.root.getByTestId('profile-name-input')
  }

  getSubmitButton() {
    return this.root.getByTestId('profile-submit-btn')
  }

  @When('the student fills the profile name with {string}')
  async fillName(name: string) {
    await this.getNameInput().fill(name)
  }

  @When('the student submits the profile form')
  async submit() {
    await this.getSubmitButton().click()
  }

  @Then('the update profile drawer is visible')
  async isVisible() {
    await expect(this.root).toBeVisible()
  }

  @Then('the update profile drawer is closed')
  async isClosed() {
    await expect(this.root).not.toBeVisible()
  }
}
```

Register in fixtures:
```typescript
// e2e/framework/shared/fixtures/fixtures.ts
import { UpdateProfileDrawer } from '@e2e/framework/student/profile/componentObjects/UpdateProfileDrawer'

interface Fixtures {
  studentHomePage: StudentHomePage
  updateProfileDrawer: UpdateProfileDrawer
}

export const test = base.extend<Fixtures>({
  studentHomePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentHomePage(page))
  },

  updateProfileDrawer: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new UpdateProfileDrawer(page))
  }
})
```

Feature file uses steps from both fixtures:
```gherkin
Feature: Update Profile

  Scenario: Student updates profile from home
    Given the student opens the home page
    When the student clicks the edit profile button
    Then the update profile drawer is visible
    When the student fills the profile name with "John"
    And the student submits the profile form
    Then the update profile drawer is closed
    And the profile is successfully updated
```

### Pattern 2: Inheritance (Shared Logic, Different Locators)

When the **same form/logic** is used across pages but with **different locators**, use inheritance.

**Example: SkillForm in AddSkillDrawer and EditSkillPage**

- `AddSkillDrawer`: Form is inside a drawer with locator `data-testid="add-skill-drawer"`
- `EditSkillPage`: Same form fields but on a page with locator `data-testid="edit-skill-form"`

```typescript
// e2e/framework/shared/base/BasePageWithSkillForm.ts
import { When, Then } from 'playwright-bdd/decorators'
import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export abstract class BasePageWithSkillForm {
  constructor(public page: Page) {}

  abstract getSkillFormRoot(): Locator

  getSkillNameInput() {
    return this.getSkillFormRoot().getByTestId('skill-name-input')
  }

  getSkillDescriptionInput() {
    return this.getSkillFormRoot().getByTestId('skill-description-input')
  }

  getSkillLevelSelect() {
    return this.getSkillFormRoot().getByTestId('skill-level-select')
  }

  getSubmitButton() {
    return this.getSkillFormRoot().getByTestId('skill-submit-btn')
  }

  @When('the student fills the skill name with {string}')
  async fillSkillName(name: string) {
    await this.getSkillNameInput().fill(name)
  }

  @When('the student fills the skill description with {string}')
  async fillSkillDescription(description: string) {
    await this.getSkillDescriptionInput().fill(description)
  }

  @When('the student selects skill level {string}')
  async selectSkillLevel(level: string) {
    await this.getSkillLevelSelect().selectOption(level)
  }

  @When('the student submits the skill form')
  async submitSkillForm() {
    await this.getSubmitButton().click()
  }

  @Then('the skill form shows validation error {string}')
  async verifyValidationError(errorMessage: string) {
    await expect(this.getSkillFormRoot().getByText(errorMessage)).toBeVisible()
  }
}
```

Pages extend the base class and provide their specific locator:

```typescript
// e2e/framework/student/skills/StudentAddSkillPage.ts
import { Fixture, Given, Then } from 'playwright-bdd/decorators'
import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePageWithSkillForm } from '@e2e/framework/shared/base/BasePageWithSkillForm'

export
@Fixture<typeof test>('studentAddSkillPage')
class StudentAddSkillPage extends BasePageWithSkillForm {
  constructor(page: Page) {
    super(page)
  }

  getSkillFormRoot(): Locator {
    return this.page.getByTestId('add-skill-drawer')
  }

  getAddSkillButton() {
    return this.page.getByTestId('add-skill-btn')
  }

  @Given('the student opens the add skill drawer')
  async openAddSkillDrawer() {
    await this.getAddSkillButton().click()
  }

  @Then('the add skill drawer is visible')
  async verifyDrawerVisible() {
    await expect(this.getSkillFormRoot()).toBeVisible()
  }

  // Inherited from BasePageWithSkillForm:
  // - fillSkillName, fillSkillDescription, selectSkillLevel
  // - submitSkillForm, verifyValidationError
}
```

```typescript
// e2e/framework/student/skills/StudentEditSkillPage.ts
import { Fixture, Given, Then } from 'playwright-bdd/decorators'
import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePageWithSkillForm } from '@e2e/framework/shared/base/BasePageWithSkillForm'

export
@Fixture<typeof test>('studentEditSkillPage')
class StudentEditSkillPage extends BasePageWithSkillForm {
  constructor(page: Page) {
    super(page)
  }

  getSkillFormRoot(): Locator {
    return this.page.getByTestId('edit-skill-form')
  }

  @Given('the student opens the edit skill page for skill {string}')
  async openEditSkillPage(skillId: string) {
    await this.page.goto(`/cofolio/student/skills/${skillId}/edit`)
  }

  @Then('the edit skill page is displayed')
  async verifyPageDisplayed() {
    await expect(this.getSkillFormRoot()).toBeVisible()
  }

  // Inherited from BasePageWithSkillForm:
  // - fillSkillName, fillSkillDescription, selectSkillLevel
  // - submitSkillForm, verifyValidationError
}
```

Feature files - same steps, different pages:
```gherkin
# add-skill.feature
Feature: Add Skill

  Scenario: Student adds a new skill
    Given the student opens the home page
    When the student opens the add skill drawer
    Then the add skill drawer is visible
    When the student fills the skill name with "TypeScript"
    And the student fills the skill description with "Programming language"
    And the student selects skill level "Intermediate"
    And the student submits the skill form
    Then the skill is successfully added

# edit-skill.feature
Feature: Edit Skill

  Scenario: Student edits an existing skill
    Given the student opens the edit skill page for skill "123"
    Then the edit skill page is displayed
    When the student fills the skill name with "TypeScript Advanced"
    And the student fills the skill description with "Updated description"
    And the student submits the skill form
    Then the skill is successfully updated
```

### Pattern 3: Composition (Simple Components)

For simple visual components without business logic, use composition without fixtures.

**Example: AmsCountIconText, SkillCard, StatusBadge**

These components:
- Are simple UI elements
- Have no business workflow
- Could exist in Storybook without backend
- Take a parent locator in constructor

```typescript
// ComponentObject - NOT a fixture
export class AmsCountIconText {
  constructor(private root: Locator) {}

  async verify() {
    await expect(this.root).toBeVisible()
  }
}

// Used via composition in PageObject or other ComponentObject
export class SkillCard {
  constructor(private root: Locator) {}

  getAmsCountIconText() {
    return new AmsCountIconText(this.root.getByTestId('count-ams-icon-text'))
  }

  async verifyAmsCount() {
    await this.getAmsCountIconText().verify()
  }
}
```

### Summary Table

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Standalone Fixture** | Same locator everywhere, business workflow | `UpdateProfileDrawer`, `LoginPage`, `ConfirmationModal` |
| **Inheritance** | Same form/logic, different locators per page | `SkillForm` in drawer vs page, `TraceForm` add vs edit |
| **Composition** | Simple visual component, no business logic | `AmsCountIconText`, `SkillCard`, `StatusBadge` |

### Fixtures Registration

All PageObjects must be registered in `fixtures.ts`:

```typescript
// e2e/framework/shared/fixtures/fixtures.ts
import { setLocaleFromPage } from '@e2e/framework/shared/utils/i18n'
import { StudentHomePage } from '@e2e/framework/student/home/StudentHomePage'
import { test as base } from 'playwright-bdd'

interface Fixtures {
  studentHomePage: StudentHomePage
}

export const test = base.extend<Fixtures>({
  studentHomePage: async ({ page }, use) => {
    await setLocaleFromPage(page)
    await use(new StudentHomePage(page))
  }
})
```

## Feature Files (Gherkin)

### Desktop Feature File

```gherkin
@home
Feature: Student Home Page

  Background:
    Given the student opens the home page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load home page successfully
      Then the student home page is displayed
      And the page URL contains "/cofolio/student"
      And the page title is "Cofolio"

  Rule: Skills Widget

    @high @skills
    Scenario: Skills widget displays when courses with skills exist
      Given the educational skills widget is visible
      Then skill cards are displayed
      And each skill card shows status badge
```

### Mobile Feature File

Mobile-specific tests go in a separate `.mobile.feature` file:

```gherkin
@home @mobile
Feature: Student Home Page (Mobile)

  Background:
    Given the student opens the home page
    And the page is displayed on mobile viewport

  Rule: Navigation

    @high @navigation
    Scenario: Mobile menu is accessible
      Then the mobile menu button is visible
      When the student clicks mobile menu button
      Then the navigation drawer opens
```

### Naming Conventions

- Desktop: `{featureName}.feature`
- Mobile: `{featureName}.mobile.feature`

## Gherkin Syntax Rules

### Keywords Order and Combinations

Understanding the proper order and usage of Gherkin keywords is essential for writing clear and maintainable feature files.

#### The Four Keywords

| Keyword | Purpose | Type |
|---------|---------|------|
| `Given` | Setup/preconditions - describes the initial context | Primary |
| `When` | Action/event - describes what the user does | Primary |
| `Then` | Expected outcome - describes what should happen | Primary |
| `And` | Continuation - inherits the type of the previous primary keyword | Secondary |

#### Valid Keyword Sequences

Primary Keywords can appear in any order, but follow these patterns:

```gherkin
# Pattern 1: Full Given-When-Then (most common)
Given [context/setup]
When [action]
Then [expected outcome]

# Pattern 2: Given-Then (state verification without action)
Given [context/setup]
Then [expected outcome]

# Pattern 3: When-Then (action without specific setup)
When [action]
Then [expected outcome]

# Pattern 4: Just Then (verification after Background)
Then [expected outcome]
```

#### `And` Inheritance Rules

`And` always inherits the type of the last primary keyword (`Given`, `When`, or `Then`):

```gherkin
# And inherits from Given
Given the student is logged in
And the student has a profile        # Acts as Given
And the student has skills           # Acts as Given

# And inherits from When
When the student clicks the button
And the student fills the form       # Acts as When
And the student submits              # Acts as When

# And inherits from Then
Then the page is displayed
And the title is visible             # Acts as Then
And the URL contains "/home"         # Acts as Then

# Mixing: And changes meaning based on last primary keyword
Given the student is on the home page
And the page is loaded               # Acts as Given
When the student clicks edit
And the student fills the name       # Acts as When (inherited from When)
Then the drawer is visible
And the form is displayed            # Acts as Then (inherited from Then)
```

#### Valid Transitions

| From | Can be followed by | Example |
|------|-------------------|---------|
| `Given` | `And`, `When`, `Then` | `Given user logged in` → `And has profile` |
| `When` | `And`, `Then` | `When user clicks` → `And fills form` |
| `Then` | `And`, `When` | `Then page visible` → `When user clicks` |
| `And` | `And`, `When`, `Then` | `And profile exists` → `When user clicks` |

#### Common Patterns and Use Cases

**1. Background + Scenario starting with Then**
```gherkin
Background:
  Given the student opens the home page
  And the page is fully loaded

Scenario: Page displays correctly
  Then the student home page is displayed
  And the page title is "Cofolio"
```
**Why valid:** The `Background` already contains the setup/action (navigation). The scenario just verifies the result.

---

**2. Multiple Givens (setup)**
```gherkin
Scenario: Student with complete profile
  Given the student is logged in
  And the student has a profile picture
  And the student has a bio
  When the student opens the home page
  Then the profile section is complete
```
**Use case:** Building complex initial state with multiple preconditions.

---

**3. Multiple Whens (sequential actions)**
```gherkin
Scenario: Student fills a form
  Given the add skill drawer is open
  When the student fills the skill name with "TypeScript"
  And the student fills the description with "Programming"
  And the student selects level "Advanced"
  And the student submits the form
  Then the skill is created
```
**Use case:** Multi-step user workflow or form filling.

---

**4. Multiple Thens (multiple verifications)**
```gherkin
Scenario: Widget displays all elements
  Given the skills widget is visible
  Then the widget title is displayed
  And the skill cards are visible
  And each card shows a status badge
  And the see all button is present
```
**Use case:** Verifying multiple aspects of the result.

---

**5. Then-When-Then (verification, action, verification)**
```gherkin
Scenario: Mobile menu interaction
  Given the student opens the home page on mobile
  Then the mobile menu button is visible
  When the student clicks the mobile menu button
  Then the navigation drawer opens
  And the menu items are displayed
```
**Use case:** Verify initial state before action, then verify result after action.

#### Invalid Patterns

**Don't mix verification (Then) before action (When) in the same logical flow:**
```gherkin
# WRONG - Then before When in same flow creates confusion
Scenario: Bad order
  Given the student opens the drawer
  Then the drawer is visible          # Verification
  When the student fills the name     # Action after verification - confusing
  Then the form is submitted
```

**Better - separate or use Given for state:**
```gherkin
# BETTER - Clear flow
Scenario: Good order
  Given the student opens the drawer
  And the drawer is visible           # Use And (acts as Given) for state verification
  When the student fills the name
  And the student submits the form
  Then the skill is created
```

#### Summary of Best Practices

1. **Use `Given` for context/setup** - things that exist before the test action
2. **Use `When` for user actions** - clicks, typing, navigation
3. **Use `Then` for expected outcomes** - verifications after actions
4. **Use `And` to continue** - it inherits the meaning of the previous primary keyword
5. **Background can contain any keywords** - typically `Given` and `And` for common setup
6. **Scenarios can start with any primary keyword** - `Given`, `When`, or `Then` depending on what the Background provides
7. **Maintain logical flow** - Setup → Action → Verification is the clearest pattern

## Project Configuration

### Playwright Configuration

```typescript
// playwright.config.ts
const testDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: ['framework/**/*Page.ts', 'framework/shared/fixtures/fixtures.ts']
})
```

**Browser Projects:**
- `chromium`, `firefox`, `webkit` - Desktop (ignores `*.mobile.feature.spec.js`)
- `mobile-chrome`, `mobile-safari` - Mobile (only runs `*.mobile.feature.spec.js`)

**Key Settings:**
- Base URL: `http://localhost:4173/cofolio/`
- Locale: `fr-FR`
- Timezone: `Europe/Paris`
- Desktop viewport: 1920x1080
- Trace/Screenshots: Retained on failure only

### Environment Variables

```env
VITE_API_URL=http://localhost:4173/cofolio/
REVIEW_MODE=false
```

## Running Tests

### Generate and Run

```bash
# Generate spec files from feature files
npx bddgen

# Run all tests
npm run e2e

# Run desktop tests only
npm run e2e -- --project=chromium

# Run mobile tests only
npm run e2e -- --project=mobile-chrome

# Run specific tag
npm run e2e -- --grep "@skills"

# Run in UI mode
npm run e2e:ui

# Show report
npm run e2e:report
```

### npm Scripts

```json
{
  "e2e": "npx bddgen && playwright test",
  "e2e:ui": "npx bddgen && playwright test --ui",
  "e2e:report": "playwright show-report"
}
```

## Internationalization (i18n)

### i18n Utility

```typescript
import { setLocaleFromPage, t } from '@e2e/framework/shared/utils/i18n'

// In fixture setup
await setLocaleFromPage(page)

// In step definitions
async verifyWidgetTitle () {
  await expect(this.widgetTitle).toHaveText(t('student.global.widgets.skills.title'))
}
```

### Pluralization Validation

```typescript
async verifySkillCount () {
  const text = await this.skillCount.textContent()
  const match = text?.trim().match(/^(\d+)\s+/)
  const count = Number.parseInt(match![1])
  const expectedText = t('student.skills.count', { count })
  expect(text?.trim()).toEqual(expectedText)
}
```

## Viewports and Breakpoints

```typescript
// e2e/framework/shared/utils/dimension.ts
export const AV_BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1440
} as const

export const MOBILE_VIEWPORT = { width: 576, height: 851 }
export const DESKTOP_VIEWPORT = { width: 1920, height: 900 }
```

## Tags

| Tag | Purpose |
|-----|---------|
| `@high` | Critical functionality |
| `@medium` | Important but not critical |
| `@low` | Nice-to-have tests |
| `@mobile` | Mobile-specific scenarios |
| `@skip-review` | Skipped when `REVIEW_MODE=true` |
| `@feature-name` | Feature categorization |

## Best Practices

1. **One PageObject per page**: Each page gets a class with `@Fixture` decorator
2. **Reusable ComponentObjects**: Shared UI components go in feature-specific `componentObjects/` folders
3. **Step definitions**: Decorators (`@Given`, `@When`, `@Then`) are on PageObject methods or a Fixture.
4**Use i18n for text validation**: Never hardcode text strings
5**Separate mobile features**: Mobile-specific tests go in `.mobile.feature` files
6**Don't edit generated files**: `.features-gen/` is auto-generated by `bddgen`

## Naming Conventions

### Method Naming

| Method Type | Prefix | Example |
|-------------|--------|---------|
| **Element getter** | `get` | `getTitle()`, `getSeeAllButton()`, `getCards()` |
| **ComponentObject getter** | `get` | `getSkillsWidget()`, `getAmsCountIconText()` |
| **Verification** | `verify` | `verifyVisible()`, `verifyStatusBadge()` |
| **Action** | `click`, `fill`, `select` | `clickSeeAllButton()`, `fillName()` |
| **Count** | `count` | `countCards()`, `countItems()` |

### Examples

```typescript
// Element getters - return Locator
getTitle () {
  return this.root.getByTestId('home-widget-title')
}

getSeeAllButton () {
  return this.root.getByTestId('see-all-button')
}

getCards () {
  return this.root.getByTestId('skill-card')
}

// ComponentObject getter - return ComponentObject instance
getCard (index: number) {
  return new SkillCard(this.getCards().nth(index))
}

getAmsCountIconText () {
  return new AmsCountIconText(this.root.getByTestId('count-ams-icon-text'))
}

// Verification methods
async verifyVisible () {
  await expect(this.getTitle()).toBeVisible()
}

// Action methods
async clickSeeAllButton () {
  await this.getSeeAllButton().click()
}

// Count methods
async countCards () {
  return await this.getCards().count()
}
```

## Workflow

1. **Create Feature File**: Write Gherkin scenarios in `tests/` directory
2. **Create PageObject**: Create class with `@Fixture` decorator and step methods
3. **Create ComponentObjects**: Extract reusable UI logic into ComponentObject classes, if this component is used across multiple pages, with same step definitions, it should be created as a fixture and registered in `fixtures.ts`
4. **Register Fixture**: Add PageObject to `fixtures.ts`
5. **Generate Specs**: Run `npx bddgen` to generate spec files
6. **Run Tests**: Run `npm run e2e` to execute tests

## Troubleshooting

### "Cannot read properties of undefined"

Ensure the PageObject is properly registered in `fixtures.ts` and uses value import (not type-only):
```typescript
// Correct
import { test } from '@e2e/framework/shared/fixtures/fixtures'

// Wrong (type-only import)
import type { test } from '@e2e/framework/shared/fixtures/fixtures'
```

### Duplicate step definitions

Each step pattern must be unique. If the same step text is used with different decorators (`@Given` and `@Then`), use only one decorator.

### Tests not found

Run `npx bddgen` to regenerate spec files after modifying feature files.
