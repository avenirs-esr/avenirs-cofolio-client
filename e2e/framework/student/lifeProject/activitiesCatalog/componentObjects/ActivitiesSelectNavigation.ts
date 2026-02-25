import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { expect, type Locator, type Page } from '@playwright/test'

export class ActivitiesSelectNavigation extends BaseObject {
  private static readonly SELECT_TESTID = 'activities-select-navigation'
  private static readonly OPTGROUP_PREFIX = 'select-optgroup-'
  private static readonly EXPECTED_ENABLED_OPTIONS = 28

  constructor (protected page: Page) {
    super(page.locator(`select[data-testid="${ActivitiesSelectNavigation.SELECT_TESTID}"]`), page)
  }

  private select (): Locator {
    return this.root
  }

  private enabledOptions (): Locator {
    return this.select().locator('option:not([disabled])')
  }

  private optgroups (): Locator {
    return this.select().locator(`[data-testid^="${ActivitiesSelectNavigation.OPTGROUP_PREFIX}"]`)
  }

  private optgroup (thematic: string): Locator {
    return this.select().locator(`[data-testid="${ActivitiesSelectNavigation.OPTGROUP_PREFIX}${thematic}"]`)
  }

  private enabledOptionsInThematic (thematic: string): Locator {
    return this.optgroup(thematic).locator('option:not([disabled])')
  }

  private firstOptgroup (): Locator {
    return this.optgroups().first()
  }

  private async readOptionLabel (option: Locator): Promise<string> {
    const text = (await option.textContent())?.trim()
    return text ?? ''
  }

  async verifyVisible () {
    await expect(this.select()).toBeVisible()
  }

  async verifyHidden () {
    await expect(this.select()).toBeHidden()
  }

  async verifyHasThematics () {
    await expect(this.enabledOptions()).toHaveCount(ActivitiesSelectNavigation.EXPECTED_ENABLED_OPTIONS)
  }

  async verifyFirstThematicIs (expected: string) {
    await expect(this.select()).toBeVisible()

    const first = this.firstOptgroup()
    await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
    await expect(first).toHaveAttribute(
      'data-testid',
      `${ActivitiesSelectNavigation.OPTGROUP_PREFIX}${expected}`,
    )
  }

  async verifyFirstThematicHasAtLeastOneActivity () {
    await expect(this.select()).toBeVisible()

    const first = this.firstOptgroup()
    await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)

    const options = first.locator('option:not([disabled])')
    const count = await options.count()
    expect(count, 'Expected at least 1 enabled option in first optgroup').toBeGreaterThan(0)
  }

  async verifyFirstActivityTitleOfFirstThematic (expectedTitle: string) {
    await expect(this.select()).toBeVisible()

    const first = this.firstOptgroup()
    await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)

    const firstOption = first.locator('option:not([disabled])').first()
    await expect(firstOption, 'Expected at least 1 option in first optgroup').toHaveCount(1)

    const label = await this.readOptionLabel(firstOption)
    expect(label, 'First activity label mismatch in first optgroup').toContain(expectedTitle)
  }

  async verifyLastActivityTitleOfFirstThematic (expectedTitle: string) {
    await expect(this.select()).toBeVisible()

    const first = this.firstOptgroup()
    await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)

    const lastOption = first.locator('option:not([disabled])').last()
    await expect(lastOption, 'Expected at least 1 option in first optgroup').toHaveCount(1)

    const label = await this.readOptionLabel(lastOption)
    expect(label, 'Last activity label mismatch in first optgroup').toContain(expectedTitle)
  }

  async selectSecondActivityOfThematic (thematic: string) {
    const select = this.select()
    await expect(select).toBeVisible()

    const group = this.optgroup(thematic)
    await expect(group, `Missing optgroup for thematic: ${thematic}`).toHaveCount(1)

    const options = this.enabledOptionsInThematic(thematic)
    const count = await options.count()
    expect(
      count,
      `Thematic ${thematic} should have at least 2 activities to select the second one`,
    ).toBeGreaterThanOrEqual(2)

    const value = await options.nth(1).getAttribute('value')
    expect(value, `Second option in thematic ${thematic} should have a value`).toBeTruthy()

    await select.selectOption(value!)
  }

  async verifyAllExpectedThematics (expected: string[]) {
    await expect(this.select()).toBeVisible()

    for (const thematic of expected) {
      const group = this.optgroup(thematic)
      await expect(group, `Missing optgroup for thematic: ${thematic}`).toHaveCount(1)

      const enabledCount = await group.locator('option:not([disabled])').count()
      expect(enabledCount, `Thematic ${thematic} should have at least 1 enabled activity`).toBeGreaterThan(0)
    }
  }
}
