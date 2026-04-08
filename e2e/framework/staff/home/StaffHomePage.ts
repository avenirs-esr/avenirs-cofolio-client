import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { Fixture } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffHomePage')
export class StaffHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }
}
