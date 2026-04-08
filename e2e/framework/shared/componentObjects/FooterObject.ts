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

  getMandatoryLinks () {
    return this.root.getByTestId('mandatory-link')
  }

  getEcosystemLinks () {
    return this.root.getByTestId('ecosystem-link')
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

  async getMandatoryLinksCount () {
    return await this.getMandatoryLinks().count()
  }

  async getEcosystemLinksCount () {
    return await this.getEcosystemLinks().count()
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
    await expect(this.getAnrLink()).toBeVisible()
    await expect(this.getFrance2030Link()).toBeVisible()
    await expect(this.getAnrDescription()).toBeVisible()
    await expect(this.getCofolioLogo()).toBeVisible()
    await expect(this.getCofolioDescription()).toBeVisible()
    await expect(this.getMandatoryLinks()).toBeVisible()
    await expect(this.getEcosystemLinks()).toBeVisible()
    await expect(this.getAvenirsLink()).toBeVisible()
    await expect(this.getEsupLink()).toBeVisible()
    await expect(this.getCopyrightLink()).toBeVisible()

    const countMandatoryLinks = await this.getMandatoryLinksCount()
    expect(countMandatoryLinks).toBeGreaterThan(0)

    const countEcosystemLinks = await this.getEcosystemLinksCount()
    expect(countEcosystemLinks).toBeGreaterThan(0)
  }
}
