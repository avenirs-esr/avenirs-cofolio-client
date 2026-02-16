import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { ProfileCard } from '@e2e/framework/student/user/componentObjects/ProfileCard'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentTrajectoriesSelfKnowledgePage')
class StudentTrajectoriesSelfKnowledgePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getUpdateProfileDrawer () {
    return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  }

  getDisplayUpdateProfileDrawerButton () {
    return this.page.getByTestId('display-update-profile-drawer-button')
  }

  getProfileCard () {
    return new ProfileCard(this.page.getByTestId('profile-card'))
  }

  getSectionTitle () {
    return this.page.getByTestId('self-knowledge-section-title')
  }

  @Then('the self-knowledge section title is displayed')
  async verifySectionTitle () {
    await expect(this.getSectionTitle()).toBeVisible()
    await expect(this.getSectionTitle()).toHaveText(t('student.selfKnowledge.SelfKnowledgeMainSection.title.content'))
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
    const button = this.getDisplayUpdateProfileDrawerButton()
    // TODO: replace with button.click() after removing side nav that cause hozontal scroll and prevent click action
    await button.dispatchEvent('click')
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
    await exitButton.dispatchEvent('click')
  }

  @Then('the update profile drawer is closed in the project self knowledge main section page')
  async verifyUpdateProfileDrawerClosed () {
    await expect(this.getUpdateProfileDrawer()).toBeHidden()
  }

  @Then('the self-knowledge profile card is visible')
  async verifyProfileCardVisible () {
    await this.getProfileCard().isVisible()
  }

  @Then('all profile content is readable on mobile')
  async verifyProfileCardContent () {
    await this.getProfileCard().verifyCardContent()
  }

  @Then('the self-knowledge profile card banner is visible')
  async verifyProfileCardBannerVisible () {
    await this.getProfileCard().verifyProfileBanner()
  }

  @Then('the self-knowledge profile card picture is visible')
  async verifyProfileCardPictureVisible () {
    await this.getProfileCard().verifyProfilePicture()
  }

  @Then('the self-knowledge profile card name is visible')
  async verifyProfileCardNameVisible () {
    await this.getProfileCard().verifyStudentName()
  }

  @Then('the self-knowledge profile card bio is visible')
  async verifyProfileCardBioVisible () {
    await this.getProfileCard().verifyStudentBio()
  }

  @Then('the profile card spans full width')
  async verifyProfileCardFullWidth () {
    await this.verifyLocatorIsFullWidth(this.getProfileCard().getRoot())
  }

  @Then('the update profile drawer card spans full width')
  async verifyUpdateProfileDrawerFullWidth () {
    await this.verifyLocatorIsFullWidth(this.getUpdateProfileDrawer())
  }
}
