import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { EActivityThematic } from '@cofolio/api/avenir-esr/generated/types/eActivityThematic'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { ActivitiesPreviousNextNavigation } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/ActivitiesPreviousNextNavigation'
import { ActivitiesSelectNavigation } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/ActivitiesSelectNavigation'
import { ActivitiesSideNavigation } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/ActivitiesSideNavigation'
import { ActivityPreview } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/ActivityPreview'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectActivitiesCatalogPage')
class StudentProjectActivitiesCatalogPage {
  private selectedThematic?: string
  private selectedActivityId?: string

  private static readonly DEFAULT_THEMATIC = EActivityThematic.SELF_KNOWLEDGE
  private static readonly DEFAULT_ACTIVITY_ID = '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1'

  constructor (public page: Page) {}

  // -------------------------------------------------------------------------
  // Locators
  // -------------------------------------------------------------------------

  private sideNav () { return new ActivitiesSideNavigation(this.page) }
  private selectNav () { return new ActivitiesSelectNavigation(this.page) }
  private previousNextNav () { return new ActivitiesPreviousNextNavigation(this.page) }
  private activityPreview () { return new ActivityPreview(this.page) }

  // -------------------------------------------------------------------------
  // Fixtures
  // -------------------------------------------------------------------------

  private buildCatalogUrl (thematic: string, id: string) {
    return STUDENT_ROUTES.PROJECT.ACTIVITIES_CATALOG
      .replace(':thematic', thematic)
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

  async subscribeActivityById (thematic: string, id: string) {
    const url = this.buildCatalogUrl(thematic, id)
    await this.page.goto(url)
    await this.subscribeToCurrentActivity()
  }

  async subscribeToCurrentActivity () {
    await this.activityPreview().verifySubscribeButton()
    await this.activityPreview().getSubscribeButton().click()
    await this.activityPreview().clickSubscribeModalConfirmButton()
  }

  async unsubscribeFromDefaultActivity () {
    const url = this.buildCatalogUrl(
      StudentProjectActivitiesCatalogPage.DEFAULT_THEMATIC,
      StudentProjectActivitiesCatalogPage.DEFAULT_ACTIVITY_ID,
    )
    await this.page.goto(url)
    await this.unsubscribeFromCurrentActivity()
  }

  async unsubscribeFromCurrentActivity () {
    await this.activityPreview().verifyUnsubscribeButton()
    await this.activityPreview().clickUnsubscribeButton()
    await this.activityPreview().clickUnsubscribeActivitiesConfirmModalConfirmButton()
  }

  // -------------------------------------------------------------------------
  // Steps
  // -------------------------------------------------------------------------

  @Given('the student opens the project activities catalog page')
  async openCatalogPage () {
    const url = this.buildCatalogUrl(
      StudentProjectActivitiesCatalogPage.DEFAULT_THEMATIC,
      StudentProjectActivitiesCatalogPage.DEFAULT_ACTIVITY_ID,
    )
    await this.page.goto(url)
    this.captureSelectedParamsFromUrl()
  }

  @Given('the student project activities catalog page is displayed on mobile viewport')
  async openCatalogPageMobile () {
    await this.page.setViewportSize({ width: 375, height: 812 })

    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)

    const url = this.buildCatalogUrl(
      StudentProjectActivitiesCatalogPage.DEFAULT_THEMATIC,
      StudentProjectActivitiesCatalogPage.DEFAULT_ACTIVITY_ID,
    )
    await this.page.goto(url)
    this.captureSelectedParamsFromUrl()
  }

  @Then('the URL does not contain the {string} thematic')
  async verifyUrlDoesNotContainThematic (thematic: string) {
    const url = this.page.url()
    expect(url).not.toContain(thematic)
  }

  @Then('the URL contains the selected activity and {string} thematic')
  async verifyUrlContainsSelectedActivityAndThematic (thematic: string) {
    expect(this.selectedThematic, 'Expected a selected thematic to be captured from the URL').toBeTruthy()
    expect(this.selectedActivityId, 'Expected a selected activity id to be captured from the URL').toBeTruthy()

    const url = this.page.url()

    expect(url).toContain(this.selectedActivityId!)
    expect(url).toContain(thematic)
    expect(this.selectedThematic).toBe(thematic)
  }

  @Then('the activities side navigation is visible')
  async verifySideNavigationVisible () {
    await this.sideNav().verifyVisible()
  }

  @Then('the activities select navigation is hidden')
  async verifySelectNavigationHidden () {
    await this.selectNav().verifyHidden()
  }

  @Then('the activities previous next navigation is visible')
  async verifyPreviousNextNavigationVisible () {
    await this.previousNextNav().verifyVisible()
  }

