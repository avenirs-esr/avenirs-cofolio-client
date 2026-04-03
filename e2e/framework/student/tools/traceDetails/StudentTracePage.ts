import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
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

  @Then('the trace details page is loaded')
  async verifyTraceDetailsPageLoaded () {
    await expect(this.page.getByTestId('trace-detailed-main-container')).toBeVisible()
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
}
