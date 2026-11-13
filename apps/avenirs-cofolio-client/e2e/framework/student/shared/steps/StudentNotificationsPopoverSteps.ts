import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { NotificationsPopover } from '@e2e/framework/student/shared/componentObjects/NotificationsPopover'
import { expect } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

const ACTIVITY_MODIFIED_NOTIFICATION_ACTIVITY_TITLE = 'Activité "CV" : Construire son parcours'
const MODIFIED_SUB_ACTIVITY_TITLES = ['Étape 1', 'Étape 2']

function updatedFieldLabel (fieldKey: string) {
  return t(`student.global.cards.ActivityModifiedNotificationCard.updatedFields.types.${fieldKey}`)
}

function baseContent (activityName: string) {
  return t(
    'student.global.cards.ActivityModifiedNotificationCard.content',
    { activityName },
  )
}

function sectionsContent (sectionLabels: string[]) {
  return t(
    'student.global.cards.ActivityModifiedNotificationCard.updatedFields.content',
    { sectionTypes: sectionLabels.join(', ') },
    sectionLabels.length,
  )
}

function subActivitiesContent (titles: string[]) {
  return t(
    'student.global.cards.ActivityModifiedNotificationCard.updatedSubActivityTitles.content',
    { subActivitiesTitles: titles.join(', ') },
    titles.length,
  )
}

function activityModifiedNotificationContent (detail: string) {
  return baseContent(ACTIVITY_MODIFIED_NOTIFICATION_ACTIVITY_TITLE) + detail
}

export
@Fixture<typeof test>('studentNotificationsPopoverSteps')
class StudentNotificationsPopoverSteps {
  private popover: NotificationsPopover

  constructor (public page: Page) {
    this.popover = new NotificationsPopover(page)
  }

  @When('the student opens the notifications popover')
  async openNotificationsPopover () {
    await this.popover.open()
  }

  @Given('the student has enabled notifications')
  async enableNotifications () {
    await this.popover.enableNotificationPreference()
  }

  @Then('the activity modified notification with a single updated section is visible')
  async verifySingleSectionNotificationVisible () {
    await expect(this.popover.getActivityModifiedNotificationCard(0)).toBeVisible()
  }

  @Then('the activity modified notification with a single updated section shows the correct content')
  async verifySingleSectionNotificationContent () {
    const expectedContent = activityModifiedNotificationContent(sectionsContent([updatedFieldLabel('ACTIVITY_TITLE')]))
    await expect(this.popover.getActivityModifiedNotificationCardContent(0)).toHaveText(expectedContent)
  }

  @Then('the activity modified notification with multiple updated sections is visible')
  async verifyMultipleSectionsNotificationVisible () {
    await expect(this.popover.getActivityModifiedNotificationCard(1)).toBeVisible()
  }

  @Then('the activity modified notification with multiple updated sections shows the correct content')
  async verifyMultipleSectionsNotificationContent () {
    const expectedContent = activityModifiedNotificationContent(sectionsContent([
      updatedFieldLabel('ACTIVITY_TITLE'),
      updatedFieldLabel('THEMATIC'),
    ]))
    await expect(this.popover.getActivityModifiedNotificationCardContent(1)).toHaveText(expectedContent)
  }

  @Then('the activity modified notification for a single modified sub-activity is visible')
  async verifySingleSubActivityNotificationVisible () {
    await expect(this.popover.getActivityModifiedNotificationCard(2)).toBeVisible()
  }

  @Then('the activity modified notification for a single modified sub-activity shows the correct content')
  async verifySingleSubActivityNotificationContent () {
    const expectedContent = activityModifiedNotificationContent(subActivitiesContent([MODIFIED_SUB_ACTIVITY_TITLES[0]]))
    await expect(this.popover.getActivityModifiedNotificationCardContent(2)).toHaveText(expectedContent)
  }

  @Then('the activity modified notification for multiple modified sub-activities is visible')
  async verifyMultipleSubActivitiesNotificationVisible () {
    await expect(this.popover.getActivityModifiedNotificationCard(3)).toBeVisible()
  }

  @Then('the activity modified notification for multiple modified sub-activities shows the correct content')
  async verifyMultipleSubActivitiesNotificationContent () {
    const expectedContent = activityModifiedNotificationContent(subActivitiesContent(MODIFIED_SUB_ACTIVITY_TITLES))
    await expect(this.popover.getActivityModifiedNotificationCardContent(3)).toHaveText(expectedContent)
  }

  @When('the student clicks on the activity modified notification with a single updated section')
  async clickSingleSectionNotification () {
    await this.popover.clickActivityModifiedNotificationCard(0)
    await waitForPageLoad(this.page)
  }

  @Then('the student is redirected to the modified activity page')
  async verifyRedirectedToActivity () {
    await expect(this.page).toHaveURL(new RegExp(STUDENT_ROUTES.ACTIVITY.replace(':id', '.+')))
  }
}
