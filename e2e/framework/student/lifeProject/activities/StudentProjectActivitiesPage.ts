import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { ActivityLibraryTab } from '@e2e/framework/student/lifeProject/activities/componentObjects/ActivityLibraryTab'
import { AllActivitiesTabs } from '@e2e/framework/student/lifeProject/activities/componentObjects/AllActivitiesTabs'
import { expect, type Page } from '@playwright/test'
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
    return this.page.getByRole('tablist').locator('li').nth(1)
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

  @Given('the student project activities page is displayed on mobile viewport')
  async verifyMobileViewport () {
    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  }

  /**
   * *********************************************************************
   * Activity library tab
   **********************************************************************
   */

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

  @Then('the activity library pagination is not visible')
  async verifyActivityLibraryPaginationNotVisible () {
    await this.getActivityLibraryTab().verifyPaginationNotVisible()
  }

  @Then('the library activity tab is visible')
  async verifyActivityLibraryTabVisible () {
    await this.getActivityLibraryTab().isVisible()
  }

  @Then('library activity tab title is correct with a count of {int} activities')
  async verifyActivityLibraryTitle (count: number) {
    await this.getActivityLibraryTab().verifyTitle(count)
  }

  @Then('library activity tab title is correct with a count')
  async verifyActivityLibraryTitleWithCount () {
    await this.getActivityLibraryTab().verifyTitleWithCount()
  }

  @Then('the list of activity library elements is visible')
  async verifyActivityLibraryCardListVisible () {
    await this.getActivityLibraryTab().verifyCardListVisible()
  }

  @Then('the first page of activity library elements contain {int} elements')
  async verifyActivityLibraryFirstPageCount (count: number) {
    await this.getActivityLibraryTab().verifyCardCount(count)
  }

  @Then('the first activity card title is {string}')
  async verifyFirstActivityCardTitle (expectedTitle: string) {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyTitle(expectedTitle)
  }

  @Then('the first activity card title is visible')
  async verifyFirstActivityCardTitleVisible () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyTitleVisible()
  }

  @Then('the first activity card thematic badge is {string}')
  async verifyFirstActivityCardThematicBadge (expectedThematic: string) {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyThematicBadge(expectedThematic)
  }

  @Then('the first activity card thematic badge is valid')
  async verifyFirstActivityCardThematicBadgeValid () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyThematicBadgeValid()
  }

  @Then('the first activity card status badge is {string}')
  async verifyFirstActivityCardStatusBadge (expectedStatus: string) {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyStatusBadge(expectedStatus)
  }

  @Then('the first activity card status badge is valid')
  async verifyFirstActivityCardStatusBadgeValid () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyStatusBadgeValid()
  }

  @Then('the first activity card has no period badge')
  async verifyFirstActivityCardNoPeriodBadge () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyNoPeriodBadge()
  }

  @Then('the first activity card has a period badge')
  async verifyFirstActivityCardPeriodBadge () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifyPeriodBadge()
  }

  @Then('the first activity card description contain {string}')
  async verifyFirstActivityCardDescription (expectedDescription: string) {
    await this.getActivityLibraryTab().getCardByIndex(0).verifySummary(expectedDescription)
  }

  @Then('the first activity card description is visible')
  async verifyFirstActivityCardDescriptionVisible () {
    await this.getActivityLibraryTab().getCardByIndex(0).verifySummaryVisible()
  }

  @Then('the last activity card title is {string}')
  async verifyLastActivityCardTitle (expectedTitle: string) {
    await this.getActivityLibraryTab().getLastCard().verifyTitle(expectedTitle)
  }

  @Then('the last activity card title is visible')
  async verifyLastActivityCardTitleVisible () {
    await this.getActivityLibraryTab().getLastCard().verifyTitleVisible()
  }

  @Then('the last activity card thematic badge is {string}')
  async verifyLastActivityCardThematicBadge (expectedThematic: string) {
    await this.getActivityLibraryTab().getLastCard().verifyThematicBadge(expectedThematic)
  }

  @Then('the last activity card status badge is {string}')
  async verifyLastActivityCardStatusBadge (expectedStatus: string) {
    await this.getActivityLibraryTab().getLastCard().verifyStatusBadge(expectedStatus)
  }

  @Then('the last activity card has no period badge')
  async verifyLastActivityCardNoPeriodBadge () {
    await this.getActivityLibraryTab().getLastCard().verifyNoPeriodBadge()
  }

  @Then('the last activity card has a period badge')
  async verifyLastActivityCardPeriodBadge () {
    await this.getActivityLibraryTab().getLastCard().verifyPeriodBadge()
  }

  @Then('the last activity card description contain {string}')
  async verifyLastActivityCardDescription (expectedDescription: string) {
    await this.getActivityLibraryTab().getLastCard().verifySummary(expectedDescription)
  }

  @Then('the activity library page contains elements')
  async verifyActivityLibraryPageNotEmpty () {
    await this.getActivityLibraryTab().verifyCardsNotEmpty()
  }

  @Then('the first activity card spans full width')
  async verifyFirstActivityCardFullWidth () {
    await this.verifyLocatorIsFullWidth(this.getActivityLibraryTab().getCards().first())
  }
}
