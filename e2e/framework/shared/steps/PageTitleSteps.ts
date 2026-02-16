import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { PageTitle } from '@e2e/framework/shared/componentObjects/PageTitle'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

const configs: Record<string, { title: string, breadcrumbItems: Array<{ text: string, href?: string }> }> = {
  [STUDENT_ROUTES.PROJECT.ACTIVITIES]: {
    title: t('student.buildProject.views.projectActivitiesView.title'),
    breadcrumbItems: [
      { text: t('student.global.navigation.tabs.home'), href: STUDENT_ROUTES.HOME },
      { text: t('student.global.navigation.tabs.project.header') },
      { text: t('student.global.navigation.tabs.project.items.activities') }
    ]
  },
}

export
@Fixture<typeof test>('pageTitleSteps')
class PageTitleSteps {
  constructor (public page: Page) {}

  getPageTitle () {
    return new PageTitle(this.page.getByTestId('page-title'))
  }

  private getCurrentPageConfig () {
    const url = this.page.url()

    const entry = Object.entries(configs).find(([route]) => url.includes(route))
    if (!entry) {
      throw new Error(`No page title config found for URL: ${url}`)
    }
    return entry[1]
  }

  @Given('the page title is visible')
  async verifyPageTitleVisible () {
    await this.getPageTitle().verifyVisible()
  }

  @Then('the page title is correct')
  async verifyPageTitleCorrect () {
    const config = this.getCurrentPageConfig()
    await this.getPageTitle().verifyTitle(config.title)
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
    const config = this.getCurrentPageConfig()
    await this.getPageTitle().verifyBreadcrumbItems(config.breadcrumbItems)
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
