import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class DeclaredSkillAssociationsObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getAssociatedTracesCard () {
    return this.root.getByTestId('associated-traces-card')
  }

  getAssociatedActivitiesCard () {
    return this.root.getByTestId('associated-declared-activities-card')
  }

  getTracesCardTitle () {
    return this.getAssociatedTracesCard().getByTestId('associations-card-title')
  }

  getActivitiesCardTitle () {
    return this.getAssociatedActivitiesCard().getByTestId('associations-card-title')
  }

  getTracesCardContainer () {
    return this.getAssociatedTracesCard().getByTestId('associations-card-container')
  }

  getActivitiesCardContainer () {
    return this.getAssociatedActivitiesCard().getByTestId('associations-card-container')
  }

  getTraceAssociationItems () {
    return this.getTracesCardContainer().getByTestId('association-card')
  }

  getActivityAssociationItems () {
    return this.getActivitiesCardContainer().getByTestId('association-card')
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyTracesCardVisible () {
    await expect(this.getAssociatedTracesCard()).toBeVisible()
  }

  async verifyActivitiesCardVisible () {
    await expect(this.getAssociatedActivitiesCard()).toBeVisible()
  }

  async verifyTracesCardTitleDefined () {
    const title = await this.getTracesCardTitle().textContent()
    expect(title?.trim()).toBeTruthy()
  }

  async verifyActivitiesCardTitleDefined () {
    const title = await this.getActivitiesCardTitle().textContent()
    expect(title?.trim()).toBeTruthy()
  }

  async expandTracesCard () {
    await this.getTracesCardTitle().click()
  }

  async expandActivitiesCard () {
    await this.getActivitiesCardTitle().click()
  }

  async verifyTraceItemsNotEmpty () {
    const count = await this.getTraceAssociationItems().count()
    expect(count).toBeGreaterThan(0)
  }

  async verifyActivityItemsNotEmpty () {
    const count = await this.getActivityAssociationItems().count()
    expect(count).toBeGreaterThan(0)
  }

  async verifyAllTraceItemsHaveTitles () {
    const items = this.getTraceAssociationItems()
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      const title = await items.nth(i).getByTestId('floating-icon-card-title').textContent()
      expect(title?.trim()).toBeTruthy()
    }
  }

  async verifyAllActivityItemsHaveTitles () {
    const items = this.getActivityAssociationItems()
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      const title = await items.nth(i).getByTestId('floating-icon-card-title').textContent()
      expect(title?.trim()).toBeTruthy()
    }
  }
}
