import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class FooterObject extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  getAnrLink () {
    return this.root.getByTestId('anr-link')
  }

  getFrance2030Link () {
    return this.root.getByTestId('france2030-link')
  }

  getAnrDescription () {
    return this.root.getByTestId('anr-description')
  }

  getCofolioLogo () {
    return this.root.getByTestId('cofolio-logo')
  }

  getCofolioDescription () {
    return this.root.getByTestId('cofolio-description')
  }

  getLegalInformationLinks () {
    return this.root.getByTestId('legal-information-link')
  }

  getOtherSitesLinks () {
    return this.root.getByTestId('other-sites-link')
  }

  getAvenirsLink () {
    return this.root.getByTestId('avenirs-link')
  }

  getEsupLink () {
    return this.root.getByTestId('esup-link')
  }

  getCopyrightLink () {
    return this.root.getByTestId('copyright-link')
  }

  async getLegalInformationLinksCount () {
    return await this.getLegalInformationLinks().count()
  }

  async getOtherSitesLinksCount () {
    return await this.getOtherSitesLinks().count()
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
    await expect(this.getAnrLink()).toBeVisible()
    await expect(this.getFrance2030Link()).toBeVisible()
    await expect(this.getAnrDescription()).toBeVisible()
    await expect(this.getCofolioLogo()).toBeVisible()
    await expect(this.getCofolioDescription()).toBeVisible()

    const countLegalInformationLinks = await this.getLegalInformationLinksCount()
    expect(countLegalInformationLinks).toBeGreaterThan(0)

    const countOtherSitesLinks = await this.getOtherSitesLinksCount()
    expect(countOtherSitesLinks).toBeGreaterThan(0)

    await expect(this.getAvenirsLink()).toBeVisible()
    await expect(this.getEsupLink()).toBeVisible()
    await expect(this.getCopyrightLink()).toBeVisible()
  }
}
