# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/staff/home.feature.spec.js >> Staff Home Page >> Navigation >> Main navigation is fully visible on desktop
- Location: .features-gen/tests/staff/home.feature.spec.js:115:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header').getByTestId('main-navigation').locator('nav')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('header').getByTestId('main-navigation').locator('nav')

```

# Test source

```ts
  1  | import type { test } from '@e2e/framework/shared/fixtures/fixtures'
  2  | import { BasePage } from '@e2e/framework/shared/base/BasePage'
  3  | import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
  4  | import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
  5  | import { StaffLayout } from '@e2e/framework/staff/shared/componentObjects/StaffLayout'
  6  | import { expect, type Page } from '@playwright/test'
  7  | import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'
  8  | 
  9  | export
  10 | @Fixture<typeof test>('staffGlobalSteps')
  11 | class StaffGlobalSteps extends BasePage {
  12 |   private layout: StaffLayout
  13 | 
  14 |   constructor (page: Page) {
  15 |     super(page)
  16 |     this.layout = new StaffLayout(page)
  17 |   }
  18 | 
  19 |   @Given('the staff opens the home page')
  20 |   async goToHomePage () {
  21 |     await this.page.goto(STAFF_ROUTES.HOME)
  22 |     await waitForPageLoad(this.page)
  23 |   }
  24 | 
  25 |   @Then('the staff home page is displayed')
  26 |   async verifyPageLoaded () {
  27 |     await expect(this.page).toHaveURL(STAFF_ROUTES.HOME)
  28 |   }
  29 | 
  30 |   @When('the user click on the ACTIVITIES link')
  31 |   async clickActivitiesLink () {
  32 |     await this.layout.getActivitiesNavLink().click()
  33 |   }
  34 | 
  35 |   @Then('the page navigates to activities page')
  36 |   async verifyNavigationToActivitiesPage () {
  37 |     await expect(this.page).toHaveURL(STAFF_ROUTES.ACTIVITIES)
  38 |   }
  39 | 
  40 |   @Then('the staff HOME link is visible')
  41 |   async verifyHomeLink () {
  42 |     await expect(this.layout.getHomeNavLink()).toBeVisible()
  43 |   }
  44 | 
  45 |   @Then('the staff ACTIVITIES link is visible')
  46 |   async verifyActivitiesLink () {
  47 |     await expect(this.layout.getActivitiesNavLink()).toBeVisible()
  48 |   }
  49 | 
  50 |   @Then('the staff main navigation menu is visible')
  51 |   async verifyMainNavigationMenuVisible () {
> 52 |     await expect(this.layout.getMainNavigation()).toBeVisible()
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  53 |   }
  54 | }
  55 | 
```