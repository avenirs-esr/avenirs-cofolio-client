import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class StudentOverviewWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-overview-widget'))
  }

  getProfileBanner () {
    return this.page.getByTestId('profile-banner')
  }

  getProfilePicture () {
    return this.page.getByTestId('profile-picture')
  }

  getStudentName () {
    return this.root.locator('span.n4')
  }

  getStudentBio () {
    return this.root.locator('span.student-overview-bio')
  }

  getEditProfileButton () {
    return this.page.getByTestId('edit-profile-button')
  }

  getShareResumeButton () {
    return this.page.getByTestId('share-resume-button')
  }

  getShareCofolioButton () {
    return this.page.getByTestId('share-cofolio-button')
  }

  getMyEstablishmentsButton () {
    return this.page.getByTestId('my-establishments-button')
  }

  getUpdateProfileDrawer () {
    return this.page.getByTestId('update-profile-drawer').locator('.av-drawer')
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getProfileBanner()).toBeVisible()
    await expect(this.getProfilePicture()).toBeVisible()
    await expect(this.getStudentName()).toBeVisible()
    await expect(this.getStudentBio()).toBeVisible()
  }

  async verifyProfileBanner () {
    await expect(this.getProfileBanner()).toBeVisible()
  }

  async verifyProfilePicture () {
    await expect(this.getProfilePicture()).toBeVisible()
  }

  async verifyStudentName () {
    await expect(this.getStudentName()).toBeVisible()
  }

  async verifyStudentBio () {
    await expect(this.getStudentBio()).toBeVisible()
  }

  async verifyActionButtons () {
    await expect(this.getEditProfileButton()).toBeVisible()
    await expect(this.getEditProfileButton()).toHaveText(t('student.user.cards.StudentOverviewWidget.buttons.editProfile'))
    await expect(this.getShareResumeButton()).toBeVisible()
    await expect(this.getShareResumeButton()).toHaveText(t('student.user.cards.StudentOverviewWidget.buttons.shareResume'))
    await expect(this.getShareCofolioButton()).toBeVisible()
    await expect(this.getShareCofolioButton()).toHaveText(t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio'))
    await expect(this.getMyEstablishmentsButton()).toBeVisible()
    await expect(this.getMyEstablishmentsButton()).toHaveText(t('student.user.cards.StudentOverviewWidget.buttons.establishments'))
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
