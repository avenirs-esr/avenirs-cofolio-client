import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { ActivitiesSelectNavigation } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/ActivitiesSelectNavigation'
import { ActivitiesSideNavigation } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/ActivitiesSideNavigation'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectActivitiesCatalogPage')
class StudentProjectActivitiesCatalogPage {
  private selectedThematic?: string
  private selectedActivityId?: string

  constructor (public page: Page) {}

  private sideNav () { return new ActivitiesSideNavigation(this.page) }
  private selectNav () { return new ActivitiesSelectNavigation(this.page) }

  private buildCatalogUrl (theme: string, id: string) {
    return STUDENT_ROUTES.PROJECT.ACTIVITIES_CATALOG
      .replace(':theme', theme)
      .replace(':id', id)
  }

  private captureSelectedParamsFromUrl () {
    const url = new URL(this.page.url())
    const parts = url.pathname.split('/').filter(Boolean)
    this.selectedActivityId = parts.at(-1) ?? undefined
    this.selectedThematic = parts.at(-2) ?? undefined
  }

  private async expectUrlToChange (beforeUrl: string) {
    await expect.poll(() => this.page.url()).not.toBe(beforeUrl)
  }

  @Given('the student opens the project activities catalog page')
  async openCatalogPage () {
    const url = this.buildCatalogUrl(
      'SELF_KNOWLEDGE',
      '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
    )
    await this.page.goto(url)
  }

  @Given('the student project activities catalog page is displayed on mobile viewport')
  async openCatalogPageMobile () {
    await this.page.setViewportSize({ width: 375, height: 812 })

    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)

    const url = this.buildCatalogUrl(
      'SELF_KNOWLEDGE',
      '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
    )
    await this.page.goto(url)
  }

  @Then('the activities side navigation is visible')
  async verifySideNavigationVisible () {
    await this.sideNav().verifyVisible()
  }

  @Then('activities side navigation has thematics')
  async verifySideNavigationHasThematics () {
    await this.sideNav().verifyHasThematics()
  }

  @When('the user selects the second activity of the first thematic from side navigation')
  async selectSecondActivityOfFirstThematicFromSideNav () {
    const beforeUrl = this.page.url()

    await this.sideNav().selectSecondChildOfFirstParent()

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @Then('the activities select navigation is visible')
  async verifySelectNavigationVisible () {
    await this.selectNav().verifyVisible()
  }

  @Then('activities select navigation has thematics')
  async verifySelectNavigationHasThematics () {
    await this.selectNav().verifyHasThematics()
  }

  @When('the user selects the second activity from select navigation')
  async selectSecondActivityFromSelectNavigation () {
    const beforeUrl = this.page.url()

    await this.selectNav().selectDifferentOptionPreferSecond()

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @Then('the URL contains the selected activity and thematic')
  async verifyUrlContainsSelectedActivityAndThematic () {
    expect(this.selectedThematic, 'Expected a selected thematic to be captured from the URL').toBeTruthy()
    expect(this.selectedActivityId, 'Expected a selected activity id to be captured from the URL').toBeTruthy()

    const url = this.page.url()
    expect(url).toContain(this.selectedThematic!)
    expect(url).toContain(this.selectedActivityId!)
  }
}
