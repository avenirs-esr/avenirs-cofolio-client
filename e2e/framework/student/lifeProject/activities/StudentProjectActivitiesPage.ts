import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { AllActivitiesTabs } from '@e2e/framework/student/lifeProject/activities/componentObjects/AllActivitiesTabs'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectActivitiesPage')
class StudentProjectActivitiesPage {
  constructor (public page: Page) {}

  getAllActivitiesTabs () {
    return new AllActivitiesTabs(this.page)
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
}
