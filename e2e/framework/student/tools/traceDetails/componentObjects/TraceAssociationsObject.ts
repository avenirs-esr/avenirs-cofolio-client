import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator } from '@playwright/test'

export class TraceAssociationsObject extends BaseObject {
  constructor (protected root: Locator) {
    super(root)
  }

  getAssociatedDeclaredSkillsCard () {
    return this.root.getByTestId('associated-declared-skills-card')
  }

  getAssociatedDeclaredSkillCards () {
    return this.root.getByTestId('associated-declared-skill-card')
  }

  async getAssociatedSkillCardsCount () {
    return await this.getAssociatedDeclaredSkillCards().count()
  }

  getDeclaredActivityAssociationsContainer () {
    return this.root.getByTestId('associated-declared-activities-card')
  }

  getAssociatedActivityCards () {
    return this.root.getByTestId('associated-declared-activity-card')
  }

  async getAssociatedActivityCardsCount () {
    return await this.getAssociatedActivityCards().count()
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyDeclaredSkillAssociationsVisible () {
    await expect(this.getAssociatedDeclaredSkillsCard()).toBeVisible()
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
