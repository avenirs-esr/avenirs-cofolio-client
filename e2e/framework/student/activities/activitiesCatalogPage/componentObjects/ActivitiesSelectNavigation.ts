import type { Locator, Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect } from '@playwright/test'

export class ActivitiesSelectNavigation extends BaseObject {
  private static readonly SELECT_TESTID = 'activities-select-navigation'
  private static readonly COLLAPSE_TESTID = 'av-select-collapse'
  private static readonly EXPECTED_ENABLED_OPTIONS = 32

  constructor (protected page: Page) {
    super(page.getByTestId(ActivitiesSelectNavigation.SELECT_TESTID), page)
  }

  private select (): Locator {
    return this.root
  }

  private trigger (): Locator {
    return this.select()
  }

  private collapse (): Locator {
    return this.page.getByTestId(ActivitiesSelectNavigation.COLLAPSE_TESTID)
  }

  private enabledOptions (): Locator {
    return this.collapse().locator(
      '[data-testid="av-select-child-option"] input[type="checkbox"]:enabled',
    )
  }

  private thematicLabels (): Locator {
    return this.collapse().getByTestId('av-select-group-label')
  }

  private thematicLabel (thematic: string): Locator {
    return this.collapse().locator(
      `[data-testid="av-select-group-label"][data-group-id="${thematic}"]`,
    )
  }

  private activitiesOfThematic (thematic: string): Locator {
    return this.collapse().locator(
      `[data-testid="av-select-child-option"][data-group-id="${thematic}"]`,
    )
  }

  private async thematicId (heading: Locator): Promise<string> {
    const id = await heading.getAttribute('data-group-id')

    expect(id, 'Thematic should have a data-group-id').toBeTruthy()

    return id!
  }

  private async openSelect () {
    await expect(this.collapse()).not.toBeVisible()
    await expect(this.trigger()).toBeVisible()
    await clickOnElement(this.trigger())
    await expect(this.collapse()).toBeVisible()
  }

  private async closeSelect () {
    await expect(this.collapse()).toBeVisible()
    await clickOnElement(this.trigger())
    await expect(this.collapse()).not.toBeVisible()
  }

  private async thematicHeading (thematic: string): Promise<Locator> {
    const heading = this.thematicLabel(thematic)

    await expect(heading, `Missing thematic: ${thematic}`).toHaveCount(1)

    return heading
  }

  async verifyVisible () {
    await expect(this.select()).toBeVisible()
    await expect(this.trigger()).toBeVisible()
  }

  async verifyHidden () {
    await expect(this.select()).toBeHidden()
  }

  async verifyHasThematics () {
    await this.openSelect()

    await expect(this.enabledOptions()).toHaveCount(
      ActivitiesSelectNavigation.EXPECTED_ENABLED_OPTIONS,
    )

    await this.closeSelect()
  }

  async verifyFirstThematicIs (expected: string) {
    await this.openSelect()

    const first = this.thematicLabels().first()

    await expect(first).toBeVisible()
    await expect(first).toHaveText(expected)

    await this.closeSelect()
  }

  async verifyFirstThematicHasAtLeastOneActivity () {
    await this.openSelect()

    const firstThematic = this.thematicLabels().first()

    await expect(firstThematic).toBeVisible()

    const thematicId = await this.thematicId(firstThematic)
    const firstActivity = this.activitiesOfThematic(thematicId).first()

    await expect(
      firstActivity,
      'Expected at least 1 activity in the first thematic',
    ).toBeVisible()

    await this.closeSelect()
  }

  async verifyFirstActivityTitleOfFirstThematic (expectedTitle: string) {
    await this.openSelect()

    const firstThematic = this.thematicLabels().first()

    await expect(firstThematic).toBeVisible()

    const thematicId = await this.thematicId(firstThematic)
    const firstActivity = this.activitiesOfThematic(thematicId).first()

    await expect(firstActivity).toBeVisible()
    await expect(firstActivity).toContainText(expectedTitle)

    await this.closeSelect()
  }

  async verifyLastActivityTitleOfFirstThematic (expectedTitle: string) {
    await this.openSelect()

    const firstThematic = this.thematicLabels().first()

    await expect(firstThematic).toBeVisible()

    const thematicId = await this.thematicId(firstThematic)
    const lastActivity = this.activitiesOfThematic(thematicId).last()

    await expect(
      lastActivity,
      'Expected at least 1 activity in the first thematic',
    ).toBeVisible()

    await expect(lastActivity).toContainText(expectedTitle)

    await this.closeSelect()
  }

  async selectSecondActivityOfThematic (thematic: string) {
    await this.openSelect()

    await this.thematicHeading(thematic)

    const activities = this.activitiesOfThematic(thematic)
    const secondActivity = activities.nth(1)

    await expect(
      secondActivity,
      `Thematic ${thematic} should have at least 2 activities`,
    ).toBeVisible()

    const checkbox = secondActivity.locator('input[type="checkbox"]')
    const id = await checkbox.getAttribute('id')

    expect(
      id,
      `Second activity in ${thematic} should have a checkbox id`,
    ).toBeTruthy()

    const label = this.collapse().locator(`label[for="${id}"]`)

    await clickOnElement(label)
  }

  async verifyAllExpectedThematics (expected: string[]) {
    await this.openSelect()

    for (const thematic of expected) {
      await this.thematicHeading(thematic)

      const firstActivity = this.activitiesOfThematic(thematic).first()

      await expect(
        firstActivity,
        `Thematic ${thematic} should have at least 1 activity`,
      ).toBeVisible()
    }

    await this.closeSelect()
  }
}
