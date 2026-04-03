import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class TraceAssociationsObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getDeclaredSkillAssociationsContainer () {
    return this.root.getByTestId('declared-skill-associations-container')
  }

  getAssociatedSkillCards () {
    return this.root.getByTestId('associated-skill-card')
  }

  async getAssociatedSkillCardsCount () {
    return await this.getAssociatedSkillCards().count()
  }

  getDeclaredActivityAssociationsContainer () {
    return this.root.getByTestId('declared-activity-associations-container')
  }

  getAssociatedActivityCards () {
    return this.root.getByTestId('associated-activity-card')
  }

  async getAssociatedActivityCardsCount () {
    return await this.getAssociatedActivityCards().count()
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyDeclaredSkillAssociationsVisible () {
    await expect(this.getDeclaredSkillAssociationsContainer()).toBeVisible()
  }

  async verifyAssociatedSkillCardsNotEmpty () {
    const count = await this.getAssociatedSkillCardsCount()
    expect(count).toBeGreaterThan(0)
  }

  async verifyDeclaredActivityAssociationsVisible () {
    await expect(this.getDeclaredActivityAssociationsContainer()).toBeVisible()
  }

  async verifyAssociatedActivityCardsNotEmpty () {
    const count = await this.getAssociatedActivityCardsCount()
    expect(count).toBeGreaterThan(0)
  }
}
