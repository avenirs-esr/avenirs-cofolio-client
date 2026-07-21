import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeclaredSkillAssociationsObject } from '@e2e/framework/student/lifeProject/declaredSkillDetails/componentObjects/DeclaredSkillAssociationsObject'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then, When, } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentProjectDeclaredSkillsTabsPage')
class StudentProjectDeclaredSkillsTabsPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getAddDeclaredSkillButton () {
    return this.page.getByTestId('add-declared-skill-button')
  }

  getAddDeclaredSkillDrawer () {
    return this.page.getByTestId('add-declared-skill-drawer')
  }

  getAssociateAccordionTrigger () {
    return this.getAddDeclaredSkillDrawer().getByTestId('associate-accordion').getByTestId('av-accordion-trigger')
  }

  getAssociateElementsDrawerSection () {
    return this.getAddDeclaredSkillDrawer().getByTestId('associate-elements-drawer-section')
  }

  getAssociateElementsTypeSelect () {
    return this.getAssociateElementsDrawerSection().getByTestId('associate-elements-type-select')
  }

  getAssociateElementsTypeSelectOptions () {
    return this.getAssociateElementsTypeSelect().getByRole('option')
  }

  verifyAssociateElementsTypeSelectOptionsContains (expectedOption: string) {
    return this.getAssociateElementsTypeSelectOptions().filter({ hasText: expectedOption }).first().isVisible()
  }

  getDeclaredSkillsContainer () {
    return this.page.getByTestId('skills-container')
  }

  getDeclaredSkillCards () {
    return this.getDeclaredSkillsContainer().getByTestId('student-detailed-skill-card')
  }

  getFirstDeclaredSkillCard () {
    return this.getDeclaredSkillCards().first()
  }

  getDeclaredSkillsTabItem () {
    return this.page.getByTestId('declared-skills-tab-item')
  }

  getSkillAssociationsTabItem () {
    return this.page.getByTestId('skill-associations-tab-item')
  }

  getDeclaredSkillAssociations () {
    return new DeclaredSkillAssociationsObject(this.page.getByTestId('declared-skill-associations'))
  }

  @When('the student opens the declared skills tab')
  async clickDeclaredSkillsTab () {
    await this.getDeclaredSkillsTabItem().click()
    await waitForPageLoad(this.page)
  }

  @Then('the add declared skill button is visible')
  async verifyAddDeclaredSkillButtonVisible () {
    await this.getAddDeclaredSkillButton().isVisible()
  }

  @When('the student clicks the add declared skill button')
  async clickAddDeclaredSkillButton () {
    await clickOnElement(this.getAddDeclaredSkillButton())
    await waitForPageLoad(this.page)
  }

  @Then('the add declared skill drawer is visible')
  async verifyAddDeclaredSkillDrawerVisible () {
    await this.getAddDeclaredSkillDrawer().isVisible()
  }

  @When('the student clicks the associate accordion')
  async clickAssociateAccordion () {
    const associateAccordionTrigger = this.getAssociateAccordionTrigger()
    const isExpanded = await associateAccordionTrigger.getAttribute('aria-expanded')

    if (isExpanded !== 'true') {
      await clickOnElement(associateAccordionTrigger)
    }

    await expect(associateAccordionTrigger).toHaveAttribute('aria-expanded', 'true')
  }

  @Then('the associate elements drawer section is visible')
  async verifyAssociateElementsDrawerSectionVisible () {
    await expect(this.getAssociateElementsDrawerSection()).toBeVisible()
  }

  @Then('the associate elements type select is visible')
  async verifyAssociateElementsTypeSelectVisible () {
    await expect(this.getAssociateElementsTypeSelect()).toBeVisible()
  }

  @Then('the associate elements type select contains activities options')
  async verifyAssociateElementsTypeSelectContainsActivitiesOptions () {
    expect(this.verifyAssociateElementsTypeSelectOptionsContains('activities')).toBeTruthy()
  }

  @Then('the declared skills are loaded')
  async verifyDeclaredSkillsLoaded () {
    await this.getFirstDeclaredSkillCard().isVisible()
  }

  @When('the student clicks the first declared skill')
  async clickFirstDeclaredSkill () {
    await this.getDeclaredSkillCards().first().click()
    await waitForPageLoad(this.page)
  }
}
