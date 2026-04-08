import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { FooterObject } from '@e2e/framework/shared/componentObjects/FooterObject'
import { Fixture, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffHomePage')
export class StaffHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getFooter () {
    return new FooterObject(this.page.getByTestId('footer'))
  }

  @Then('the footer is visible')
  async verifyFooterVisible () {
    await this.getFooter().isVisible()
    await this.getFooter().verifyVisible()
  }
}
