# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/notifications/notifications.feature.spec.js >> Student Notifications >> Activity modified notification content >> Student sees the activity modified notification with a single updated section
- Location: .features-gen/tests/student/notifications/notifications.feature.spec.js:14:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('notifications-popover-body').getByTestId('notifications-popover-list').getByTestId('activity-modified-notification-card').first().getByTestId('activity-modified-notification-card-content')
Expected: "L'activité \"Activité \"CV\" : Construire son parcours\" a été mise à jour. "
Received: "L'activité \"Activité \"CV\" : Construire son parcours\" a été mise à jour. La section suivante a été modifiée : Titre."
Timeout:  10000ms

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for getByTestId('notifications-popover-body').getByTestId('notifications-popover-list').getByTestId('activity-modified-notification-card').first().getByTestId('activity-modified-notification-card-content')
    24 × locator resolved to <span data-testid="activity-modified-notification-card-content">…</span>
       - unexpected value "L'activité "Activité "CV" : Construire son parcours" a été mise à jour. La section suivante a été modifiée : Titre."

```

```yaml
- text: "L'activité \"Activité \"CV\" : Construire son parcours\" a été mise à jour. La section suivante a été modifiée : Titre."
```

# Test source

```ts
  1  | import type { test } from '@e2e/framework/shared/fixtures/fixtures'
  2  | import type { Page } from '@playwright/test'
  3  | import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
  4  | import { t } from '@e2e/framework/shared/utils/i18n'
  5  | import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
  6  | import { NotificationsPopover } from '@e2e/framework/student/shared/componentObjects/NotificationsPopover'
  7  | import { expect } from '@playwright/test'
  8  | import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'
  9  | 
  10 | const ACTIVITY_MODIFIED_NOTIFICATION_ACTIVITY_TITLE = 'Activité "CV" : Construire son parcours'
  11 | 
  12 | function updatedFieldLabel (fieldKey: string) {
  13 |   return t(`student.global.cards.ActivityModifiedNotificationCard.updatedFields.${fieldKey}`)
  14 | }
  15 | 
  16 | function activityModifiedNotificationContent (sectionLabels: string[]) {
  17 |   return t(
  18 |     'student.global.cards.ActivityModifiedNotificationCard.content',
  19 |     {
  20 |       activityName: ACTIVITY_MODIFIED_NOTIFICATION_ACTIVITY_TITLE,
  21 |       sectionTypes: sectionLabels.join(', '),
  22 |     },
  23 |     sectionLabels.length,
  24 |   )
  25 | }
  26 | 
  27 | export
  28 | @Fixture<typeof test>('studentNotificationsPopoverSteps')
  29 | class StudentNotificationsPopoverSteps {
  30 |   private popover: NotificationsPopover
  31 | 
  32 |   constructor (public page: Page) {
  33 |     this.popover = new NotificationsPopover(page)
  34 |   }
  35 | 
  36 |   @When('the student opens the notifications popover')
  37 |   async openNotificationsPopover () {
  38 |     await this.popover.open()
  39 |   }
  40 | 
  41 |   @Given('the student has enabled notifications')
  42 |   async enableNotifications () {
  43 |     await this.popover.enableNotificationPreference()
  44 |   }
  45 | 
  46 |   @Then('the activity modified notification with a single updated section is visible')
  47 |   async verifySingleSectionNotificationVisible () {
  48 |     await expect(this.popover.getActivityModifiedNotificationCard(0)).toBeVisible()
  49 |   }
  50 | 
  51 |   @Then('the activity modified notification with a single updated section shows the correct content')
  52 |   async verifySingleSectionNotificationContent () {
  53 |     const expectedContent = activityModifiedNotificationContent([updatedFieldLabel('ACTIVITY_TITLE')])
> 54 |     await expect(this.popover.getActivityModifiedNotificationCardContent(0)).toHaveText(expectedContent)
     |                                                                              ^ Error: expect(locator).toHaveText(expected) failed
  55 |   }
  56 | 
  57 |   @Then('the activity modified notification with multiple updated sections is visible')
  58 |   async verifyMultipleSectionsNotificationVisible () {
  59 |     await expect(this.popover.getActivityModifiedNotificationCard(1)).toBeVisible()
  60 |   }
  61 | 
  62 |   @Then('the activity modified notification with multiple updated sections shows the correct content')
  63 |   async verifyMultipleSectionsNotificationContent () {
  64 |     const expectedContent = activityModifiedNotificationContent([
  65 |       updatedFieldLabel('ACTIVITY_TITLE'),
  66 |       updatedFieldLabel('THEMATIC'),
  67 |     ])
  68 |     await expect(this.popover.getActivityModifiedNotificationCardContent(1)).toHaveText(expectedContent)
  69 |   }
  70 | 
  71 |   @When('the student clicks on the activity modified notification with a single updated section')
  72 |   async clickSingleSectionNotification () {
  73 |     await this.popover.clickActivityModifiedNotificationCard(0)
  74 |     await waitForPageLoad(this.page)
  75 |   }
  76 | 
  77 |   @Then('the student is redirected to the modified activity page')
  78 |   async verifyRedirectedToActivity () {
  79 |     await expect(this.page).toHaveURL(new RegExp(STUDENT_ROUTES.ACTIVITY.replace(':id', '.+')))
  80 |   }
  81 | }
  82 | 
```