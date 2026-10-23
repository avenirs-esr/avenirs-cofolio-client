import type { Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { ProfileCard } from '@e2e/framework/shared/componentObjects/ProfileCard'

export class StaffOverviewWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('staff-overview-widget'))
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

  getStaffName () {
    return this.getProfileCard().getFullName()
  }

  async verifyProfileBanner () {
    await this.getProfileCard().verifyProfileBanner()
  }

  async verifyProfilePicture () {
    await this.getProfileCard().verifyProfilePicture()
  }

  async verifyStaffName () {
    await this.getProfileCard().verifyFullName()
  }
}
