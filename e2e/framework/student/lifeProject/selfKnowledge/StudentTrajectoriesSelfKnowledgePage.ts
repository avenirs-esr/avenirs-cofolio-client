import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentTrajectoriesSelfKnowledgePage')
class StudentTrajectoriesSelfKnowledgePage {
  constructor (public page: Page) {}

  getUpdateProfileDrawer () {
    return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  }

  getDisplayUpdateProfileDrawerButton () {
    return this.page.getByTestId('display-update-profile-drawer-button')
  }

  @Given('the student opens the project self knowledge main section page')
  async goto () {
    await this.page.goto(STUDENT_ROUTES.PROJECT.TRAJECTORIES.SELF_KNOWLEDGE)
    await waitForPageLoad(this.page)
  }

  @Then('the student project self knowledge main section page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.TRAJECTORIES.SELF_KNOWLEDGE)
  }

  @When('the user clicks the display update profile drawer button')
  async clickDisplayUpdateProfileDrawerButton () {
    await this.getDisplayUpdateProfileDrawerButton().click()
    await waitForPageLoad(this.page)
  }

  @Then('the update profile drawer is opened in the project self knowledge main section page')
  async verifyUpdateProfileDrawerOpened () {
    await expect(this.getUpdateProfileDrawer()).toBeVisible()
  }

  @When('the user clicks the exit button on the update profile drawer')
  async closeDrawer () {
    const updateProfileDrawer = this.getUpdateProfileDrawer()
    const exitButton = updateProfileDrawer.locator('.av-cancel-confirm-buttons-container button').first()
    await exitButton.click()
  }

  @Then('the update profile drawer is closed in the project self knowledge main section page')
  async verifyUpdateProfileDrawerClosed () {
    await expect(this.getUpdateProfileDrawer()).toBeHidden()
  }
}
