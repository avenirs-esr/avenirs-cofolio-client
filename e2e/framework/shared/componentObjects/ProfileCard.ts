import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { verifyTextLocator } from '@e2e/framework/shared/utils/text'
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

  getFullName () {
    return this.root.getByTestId('profile-full-name')
  }

  getBio () {
    return this.root.getByTestId('profile-bio')
  }

  async verifyProfileBanner () {
    await expect(this.getProfileBanner()).toBeVisible()
  }

  async verifyProfilePicture () {
    await expect(this.getProfilePicture()).toBeVisible()
  }

  async verifyFullName () {
    await verifyTextLocator(this.getFullName())
  }

  async verifyBio () {
    await verifyTextLocator(this.getBio())
  }

  async verifyCardContent () {
    await this.verifyProfileBanner()
    await this.verifyProfilePicture()
    await this.verifyFullName()
    await this.verifyBio()
  }
}
