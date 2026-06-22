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

  getTracesActionsDropdown () {
    return this.page.getByTestId('traces-actions-dropdown')
  }

  getTracesActionsDropdownTrigger () {
    return this.getTracesActionsDropdown().getByRole('button')
  }

  getTracesActionsDropdownDeleteItem () {
    return this.page.getByTestId('delete')
  }

  getDeleteTracesModal () {
    return this.page.getByTestId('delete-traces-modal')
  }

  getDeleteTracesModalConfirmButton () {
    return this.getDeleteTracesModal().getByTestId('confirm-button')
  }

  getTraceSelectors () {
    return this.getDeleteTracesModal().getByTestId('selector-overlay')
  }

  getTraceDeletionConfirmationModal () {
    return this.page.getByTestId('trace-deletion-confirmation-modal')
  }

  getTraceDeletionConfirmationModalDescription () {
    return this.page.getByTestId('trace-deletion-confirmation-modal-description')
  }

  getTraceDeletionConfirmationModalSubdescription () {
    return this.page.getByTestId('trace-deletion-confirmation-modal-subdescription')
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

  @When('the student clicks on the traces actions dropdown trigger')
  async clickTracesActionsDropdownTrigger () {
    await clickOnElement(this.getTracesActionsDropdownTrigger())
  }

  @When('the student clicks on the delete traces item')
  async clickDeleteTracesItem () {
    await clickOnElement(this.getTracesActionsDropdownDeleteItem())
  }

  @Then('the delete traces modal is visible')
  async verifyDeleteTracesModalVisible () {
    await expect(this.getDeleteTracesModal()).toBeVisible()
  }

  @When('the student selects the first two traces')
  async selectFirstTwoTraces () {
    const selectors = this.getTraceSelectors()

    await expect(selectors.first()).toBeVisible()

    await selectors.nth(0).focus()
    await this.page.keyboard.press('Enter')
    await expect(selectors.nth(0)).toHaveAttribute('aria-pressed', 'true')

    await selectors.nth(1).focus()
    await this.page.keyboard.press('Enter')
    await expect(selectors.nth(1)).toHaveAttribute('aria-pressed', 'true')
  }

  @Then('the delete traces modal confirm button displays selected count')
  async verifyDeleteTracesModalConfirmButtonSelectedCount () {
    await expect(this.getDeleteTracesModalConfirmButton()).toContainText('2')
  }

  @When('the student confirms selected traces deletion')
  async confirmSelectedTracesDeletion () {
    await clickOnElement(this.getDeleteTracesModalConfirmButton())
  }

  @Then('the trace deletion confirmation modal is visible from traces list')
  async verifyTraceDeletionConfirmationModalVisibleFromList () {
    await expect(this.getTraceDeletionConfirmationModal()).toBeVisible()
  }

  @Then('the trace deletion confirmation modal texts are visible')
  async verifyTraceDeletionConfirmationModalTextsVisible () {
    await expect(this.getTraceDeletionConfirmationModalDescription()).toHaveText(
      'Êtes-vous certain(e) de vouloir supprimer votre trace ?'
    )

    await expect(this.getTraceDeletionConfirmationModalSubdescription()).toHaveText(
      'Toute action de suppression est définitive. Elle entraine la perte des données renseignées pour cette trace ainsi que la suppression des liens d\'association qu\'elle comporte.'
    )
  }
}
