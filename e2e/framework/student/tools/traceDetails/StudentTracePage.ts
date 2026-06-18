import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { TraceAssociationsObject } from '@e2e/framework/student/tools/traceDetails/componentObjects/TraceAssociationsObject'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('studentTracePage')
export class StudentTracePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getTraceAssociations () {
    return new TraceAssociationsObject(this.page.getByTestId('trace-associations'))
  }

  getAssociationsTabItem () {
    return this.page.getByTestId('associations-tab-item')
  }

  getDropdown () {
    return this.page.getByTestId('trace-settings-dropdown')
  }

  getDropdownTrigger () {
    return this.getDropdown().getByRole('button')
  }

  getDropdownUpdateTraceItem () {
    return this.page.getByTestId('update')
  }

  @When('the student clicks on the trace settings dropdown trigger')
  async clickDropdownTrigger () {
    await clickOnElement(this.getDropdownTrigger())
  }

  @Then('the update item in the trace settings dropdown is visible')
  async verifyDropdownUpdateTraceItemVisible () {
    await expect(this.getDropdownUpdateTraceItem()).toBeVisible()
  }

  @When('the student clicks on the update item in the trace settings dropdown')
  async clickDropdownUpdateTraceItem () {
    await clickOnElement(this.getDropdownUpdateTraceItem())
  }

  private async shouldSkipSkillAssociationFlow () {
    return await this.getTraceAssociations().hasAssociatedSkillCards()
  }

  @Then('the trace details page is loaded')
  async verifyTraceDetailsPageLoaded () {
    await expect(this.page.getByTestId('trace-detailed-main-container')).toBeVisible()
  }

  @Then('the author type is visible')
  async verifyAuthorTypeVisible () {
    await expect(this.page.getByTestId('author-type')).toBeVisible()
  }

  @When('the student open associations tab')
  async clickAssociationsTabItem () {
    await this.getAssociationsTabItem().click()
  }

  @Then('the trace associations are loaded')
  async verifyTraceAssociationsVisible () {
    await this.getTraceAssociations().verifyVisible()
  }

  @Then('the declared skill associations are visible')
  async verifyDeclaredSkillAssociationsVisible () {
    await this.getTraceAssociations().verifyDeclaredSkillAssociationsVisible()
  }

  @Then('the skill associations are not empty')
  async verifySkillAssociationsNotEmpty () {
    await this.getTraceAssociations().verifyAssociatedSkillCardsNotEmpty()
  }

  @Then('the declared activity associations are visible')
  async verifyDeclaredActivityAssociationsVisible () {
    await this.getTraceAssociations().verifyDeclaredActivityAssociationsVisible()
  }

  @Then('the activity associations are not empty')
  async verifyActivityAssociationsNotEmpty () {
    await this.getTraceAssociations().verifyAssociatedActivityCardsNotEmpty()
  }

  @When('the student clicks on the declared skill associate button')
  async clickDeclaredSkillAssociateButton () {
    if (await this.shouldSkipSkillAssociationFlow()) {
      return
    }
    await this.getTraceAssociations().clickDeclaredSkillAssociateButton()
  }

  @When('the student selects the first skill in the associate skill dropdown')
  async selectFirstSkillInAssociateSkillDropdown () {
    if (await this.shouldSkipSkillAssociationFlow()) {
      return
    }
    await this.page.getByTestId('search-association-layout').locator('input').first().click()
    await this.page.getByTestId('search-association-layout').getByRole('listitem').first().click()
  }

  @When('the student confirms the skill association')
  async confirmSkillAssociation () {
    if (await this.shouldSkipSkillAssociationFlow()) {
      return
    }
    await this.page.getByTestId('confirm-button').click()
    await this.page.getByTestId('confirm-associate-modal').getByTestId('confirm-button').click()
  }
}
