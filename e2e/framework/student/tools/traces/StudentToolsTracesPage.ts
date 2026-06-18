import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { TracesAssociatedTab } from '@e2e/framework/student/tools/traces/componentObjects/TracesAssociatedTab'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentToolsTracesPage')
class StudentToolsTracesPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getAddTraceButton () {
    return this.page.getByTestId('add-trace-button')
  }

  getAddTraceDrawerContent () {
    return this.page.getByTestId('add-trace-drawer-content')
  }

  getDeclarationAccordion () {
    return this.page.getByTestId('declaration-accordion')
  }

  getDeclarationAccordionTrigger () {
    return this.getDeclarationAccordion().getByTestId('av-accordion-trigger')
  }

  getTraceAuthorTypeRadioSet () {
    return this.page.getByTestId('trace-author-type-radio-set')
  }

  getTraceAuthorTypeRadioButtons () {
    return this.getTraceAuthorTypeRadioSet().getByTestId('trace-author-type-radio-button')
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

  @Given('the student clicks the add trace button')
  async clickAddTraceButton () {
    await clickOnElement(this.getAddTraceButton())
  }

  @Then('the add trace drawer content is visible')
  async verifyAddTraceDrawerDisplayed () {
    await this.getAddTraceDrawerContent().isVisible()
  }

  @Then('the declaration accordion is visible')
  async verifyDeclarationAccordionVisible () {
    await this.getDeclarationAccordion().isVisible()
  }

  @When('the student clicks the declaration accordion')
  async clickDeclarationAccordion () {
    const declarationAccordionTrigger = this.getDeclarationAccordionTrigger()
    const isExpanded = await declarationAccordionTrigger.getAttribute('aria-expanded')

    if (isExpanded !== 'true') {
      await clickOnElement(declarationAccordionTrigger)
    }

    await expect(declarationAccordionTrigger).toHaveAttribute('aria-expanded', 'true')
  }

  @Then('the trace author type radio set is visible and contains 3 radio buttons')
  async verifyTraceAuthorTypeRadioSetVisible () {
    await this.getTraceAuthorTypeRadioSet().isVisible()
    const count = await this.getTraceAuthorTypeRadioButtons().count()
    expect(count).toEqual(3)
  }
}
