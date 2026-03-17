import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { StudentProjectActivitiesCatalogPage } from '@e2e/framework/student/lifeProject/activitiesCatalog/StudentProjectActivitiesCatalog'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { ActivityLibraryTab } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityLibraryTab'
import { AllActivitiesTabs } from '@e2e/framework/student/lifeProject/activities/componentObjects/AllActivitiesTabs'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectActivitiesPage')
class StudentProjectActivitiesPage extends BasePage {
  private unsubscribedActivityId?: string = undefined
  private unsubscribedActivityThematic?: string = undefined

  constructor (public page: Page) {
    super(page)
  }

  getAllActivitiesTabs () {
    return new AllActivitiesTabs(this.page)
  }

  getActivityLibraryTab () {
    return new ActivityLibraryTab(this.page)
  }

  getActivityLibraryTabItem () {
    return this.page.getByTestId('activity-library-tab-item')
  }

  async restoreActivitySubscription (catalogPage: StudentProjectActivitiesCatalogPage) {
    if (!this.unsubscribedActivityId || !this.unsubscribedActivityThematic) {
      return
    }
    await catalogPage.subscribeActivityById(this.unsubscribedActivityThematic, this.unsubscribedActivityId)
  }

  @Given('the all activities tab is visible')
  async verifyAllActivitiesTabVisible () {
    await this.getAllActivitiesTabs().verifyVisible()
  }

  @Then('the all activities tab header description is correct')
  async verifyAllActivitiesTabHeaderDescription () {
    await this.getAllActivitiesTabs().verifyHeaderDescription()
  }

  @Then('the all activities tab see all button is correct')
  async verifyAllActivitiesTabSeeAllButton () {
    await this.getAllActivitiesTabs().verifySeeAllButton()
  }

  @Then('the all activities tab new activities paginator card is correct')
  async verifyAllActivitiesTabNewActivitiesPaginatorCard () {
    await this.getAllActivitiesTabs().verifyNewActivitiesPaginatorCard()
  }

  @Then('the all activities tab all activities section is correct')
  async verifyAllActivitiesTabAllActivitiesSection () {
    await this.getAllActivitiesTabs().verifyAllActivitiesSection()
  }

  @When('the student open activity library tab')
  async clickActivityLibraryTabItem () {
    await this.getActivityLibraryTabItem().click()
  }

  @Then('the activity library empty state is visible')
  async verifyActivityLibraryEmptyStateVisible () {
    await this.getActivityLibraryTab().verifyEmptyStateVisible()
  }

  @Then('the activity library empty state message is correct')
  async verifyActivityLibraryEmptyStateMessage () {
    await this.getActivityLibraryTab().verifyEmptyStateMessage()
  }

  @Then('the activity library pagination is hidden')
  async verifyActivityLibraryPaginationHidden () {
    await this.getActivityLibraryTab().getPagination().isHidden()
  }

  @Then('the library activity tab is visible')
  async verifyActivityLibraryTabVisible () {
    await this.getActivityLibraryTab().isVisible()
  }

  @Then('library activity tab title is visible with positive count')
  async verifyActivityLibraryTitleWithPositiveCount () {
    await this.getActivityLibraryTab().verifyTitleWithPositiveCount()
  }

  @Then('the list of activity library elements is visible')
  async verifyActivityLibraryCardListVisible () {
    await this.getActivityLibraryTab().verifyCardListVisible()
  }

  @Then('the first page of activity does not exceed the selected page size')
  async verifyFirstPageCardsDoNotExceedPageSize () {
    await this.getActivityLibraryTab().verifyCardCountNotExceedsPageSize()
  }

  @Then('the first page of activity contains less than {int} activities')
  async verifyFirstPageCardsLessThan (maxCount: number) {
    await this.getActivityLibraryTab().verifyCardCountLessThan(maxCount)
  }

