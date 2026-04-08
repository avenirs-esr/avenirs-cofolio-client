import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { FooterObject } from '@e2e/framework/shared/componentObjects/FooterObject'
import { Fixture, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('footerSteps')
export class FooterSteps {
  constructor (public page: Page) {}

  getFooter () {
    return new FooterObject(this.page.getByTestId('footer'))
  }

  @Then('the footer is visible')
  async verifyFooterVisible () {
    await this.getFooter().isVisible()
    await this.getFooter().verifyVisible()
  }
}
