import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator, type Page } from '@playwright/test'

export class ActivitiesSelectNavigation extends BaseObject {
  constructor (protected page: Page) {
    super(page.locator('select[data-testid="activities-select-navigation"]'), page)
  }

  private select (): Locator {
    return this.root
  }

  private options (): Locator {
    return this.select().locator('option')
  }

  async verifyVisible () {
    await expect(this.select()).toBeVisible()
  }

  async verifyHasThematics () {
    const count = await this.options().count()
    expect(count).toBeGreaterThan(1)
  }

  async selectDifferentOptionPreferSecond () {
    const select = this.select()
    await expect(select).toBeVisible()

    const currentValue = await select.inputValue()
    const total = await this.options().count()

    const preferredIndex = 2

    const tryPick = async (index: number): Promise<string | null> => {
      if (index < 0 || index >= total) {
        return null
      }
      const opt = this.options().nth(index)
      const value = await opt.getAttribute('value')
      const disabled = await opt.getAttribute('disabled')

      if (!value) {
        return null
      }
      if (disabled !== null) {
        return null
      }
      if (value === '' || value === currentValue) {
        return null
      }

      return value
    }

    let valueToSelect = await tryPick(preferredIndex)

    if (!valueToSelect) {
      for (let i = 1; i < total; i++) {
        valueToSelect = await tryPick(i)
        if (valueToSelect) {
          break
        }
      }
    }

    expect(valueToSelect, 'Expected to find a selectable option different from the current one').toBeTruthy()

    await select.selectOption(valueToSelect!)
  }
}
