import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator, type Page } from '@playwright/test'

export class ActivitiesSideNavigation extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('activities-side-navigation'), page)
  }

  private parents (): Locator {
    return this.root.locator('[data-testid^="collapsed-menu-"], [data-testid^="expanded-menu-"]')
  }

  private firstParent (): Locator {
    return this.parents().first()
  }

  private expandedParents (): Locator {
    return this.root.locator('[data-testid^="expanded-menu-"]')
  }

  private menuItems (parentId: string): Locator {
    return this.root.locator(`[data-testid^="menu-${parentId}-"]`)
  }

  async verifyVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyHasThematics () {
    await expect(this.firstParent()).toBeVisible()
  }

  private async ensureFirstParentExpanded (): Promise<string> {
    const first = this.firstParent()
    await expect(first).toBeVisible()

    const tid = await first.getAttribute('data-testid')
    if (!tid) {
      throw new Error('Could not read data-testid of first parent')
    }

    if (tid.startsWith('expanded-menu-')) {
      return tid.replace('expanded-menu-', '')
    }

    await first.click()

    const expanded = this.expandedParents().first()
    await expect(expanded).toBeVisible()

    const expandedTid = await expanded.getAttribute('data-testid')
    if (!expandedTid) {
      throw new Error('Could not read data-testid of expanded parent')
    }

    return expandedTid.replace('expanded-menu-', '')
  }

  async selectSecondChildOfFirstParent () {
    const parentId = await this.ensureFirstParentExpanded()

    const children = this.menuItems(parentId)
    const second = children.nth(1)
    await expect(second).toBeVisible()
    await second.click()
  }
}
