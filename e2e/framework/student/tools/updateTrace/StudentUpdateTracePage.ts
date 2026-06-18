import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('studentUpdateTracePage')
export class StudentUpdateTracePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getAuthorTypeContainer () {
    return this.page.getByTestId('author-type')
  }

  getAuthorTypeRadioSet () {
    return this.getAuthorTypeContainer().getByTestId('trace-author-type-radio-set')
  }

  getAuthorTypeRadioButtons () {
    return this.getAuthorTypeRadioSet().getByTestId('trace-author-type-radio-button')
  }

  @Then('the update trace page is loaded')
  async verifyUpdateTracePageLoaded () {
    await expect(this.page.getByTestId('update-trace-main-container')).toBeVisible()
  }

  @Then('the author type is visible and contains 3 radio buttons')
  async verifyAuthorTypeVisible () {
    await expect(this.getAuthorTypeContainer()).toBeVisible()
    await expect(this.getAuthorTypeRadioSet()).toBeVisible()
    await expect(this.getAuthorTypeRadioButtons()).toHaveCount(3)
  }
}