  @Then('the first activity card title is visible')
  async verifyFirstActivityCardTitleVisible () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyTitleVisible()
  }

  @Then('the first activity card thematic badge is visible')
  async verifyFirstActivityCardThematicBadgeVisible () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyThematicBadgeVisible()
  }

  @Then('the first activity card status badge is visible')
  async verifyFirstActivityCardStatusBadgeVisible () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyStatusBadgeVisible()
  }

  @Then('the first activity card description is visible')
  async verifyFirstActivityCardDescriptionVisible () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifySummaryVisible()
  }

  @Then('the first activity card description is hidden')
  async verifyFirstActivityCardDescriptionHidden () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifySummaryHidden()
  }

  @Then('the first activity card status badge is hidden')
  async verifyFirstActivityCardStatusBadgeHidden () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyStatusBadgeHidden()
  }

  @Then('the first activity card period badge is hidden')
  async verifyFirstActivityCardPeriodBadgeHidden () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyPeriodBadgeHidden()
  }

  @Then('the first activity card spans full width')
  async verifyFirstActivityCardFullWidth () {
    await this.verifyLocatorIsFullWidth(this.getActivityLibraryTab().getCards().first())
  }

  @Then('the activity library page contains elements')
  async verifyActivityLibraryPageNotEmpty () {
    await this.getActivityLibraryTab().verifyCardsNotEmpty()
  }

  @When('the user opens the unsubscribe activities modal')
  async openUnsubscribeActivitiesModal () {
    this.unsubscribedActivityId = await this.getActivityLibraryTab().getCardByIndex(0).getActivityId()
    this.unsubscribedActivityThematic = await this.getActivityLibraryTab().getCardByIndex(0).getActivityThematic()
    await this.getActivityLibraryTab().getDropdown().clickUnsubscribe()
  }

  @When('the user selects the last activity in the unsubscribe modal')
  async selectFirstActivityInUnsubscribeModal () {
    const modal = this.getActivityLibraryTab().getUnsubscribeModal()

    this.unsubscribedActivityId = await modal.getLastActivityId()
    this.unsubscribedActivityThematic = await modal.getLastActivityThematic()

    await modal.selectLastActivityItem()
  }

  @When('the user confirms the unsubscription')
  async confirmUnsubscription () {
    await this.getActivityLibraryTab().getUnsubscribeModal().clickConfirm()
  }

  @Then('unsubscription confirmation modal is visible')
  async verifyUnsubscribeSuccessMessageVisible () {
    await this.getActivityLibraryTab().getUnsubscribeModal().getConfirmModal().verifyVisible()
  }

  @When('the student clicks the first library activity card')
  async clickFirstLibraryActivityCard () {
    await this.getActivityLibraryTab().clickFirstCard()
    await this.page.waitForURL(new RegExp(STUDENT_ROUTES.PROJECT.ACTIVITY_DETAIL.replace(':id', '.+')))
  }

  @Then('the first new activity card title is visible')
  async verifyFirstNewActivityCardTitleVisible () {
    await this.getAllActivitiesTabs().getNewCardByIndex(0).verifyTitleVisible()
  }

  @Then('the first new activity card thematic badge is visible')
  async verifyFirstNewActivityCardThematicBadgeVisible () {
    await this.getAllActivitiesTabs().getNewCardByIndex(0).verifyThematicBadgeVisible()
  }

  @Then('the first new activity card description is visible')
  async verifyFirstNewActivityCardDescriptionVisible () {
    await this.getAllActivitiesTabs().getNewCardByIndex(0).verifySummaryVisible()
  }

  @Then('the first all activity card title is visible')
  async verifyFirstAllActivityCardTitleVisible () {
    await this.getAllActivitiesTabs().getAllCardByIndex(0).verifyTitleVisible()
  }

  @Then('the first all activity card thematic badge is visible')
  async verifyFirstAllActivityCardThematicBadgeVisible () {
    await this.getAllActivitiesTabs().getAllCardByIndex(0).verifyThematicBadgeVisible()
  }

  @Then('the first all activity card description is visible')
  async verifyFirstAllActivityCardDescriptionVisible () {
    await this.getAllActivitiesTabs().getAllCardByIndex(0).verifySummaryVisible()
  }

  @When('the student clicks a library activity card with not in progress status')
  async clickLibraryActivityCardWithNotInProgressStatus () {
    await this.getActivityLibraryTab().clickCardWithNotInProgressStatus()
    await this.page.waitForURL(new RegExp(STUDENT_ROUTES.PROJECT.ACTIVITY_DETAIL.replace(':id', '.+')))
  }

  @When('the student clicks a library activity card with in progress status')
  async clickLibraryActivityCardWithInProgressStatus () {
    await this.getActivityLibraryTab().clickCardWithInProgressStatus()
    await this.page.waitForURL(new RegExp(STUDENT_ROUTES.PROJECT.ACTIVITY_DETAIL.replace(':id', '.+')))
  }
}
