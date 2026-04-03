import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { TracesAssociatedTab } from '@e2e/framework/student/tools/traces/componentObjects/TracesAssociatedTab'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentToolsTracesPage')
class StudentToolsTracesPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getTracesAssociatedTab () {
    return new TracesAssociatedTab(this.page)
  }

  getAssociatedTracesTabItem () {
    return this.page.getByTestId('associated-traces-tab-item')
  }

  @When('the student open associated traces tab')
  async clickAssociatedTracesTabItem () {
    await this.getAssociatedTracesTabItem().click()
  }

  @Then('the associated traces tab is visible')
  async verifyAssociatedTracesTabVisible () {
    await this.getTracesAssociatedTab().isVisible()
  }

  @When('the student clicks the first associated trace card')
  async clickFirstAssociatedTraceCard () {
    await this.getTracesAssociatedTab().clickFirstCard()
    await waitForPageLoad(this.page)
  }
}
