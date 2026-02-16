import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'

export class ResumesWidget extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('student-resumes-widget'), page)
  }

  getTitle () {
    return this.root.getByTestId('home-widget-title')
  }

  getItems () {
    return this.page.getByTestId('resume-item')
  }

  getSeeAllButton () {
    return this.root.getByTestId('see-all-button')
  }

  async countItems () {
    return await this.getItems().count()
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).toHaveText(t('student.global.widgets.resumes.title'))
  }

  async verifyRenderedResumesCount (expectedResumes: number) {
    const count = await this.countItems()
    expect(count).toEqual(expectedResumes)
  }

  async verifyEachItemLastUpdateDate () {
    const count = await this.countItems()
    for (let i = 0; i < count; i++) {
      const item = this.getItems().nth(i)
      await expect(item.getByTestId('resume-item-updated-at')).toBeVisible()
    }
  }

  async verifySeeAllButton () {
    await expect(this.getSeeAllButton()).toBeVisible()
    const buttonText = await this.getSeeAllButton().textContent()
    const expectedText = t('student.global.widgets.resumes.buttons.seeAll')
    expect(buttonText?.toLowerCase()).toEqual(expectedText.toLowerCase())
  }

  async clickSeeAllButton () {
    await this.getSeeAllButton().click()
  }
}
