import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class ProfileCard extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getProfileBanner () {
    return this.root.getByTestId('profile-banner')
  }

  getProfilePicture () {
    return this.root.getByTestId('profile-picture')
  }

  getStudentName () {
    return this.root.getByTestId('profile-full-name')
  }

  getStudentBio () {
    return this.root.getByTestId('profile-bio')
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

  async verifyCardContent () {
    await this.verifyProfileBanner()
    await this.verifyProfilePicture()
    await this.verifyStudentName()
    await this.verifyStudentBio()
  }
}