  @Then('the activities previous next navigation is hidden')
  async verifyPreviousNextNavigationHidden () {
    await this.previousNextNav().verifyHidden()
  }

  @Then('activities side navigation has thematics')
  async verifySideNavigationHasThematics () {
    await this.sideNav().verifyHasThematics()
  }

  @Then('all expected thematics are displayed in side navigation')
  async verifyAllExpectedThematicsInSideNav () {
    await this.sideNav().verifyAllExpectedThematics(Object.values(EActivityThematic))
  }

  @When('the user selects the first activity of the {string} thematic from side navigation')
  async selectFirstActivityOfFirstThematicFromSideNav (thematic: string) {
    await this.sideNav().selectFirstChildOfThematic(thematic)
    this.captureSelectedParamsFromUrl()
  }

  @When('the user selects the last activity of the {string} thematic from side navigation')
  async selectLastActivityOfFirstThematicFromSideNav (thematic: string) {
    const beforeUrl = this.page.url()

    await this.sideNav().selectLastChildOfThematic(thematic)

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @When('the user selects the second activity of the {string} thematic from side navigation')
  async selectSecondActivityOfFirstThematicFromSideNav (thematic: string) {
    const beforeUrl = this.page.url()

    await this.sideNav().selectSecondChildOfThematic(thematic)

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @Then('the first thematic in side navigation is {string}')
  async verifyFirstThematicInSideNav (thematic: string) {
    await this.sideNav().verifyFirstThematicIs(thematic)
  }

  @Then('the first thematic in side navigation has at least 1 activity')
  async verifyFirstThematicHasActivityInSideNav () {
    await this.sideNav().verifyFirstThematicHasAtLeastOneActivity()
  }

  @Then('the first thematic in side navigation first activity is {string}')
  async verifyFirstThematicFirstActivityInSideNav (title: string) {
    await this.sideNav().verifyFirstActivityTitleOfFirstThematic(title)
  }

  @Then('the first thematic in side navigation last activity is {string}')
  async verifyFirstThematicLastActivityInSideNav (title: string) {
    await this.sideNav().verifyLastActivityTitleOfFirstThematic(title)
  }

  @Then('the activities select navigation is visible')
  async verifySelectNavigationVisible () {
    await this.selectNav().verifyVisible()
  }

  @Then('the activities side navigation is hidden')
  async verifySideNavigationHidden () {
    await this.sideNav().verifyHidden()
  }

  @Then('activities select navigation has thematics')
  async verifySelectNavigationHasThematics () {
    await this.selectNav().verifyHasThematics()
  }

  @Then('all expected thematics are displayed in select navigation')
  async verifyAllExpectedThematicsInSelectNav () {
    await this.selectNav().verifyAllExpectedThematics(Object.values(EActivityThematic))
  }

  @When('the user clicks on the previous activity button')
  async clickPreviousActivityButton () {
    const beforeUrl = this.page.url()

    await this.previousNextNav().previousButtonClick()

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @When('the user clicks on the next activity button')
  async clickNextActivityButton () {
    const beforeUrl = this.page.url()

    await this.previousNextNav().nextButtonClick()

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @When('the user selects the second activity of the {string} thematic from select navigation')
  async selectSecondActivityFromSelectNavigation (thematic: string) {
    const beforeUrl = this.page.url()

    await this.selectNav().selectSecondActivityOfThematic(thematic)

    await this.expectUrlToChange(beforeUrl)
    this.captureSelectedParamsFromUrl()
  }

  @Then('the first thematic in select navigation is {string}')
  async verifyFirstThematicInSelectNav (thematic: string) {
    await this.selectNav().verifyFirstThematicIs(thematic)
  }

  @Then('the first thematic in select navigation has at least 1 activity')
  async verifyFirstThematicHasActivityInSelectNav () {
    await this.selectNav().verifyFirstThematicHasAtLeastOneActivity()
  }

  @Then('the first thematic in select navigation first activity is {string}')
  async verifyFirstThematicFirstActivityInSelectNav (title: string) {
    await this.selectNav().verifyFirstActivityTitleOfFirstThematic(title)
  }

  @Then('the first thematic in select navigation last activity is {string}')
  async verifyFirstThematicLastActivityInSelectNav (title: string) {
    await this.selectNav().verifyLastActivityTitleOfFirstThematic(title)
  }

  @Then('the activity preview is visible')
  async verifyActivityPreviewVisible () {
    await this.activityPreview().verifyVisible()
  }

  @Then('the activity preview is correctly displayed')
  async verifyActivityPreviewCorrectlyDisplayed () {
    await this.activityPreview().verify()
  }

  @Then('the activity preview subscribe button is visible')
  async verifyActivityPreviewSubscribeButtonVisible () {
    await this.activityPreview().verifySubscribeButton()
  }

  @When('the user clicks on the activity preview subscribe button')
  async clickActivityPreviewSubscribeButton () {
    await this.activityPreview().clickSubscribeButton()
  }

  @Then('the subscribe activity modal is displayed')
  async verifySubscribeActivityModal () {
    await this.activityPreview().verifySubscribeActivityModal()
  }

  @When('the user clicks on the activity preview subscribe modal confirm button')
  async clickSubscribeModalConfirmButton () {
    await this.activityPreview().clickSubscribeModalConfirmButton()
  }

  @When('the user clicks on the activity preview subscribe modal cancel button')
  async clickSubscribeModalCancelButton () {
    await this.activityPreview().clickSubscribeModalCancelButton()
  }

  @Then('the cancel subscribe activity confirm modal is displayed')
  async verifyCancelSubscribeActivityConfirmModal () {
    await this.activityPreview().verifyCancelSubscribeActivityConfirmModal()
  }

  @Then('the cancel subscribe activity confirm modal is hidden')
  async verifyCancelSubscribeActivityConfirmModalHidden () {
    await this.activityPreview().verifyCancelSubscribeActivityConfirmModalHidden()
  }

  @When('the user clicks on the activity preview subscribe modal cancel button and confirms')
  async clickSubscribeModalCancelButtonAndConfirm () {
    await this.activityPreview().clickSubscribeModalCancelButtonAndConfirm()
  }

  @When('the user clicks on the activity preview subscribe modal cancel button and cancels')
  async clickSubscribeModalCancelButtonAndCancel () {
    await this.activityPreview().clickSubscribeModalCancelButtonAndCancel()
  }

  @Then('the subscribe activity modal is hidden')
  async verifySubscribeActivityModalHidden () {
    await this.activityPreview().verifySubscribeActivityModalHidden()
  }

  @Then('the activity preview subscribe button is hidden')
  async verifyActivityPreviewSubscribeButtonHidden () {
    await this.activityPreview().verifySubscribeButtonHidden()
  }

  @Then('the activity preview unsubscribe button is visible')
  async verifyActivityPreviewUnsubscribeButtonVisible () {
    await this.activityPreview().verifyUnsubscribeButton()
  }

  @When('the user clicks on the activity preview unsubscribe button')
  async clickActivityPreviewUnsubscribeButton () {
    await this.activityPreview().clickUnsubscribeButton()
  }

  @Then('the unsubscribe activities confirm modal is displayed')
  async verifyUnsubscribeActivitiesConfirmModal () {
    await this.activityPreview().verifyUnsubscribeActivitiesConfirmModal()
  }

  @When('the user clicks on the activity preview unsubscribe activities confirm modal confirm button')
  async clickUnsubscribeActivitiesConfirmModalConfirmButton () {
    await this.activityPreview().clickUnsubscribeActivitiesConfirmModalConfirmButton()
  }

  @Then('the activity preview unsubscribe activities confirm modal is hidden')
  async verifyUnsubscribeActivitiesConfirmModalHidden () {
    const unsubscribeActivitiesConfirmModal = this.activityPreview().getUnsubscribeActivitiesConfirmModal()
    await unsubscribeActivitiesConfirmModal.verifyHidden()
  }

  @Then('the activity preview unsubscribe button is hidden')
  async verifyActivityPreviewUnsubscribeButtonHidden () {
    await this.activityPreview().verifyUnsubscribeButtonHidden()
  }

  @Then('the activity preview access button is hidden')
  async verifyActivityPreviewAccessButtonHidden () {
    await this.activityPreview().verifyAccessButtonHidden()
  }

  @Then('the activity preview access button is visible')
  async verifyActivityPreviewAccessButtonVisible () {
    await this.activityPreview().verifyAccessButtonVisible()
  }

  @When('the user clicks on the activity preview access button')
  async clickActivityPreviewAccessButton () {
    await this.activityPreview().clickAccessButton()
  }

  @Then('the student is redirected to the activity detailed page')
  async verifyRedirectedToActivityDetailedPage () {
    expect(this.selectedActivityId, 'Expected a selected activity id to be captured from the URL').toBeTruthy()
    expect(this.selectedThematic, 'Expected a selected thematic to be captured from the URL').toBeTruthy()

    const expectedUrl = STUDENT_ROUTES.PROJECT.ACTIVITY_DETAIL.replace(':id', this.selectedActivityId!)

    await expect.poll(() => this.page.url()).toContain(expectedUrl)
  }
}
