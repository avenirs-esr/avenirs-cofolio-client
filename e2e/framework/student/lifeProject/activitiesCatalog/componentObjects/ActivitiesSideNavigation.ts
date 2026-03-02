import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator, type Page } from '@playwright/test'

export class ActivitiesSideNavigation extends BaseObject {
  private static readonly ROOT_TESTID = 'activities-side-navigation'
  private static readonly COLLAPSED_PREFIX = 'collapsed-menu-'
  private static readonly EXPANDED_PREFIX = 'expanded-menu-'
  private static readonly MENU_ITEM_PREFIX = 'menu-'

  constructor (protected page: Page) {
    super(page.getByTestId(ActivitiesSideNavigation.ROOT_TESTID), page)
  }

  private parents (): Locator {
    return this.root.locator(
      `[data-testid^="${ActivitiesSideNavigation.COLLAPSED_PREFIX}"], [data-testid^="${ActivitiesSideNavigation.EXPANDED_PREFIX}"]`,
    )
  }

  private expandedParents (): Locator {
    return this.root.locator(`[data-testid^="${ActivitiesSideNavigation.EXPANDED_PREFIX}"]`)
  }

  private parent (thematic: string): Locator {
    return this.root.locator(
      `[data-testid="${ActivitiesSideNavigation.COLLAPSED_PREFIX}${thematic}"], `
      + `[data-testid="${ActivitiesSideNavigation.EXPANDED_PREFIX}${thematic}"]`,
    )
  }

  private menuItems (parentId: string): Locator {
    return this.root.locator(`[data-testid^="${ActivitiesSideNavigation.MENU_ITEM_PREFIX}${parentId}-"]`)
  }

  private async getDataTestId (locator: Locator, errorMessage: string): Promise<string> {
    const tid = await locator.getAttribute('data-testid')
    if (!tid) {
      throw new Error(errorMessage)
    }
    return tid
  }

  private extractParentIdFromTestId (testId: string): string {
    if (testId.startsWith(ActivitiesSideNavigation.EXPANDED_PREFIX)) {
      return testId.slice(ActivitiesSideNavigation.EXPANDED_PREFIX.length)
    }
    if (testId.startsWith(ActivitiesSideNavigation.COLLAPSED_PREFIX)) {
      return testId.slice(ActivitiesSideNavigation.COLLAPSED_PREFIX.length)
    }
    throw new Error(`Unexpected parent data-testid format: ${testId}`)
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyHidden () {
    await expect(this.root).toBeHidden()
  }

  async verifyHasThematics () {
    await expect(this.parents().first()).toBeVisible()
  }

  async verifyFirstThematicIs (expected: string) {
    const first = this.parents().first()
    await expect(first).toBeVisible()

    const tid = await this.getDataTestId(first, 'Could not read data-testid of first parent')
    expect(tid).toContain(expected)
  }

  private async ensureFirstParentExpanded (): Promise<string> {
    const first = this.parents().first()
    await expect(first).toBeVisible()

    const tid = await this.getDataTestId(first, 'Could not read data-testid of first parent')
    if (tid.startsWith(ActivitiesSideNavigation.EXPANDED_PREFIX)) {
      return this.extractParentIdFromTestId(tid)
    }

    await first.click()

    const expanded = this.expandedParents().first()
    await expect(expanded).toBeVisible()

    const expandedTid = await this.getDataTestId(expanded, 'Could not read data-testid of expanded parent')
    return this.extractParentIdFromTestId(expandedTid)
  }

  async verifyFirstThematicHasAtLeastOneActivity () {
    const parentId = await this.ensureFirstParentExpanded()
    await expect(this.menuItems(parentId).first()).toBeVisible()
  }

  async verifyFirstActivityTitleOfFirstThematic (expectedTitle: string) {
    const parentId = await this.ensureFirstParentExpanded()
    await expect(this.menuItems(parentId).first()).toContainText(expectedTitle)
  }

  async verifyLastActivityTitleOfFirstThematic (expectedTitle: string) {
    const parentId = await this.ensureFirstParentExpanded()
    await expect(this.menuItems(parentId).last()).toContainText(expectedTitle)
  }

  private async ensureThematicExpanded (thematic: string): Promise<string> {
    const target = this.parent(thematic)
    await expect(target, `Missing thematic in side navigation: ${thematic}`).toHaveCount(1)

    const locator = target.first()
    await expect(locator).toBeVisible()

    const tid = await this.getDataTestId(locator, `Could not read data-testid for thematic: ${thematic}`)
    if (tid.startsWith(ActivitiesSideNavigation.EXPANDED_PREFIX)) {
      return thematic
    }

    await locator.click()

    const expandedTarget = this.root.locator(`[data-testid="${ActivitiesSideNavigation.EXPANDED_PREFIX}${thematic}"]`)
    await expect(expandedTarget).toBeVisible()

    return thematic
  }

  async selectFirstChildOfThematic (thematic: string) {
    const parentId = await this.ensureThematicExpanded(thematic)

    const first = this.menuItems(parentId).first()
    await expect(first).toBeVisible()
    await first.click()
  }

  async selectLastChildOfThematic (thematic: string) {
    const parentId = await this.ensureThematicExpanded(thematic)

    const last = this.menuItems(parentId).last()
    await expect(last).toBeVisible()
    await last.click()
  }

  async selectSecondChildOfThematic (thematic: string) {
    const parentId = await this.ensureThematicExpanded(thematic)

    const second = this.menuItems(parentId).nth(1)
    await expect(second).toBeVisible()
    await second.click()
  }

  async verifyAllExpectedThematics (expected: string[]) {
    for (const thematic of expected) {
      await expect(this.parent(thematic), `Missing thematic in side navigation: ${thematic}`).toHaveCount(1)
    }
    await expect(this.parents(), `Expected ${expected.length} thematics in side navigation`).toHaveCount(expected.length)
  }
}
