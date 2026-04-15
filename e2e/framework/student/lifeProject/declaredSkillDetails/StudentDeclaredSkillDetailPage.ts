import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeclaredSkillAssociationsObject } from '@e2e/framework/student/lifeProject/declaredSkillDetails/componentObjects/DeclaredSkillAssociationsObject'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentDeclaredSkillDetailPage')
class StudentDeclaredSkillDetailPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getDeclaredSkillsContainer () {
    return this.page.getByTestId('skills-container')
  }

  getDeclaredSkillCards () {
    return this.getDeclaredSkillsContainer().getByTestId('student-detailed-skill-card')
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

  @When('the student clicks the first declared skill')
  async clickFirstDeclaredSkill () {
    await this.getDeclaredSkillCards().first().click()
    await waitForPageLoad(this.page)
  }

  @When('the student opens the declared skill associations tab')
  async clickAssociationsTab () {
    await this.getSkillAssociationsTabItem().click()
    await waitForPageLoad(this.page)
  }

  @Then('the declared skill associations are loaded')
  async verifyAssociationsLoaded () {
    await this.getDeclaredSkillAssociations().verifyVisible()
  }

  @Then('the trace associations card is visible')
  async verifyTracesCardVisible () {
    await this.getDeclaredSkillAssociations().verifyTracesCardVisible()
  }

  @Then('the trace associations title is defined')
  async verifyTracesCardTitleDefined () {
    await this.getDeclaredSkillAssociations().verifyTracesCardTitleDefined()
  }

  @When('the student expands the trace associations card')
  async expandTracesCard () {
    await this.getDeclaredSkillAssociations().expandTracesCard()
  }

  @Then('the trace association items are not empty')
  async verifyTraceItemsNotEmpty () {
    await this.getDeclaredSkillAssociations().verifyTraceItemsNotEmpty()
  }

  @Then('each trace association item has a defined title')
  async verifyAllTraceItemsHaveTitles () {
    await this.getDeclaredSkillAssociations().verifyAllTraceItemsHaveTitles()
  }

  @Then('the activity associations card is visible')
  async verifyActivitiesCardVisible () {
    await this.getDeclaredSkillAssociations().verifyActivitiesCardVisible()
  }

  @Then('the activity associations title is defined')
  async verifyActivitiesCardTitleDefined () {
    await this.getDeclaredSkillAssociations().verifyActivitiesCardTitleDefined()
  }

  @When('the student expands the activity associations card')
  async expandActivitiesCard () {
    await this.getDeclaredSkillAssociations().expandActivitiesCard()
  }

  @Then('the activity association items are not empty')
  async verifyActivityItemsNotEmpty () {
    await this.getDeclaredSkillAssociations().verifyActivityItemsNotEmpty()
  }

  @Then('each activity association item has a defined title')
  async verifyAllActivityItemsHaveTitles () {
    await this.getDeclaredSkillAssociations().verifyAllActivityItemsHaveTitles()
  }
}
