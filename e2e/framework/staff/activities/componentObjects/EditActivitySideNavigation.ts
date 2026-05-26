import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class EditActivitySideNavigation {
  constructor (private page: Page) {}

  private getNav () {
    return this.page.getByTestId('add-national-activity-side-navigation')
  }

  private getCollapseButton () {
    return this.getNav().getByTestId('side-menu-collapse-button')
  }

  private getMenuHeader (type: string) {
    return this.getNav().getByTestId(`expanded-menu-${type}`)
  }

  private getMenuSection (type: string, sectionId: string) {
    return this.getNav().getByTestId(`menu-${type}-${sectionId}`)
  }

  async verifyVisible () {
    await expect(this.getNav()).toBeVisible()
  }

  async verifyHidden () {
    await expect(this.getNav()).toBeHidden()
  }

  async verifyExpandedByDefault () {
    await expect(this.getCollapseButton()).toHaveAttribute('aria-expanded', 'true')
  }

  async collapse () {
    await clickOnElement(this.getCollapseButton())
  }

  async verifyCollapsed () {
    await expect(this.getCollapseButton()).toHaveAttribute('aria-expanded', 'false')
  }

  async verifyHasHeader (type: string) {
    await expect(this.getMenuHeader(type)).toBeVisible()
  }

  async verifyHasSection (type: string, sectionId: string) {
    await expect(this.getMenuSection(type, sectionId)).toBeVisible()
  }

  async verifyMenuSectionIsActive (type: string, sectionId: string) {
    await expect(this.getMenuSection(type, sectionId)).toHaveAttribute('data-selected', 'true')
  }

  async verifyMenuSectionIsNotActive (type: string, sectionId: string) {
    await expect(this.getMenuSection(type, sectionId)).toHaveAttribute('data-selected', 'false')
  }

  async clickMenuSection (type: string, sectionId: string) {
    await clickOnElement(this.getMenuSection(type, sectionId).getByTestId('av-list-item'))
  }
}
