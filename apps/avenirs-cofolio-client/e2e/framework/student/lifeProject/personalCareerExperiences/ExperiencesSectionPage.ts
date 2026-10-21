import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { Fixture, Then } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentPersonalCareerExperiencesSectionPage')
class StudentPersonalCareerExperiencesSectionPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getDeclaredExperienceCards () {
    return this.page.getByTestId('declared-experience-card')
  }

  getFirstDeclaredExperienceCard () {
    return this.getDeclaredExperienceCards().first()
  }

  @Then('the declared experience cards are visible')
  async verifyDeclaredExperienceCardsVisible () {
    await this.getFirstDeclaredExperienceCard().isVisible()
  }

  @Then('the period badge is visible on the first declared experience card')
  async verifyPeriodBadgeVisibleOnFirstDeclaredExperienceCard () {
    await this.getFirstDeclaredExperienceCard().getByTestId('period-badge').isVisible()
  }
}
