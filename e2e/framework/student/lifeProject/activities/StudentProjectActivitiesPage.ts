import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { PageTitle } from '@e2e/framework/shared/componentObjects/PageTitle'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { AllActivitiesTabs } from '@e2e/framework/student/lifeProject/activities/componentObjects/AllActivitiesTabs'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectActivitiesPage')
class StudentProjectActivitiesPage {
  constructor (public page: Page) {}

  getPageTitle () {
    return new PageTitle(this.page.getByTestId('page-title'))
  }

  getAllActivitiesTabs () {
    return new AllActivitiesTabs(this.page)
  }

  @Given('the student opens the project activities page')
  async goto () {
    await this.page.goto(STUDENT_ROUTES.PROJECT.ACTIVITIES)
    await waitForPageLoad(this.page)
  }

  @Then('the student project activities page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.ACTIVITIES)
  }

  @Given('the page title is visible')
  async verifyPageTitleVisible () {
    await this.getPageTitle().verifyVisible()
  }

  @Then('the page title is correct')
  async verifyPageTitleCorrect () {
    await this.getPageTitle().verifyTitle(t('student.global.views.projectActivitiesView.title'))
  }

  @Then('the show breadcrumb button is hidden')
  async verifyShowBreadcrumbButtonHidden () {
    await this.getPageTitle().verifyShowBreadcrumbButtonHidden()
  }

  @Then('the breadcrumb items are visible')
  async verifyBreadcrumbItemsVisible () {
    await this.getPageTitle().verifyBreadcrumbItemsVisible()
  }

  @Then('the breadcrumb is correct')
  async verifyBreadcrumbCorrect () {
    await this.getPageTitle().verifyBreadcrumbVisible()
    const expectedItems = [
      { text: t('student.global.navigation.tabs.home'), href: STUDENT_ROUTES.HOME },
      { text: t('student.global.navigation.tabs.project.header') },
      { text: t('student.global.navigation.tabs.project.items.activities') }
    ]
    await this.getPageTitle().verifyBreadcrumbItems(expectedItems)
  }

  @Then('the back button is correct')
  async verifyBackButtonCorrect () {
    await this.getPageTitle().verifyBackButton()
  }

  @When('the user clicks the back button')
  async clickBackButton () {
    await this.getPageTitle().clickBackButton()
    await waitForPageLoad(this.page)
  }

  @When('the user clicks the first breadcrumb link')
  async clickFirstBreadcrumbLink () {
    await this.getPageTitle().clickBreadcrumbLink(0)
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to home page')
  async verifyNavigationToHomePage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.HOME)
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

  @Given('the student project activities page is displayed on mobile viewport')
  async verifyMobileViewport () {
    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  }

  @Then('the show breadcrumb button is visible')
  async verifyShowBreadcrumbButtonVisible () {
    await this.getPageTitle().verifyShowBreadcrumbButtonVisible()
  }

  @Then('the breadcrumb items are hidden')
  async verifyBreadcrumbItemsHidden () {
    await this.getPageTitle().verifyBreadcrumbItemsHidden()
  }

  @When('the user clicks the show breadcrumb button')
  async clickShowBreadcrumbButton () {
    await this.getPageTitle().clickShowBreadcrumbButton()
    await waitForPageLoad(this.page)
  }
}
