import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { ProfileCard } from '@e2e/framework/shared/componentObjects/ProfileCard'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('studentToolsKitPage')
export class StudentToolsKitPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getBackgroundImage () {
    return this.page.getByTestId('kit-background')
  }

  getTitle () {
    return this.page.getByTestId('kit-title')
  }

  getSubtitle () {
    return this.page.getByTestId('kit-subtitle')
  }

  getConsign () {
    return this.page.getByTestId('kit-consign')
  }

  getProfileCard () {
    return new ProfileCard(this.page.getByTestId('profile-card'))
  }

  @Then('the background image is displayed correctly on the kit page')
  async verifyBackgroundImage () {
    expect(this.getBackgroundImage().isVisible()).toBeTruthy()
  }

  @Then('the title is displayed correctly on the kit page')
  async verifyTitle () {
    expect(this.getTitle().isVisible()).toBeTruthy()
  }

  @Then('the subtitle is displayed correctly on the kit page')
  async verifySubtitle () {
    expect(this.getSubtitle().isVisible()).toBeTruthy()
  }

  @Then('the consign is displayed correctly on the kit page')
  async verifyConsign () {
    expect(this.getConsign().isVisible()).toBeTruthy()
  }

  @Then('the profile card is displayed correctly on the kit page')
  async verifyProfileCard () {
    expect(this.getProfileCard().isVisible()).toBeTruthy()
    await this.getProfileCard().verifyCardContent()
  }
}
