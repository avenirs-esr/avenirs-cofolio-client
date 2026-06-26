import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { ProfileCard } from '@e2e/framework/shared/componentObjects/ProfileCard'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class StudentOverviewWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-overview-widget'))
  }

  getProfileCard () {
    return new ProfileCard(this.root.getByTestId('profile-card'))
  }

  getProfileBanner () {
    return this.getProfileCard().getProfileBanner()
  }

  getProfilePicture () {
    return this.getProfileCard().getProfilePicture()
  }

  getStudentName () {
    return this.getProfileCard().getFullName()
  }

  getStudentBio () {
    return this.getProfileCard().getBio()
  }

  getEditProfileButton () {
    return this.page.getByTestId('edit-profile-button')
  }

  getUpdateProfileDrawer () {
    return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  }

  async verifyProfileBanner () {
    await this.getProfileCard().verifyProfileBanner()
  }

  async verifyProfilePicture () {
    await this.getProfileCard().verifyProfilePicture()
  }

  async verifyStudentName () {
    await this.getProfileCard().verifyFullName()
  }

  async verifyStudentBio () {
    await this.getProfileCard().verifyBio()
  }

  async verifyStudentBioHidden () {
    await this.getProfileCard().verifyBioHidden()
  }

  async verifyActionButtons () {
    await expect(this.getEditProfileButton()).toBeVisible()
    await expect(this.getEditProfileButton()).toHaveText(t('student.user.cards.StudentOverviewWidget.buttons.editProfile'))
  }

  async clickEditProfileButton () {
    await this.getEditProfileButton().click()
  }

  async verifyDrawerOpened () {
    const drawer = this.getUpdateProfileDrawer()
    await expect(drawer).toBeVisible()
    const drawerTitle = drawer.getByTestId('drawer-title')
    await expect(drawerTitle).toHaveText(t('student.user.overlays.UpdateProfileDrawer.title'))
  }

  async verifyDrawerClosed () {
    await expect(this.getUpdateProfileDrawer()).not.toBeVisible()
  }

  async closeDrawer () {
    const updateProfileDrawer = this.getUpdateProfileDrawer()
    const exitButton = updateProfileDrawer.locator('.av-cancel-confirm-buttons-container button').first()
    await exitButton.click()
  }
}
