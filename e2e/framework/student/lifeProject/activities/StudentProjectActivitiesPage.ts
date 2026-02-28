import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { ActivityLibraryTab } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityLibraryTab'
import { AllActivitiesTabs } from '@e2e/framework/student/lifeProject/activities/componentObjects/AllActivitiesTabs'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectActivitiesPage')
class StudentProjectActivitiesPage extends BasePage {
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
}
