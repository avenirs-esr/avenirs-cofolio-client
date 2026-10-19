# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/staff/activities/edit-national-activity.feature.spec.js >> Staff Edit National Activity Page >> Content tab feedback interactions >> Allowing unlimited feedback interactions hides the max iterations input
- Location: .features-gen/tests/staff/activities/edit-national-activity.feature.spec.js:173:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="activity-table-title"][data-activity-status="DRAFT"], [data-testid="activity-card-title"][data-activity-status="DRAFT"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="activity-table-title"][data-activity-status="DRAFT"], [data-testid="activity-card-title"][data-activity-status="DRAFT"]').first()

```

# Test source

```ts
  1   | import type { test } from '@e2e/framework/shared/fixtures/fixtures'
  2   | import type { Locator, Page } from '@playwright/test'
  3   | import { BasePage } from '@e2e/framework/shared/base/BasePage'
  4   | import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
  5   | import { t } from '@e2e/framework/shared/utils/i18n'
  6   | import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
  7   | import { EditActivityResources } from '@e2e/framework/staff/activities/componentObjects/EditActivityResources'
  8   | import { EditActivitySideNavigation } from '@e2e/framework/staff/activities/componentObjects/EditActivitySideNavigation'
  9   | import { EditActivityTabs } from '@e2e/framework/staff/activities/componentObjects/EditActivityTabs'
  10  | import { expect } from '@playwright/test'
  11  | import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'
  12  | 
  13  | export
  14  | @Fixture<typeof test>('staffEditNationalActivityPage')
  15  | class StaffEditNationalActivityPage extends BasePage {
  16  |   constructor (public page: Page) {
  17  |     super(page)
  18  |   }
  19  | 
  20  |   private tabs () { return new EditActivityTabs(this.page) }
  21  |   private sideNav () { return new EditActivitySideNavigation(this.page) }
  22  |   private resources () { return new EditActivityResources(this.page) }
  23  | 
  24  |   private getActivityContentTab () {
  25  |     return this.page.getByTestId('activity-content-tab')
  26  |   }
  27  | 
  28  |   private getTitleFormField () {
  29  |     return this.page.getByTestId('activity-title-form-field')
  30  |   }
  31  | 
  32  |   private getThematicSelectFormField () {
  33  |     return this.page.getByTestId('thematic-select-form-field')
  34  |   }
  35  | 
  36  |   private getReflectionParameterToggle () {
  37  |     return this.page.getByTestId('reflection-parameter-toggle')
  38  |   }
  39  | 
  40  |   private getTraceAllowedAssociationsToggle () {
  41  |     return this.page.getByTestId('trace-allowed-associations-toggle')
  42  |   }
  43  | 
  44  |   private getFeedbackParameterToggle () {
  45  |     return this.page.getByTestId('feedback-parameter-toggle')
  46  |   }
  47  | 
  48  |   private getFirstInteractiveElement (locator: Locator) {
  49  |     return locator.locator('input, textarea, button, [role="button"], [role="switch"]').first()
  50  |   }
  51  | 
  52  |   @Given('the staff navigates to the first activity edit page')
  53  |   async navigateToEditNationalActivity () {
  54  |     const activityLocator = await this.page
  55  |       .locator('[data-testid="activity-table-title"][data-activity-status="DRAFT"], [data-testid="activity-card-title"][data-activity-status="DRAFT"]')
  56  |       .first()
  57  | 
> 58  |     await expect(activityLocator).toBeVisible()
      |                                   ^ Error: expect(locator).toBeVisible() failed
  59  | 
  60  |     const activityId = await activityLocator.getAttribute('data-activity-id')
  61  | 
  62  |     if (!activityId) {
  63  |       throw new Error('No draft activity found')
  64  |     }
  65  | 
  66  |     const url = STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY
  67  |       .replace(':id', activityId)
  68  |       .concat('?mode=add')
  69  | 
  70  |     await this.page.goto(url)
  71  |     await waitForPageLoad(this.page)
  72  |     await expect(this.page.getByTestId('activity-title-form-field')).toBeVisible()
  73  |   }
  74  | 
  75  |   @Then('the edit national activity page is displayed')
  76  |   async verifyPageLoaded () {
  77  |     const expectedPattern = STAFF_ROUTES.ACTIVITIES_EDIT_NATIONAL_ACTIVITY
  78  |       .replace(':id', '[^/]+')
  79  | 
  80  |     await expect(this.page).toHaveURL(new RegExp(expectedPattern))
  81  |   }
  82  | 
  83  |   @Then('the staff edit published activity page is displayed')
  84  |   async verifyEditPublishedActivityPageDisplayed () {
  85  |     await this.verifyPageLoaded()
  86  |     await expect(this.getActivityContentTab()).toBeVisible()
  87  |   }
  88  | 
  89  |   @Then('the editable activity content fields are enabled')
  90  |   async verifyEditableActivityContentFieldsEnabled () {
  91  |     await expect(this.getTitleFormField()).toBeVisible()
  92  | 
  93  |     await expect(this.getThematicSelectFormField()).toBeVisible()
  94  |   }
  95  | 
  96  |   @Then('the activity modalities fields are disabled')
  97  |   async verifyActivityModalitiesFieldsDisabled () {
  98  |     await expect(this.getReflectionParameterToggle()).toBeVisible()
  99  |     await expect(this.getFirstInteractiveElement(this.getReflectionParameterToggle())).toBeDisabled()
  100 | 
  101 |     await expect(this.getTraceAllowedAssociationsToggle()).toBeVisible()
  102 |     await expect(this.getFirstInteractiveElement(this.getTraceAllowedAssociationsToggle())).toBeDisabled()
  103 | 
  104 |     await expect(this.getFeedbackParameterToggle()).toBeVisible()
  105 |     await expect(this.getFirstInteractiveElement(this.getFeedbackParameterToggle())).toBeDisabled()
  106 |   }
  107 | 
  108 |   @Then('the activity modalities disabled information messages are visible')
  109 |   async verifyActivityModalitiesDisabledInformationMessagesVisible () {
  110 |     const disabledMessage = t(
  111 |       'staff.activities.views.EditNationalActivityView.informations.disabled',
  112 |     )
  113 |     await expect(this.getReflectionParameterToggle()).toContainText(disabledMessage)
  114 |     await expect(this.getTraceAllowedAssociationsToggle()).toContainText(disabledMessage)
  115 |     await expect(this.getFeedbackParameterToggle()).toContainText(disabledMessage)
  116 |   }
  117 | 
  118 |   @Then('the content tab is active by default')
  119 |   async verifyContentTabActiveByDefault () {
  120 |     await this.tabs().verifyContentTabActiveByDefault()
  121 |   }
  122 | 
  123 |   @Then('the side navigation menu is visible')
  124 |   async verifySideNavigationVisible () {
  125 |     await this.sideNav().verifyVisible()
  126 |   }
  127 | 
  128 |   @Then('the side navigation menu is expanded by default')
  129 |   async verifySideNavigationExpandedByDefault () {
  130 |     await this.sideNav().verifyExpandedByDefault()
  131 |   }
  132 | 
  133 |   @Then('the side navigation menu has content header')
  134 |   async verifySideNavigationHasContentHeader () {
  135 |     await this.sideNav().verifyHasHeader('CONTENT')
  136 |   }
  137 | 
  138 |   @Then('the side navigation menu has {string} content section')
  139 |   async verifySideNavigationHasContentSection (sectionId: string) {
  140 |     await this.sideNav().verifyHasSection('CONTENT', sectionId)
  141 |   }
  142 | 
  143 |   @Given('the staff navigates to the publication tab')
  144 |   async navigateToPublicationTab () {
  145 |     await this.tabs().clickPublicationTab()
  146 |   }
  147 | 
  148 |   @Then('the side navigation menu has publication header')
  149 |   async verifySideNavigationHasPublicationHeader () {
  150 |     await this.sideNav().verifyHasHeader('PUBLICATION')
  151 |   }
  152 | 
  153 |   @Then('the side navigation menu has {string} publication section')
  154 |   async verifySideNavigationHasPublicationSection (sectionId: string) {
  155 |     await this.sideNav().verifyHasSection('PUBLICATION', sectionId)
  156 |   }
  157 | 
  158 |   @Then('the publication tab is active')
```