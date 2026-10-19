import type { Locator, Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect } from '@playwright/test'

export class ActivitiesSelectNavigation extends BaseObject {
  private static readonly SELECT_TESTID = 'activities-select-navigation'
  private static readonly COLLAPSE_TESTID = 'av-select__collapse'
  private static readonly OPTION_CHECKBOX_PREFIX = 'select-collapse-options-list-'
  private static readonly EXPECTED_ENABLED_OPTIONS = 32
  private static readonly THEMATIC_LABELS: Record<string, string> = {
    SELF_KNOWLEDGE: 'Me connaître',
    FUTURE_PLANS: 'Explorer mes futurs',
    PROGRAMS: 'Mes formations',
    EXPERIENCES: 'Mes expériences',
    TRAJECTORIES: 'Mes trajectoires',
    RESUMES: 'CV',
    TRANSVERSAL: 'Transverse',
    OTHER: 'Autre',
  }

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

  private optionCheckboxId (value: string): string {
    return `${ActivitiesSelectNavigation.OPTION_CHECKBOX_PREFIX}${value}-checkbox`
  }

  private enabledOptions (): Locator {
    return this.collapse().locator(
      '[data-testid="av-checkbox-list-item"] input[type="checkbox"]:not(:disabled)',
    )
  }

  private thematicLabels (): Locator {
    return this.collapse().locator('.av-row > span.av-text-title')
  }

  private thematicLabel (thematic: string): Locator {
    const label = ActivitiesSelectNavigation.THEMATIC_LABELS[thematic] ?? thematic

    return this.thematicLabels().getByText(label, { exact: true })
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

    const firstThematicLabel = (await firstThematic.textContent())?.trim() ?? ''
    const heading = await this.thematicHeading(firstThematicLabel)

    const item = heading.locator(
      'xpath=ancestor::div[contains(@class, "av-row")]/following-sibling::*[@data-testid="av-checkbox-list-item"][1]',
    )

    await expect(
      item,
      'Expected at least 1 activity in the first thematic',
    ).toBeVisible()

    await this.closeSelect()
  }

  async verifyFirstActivityTitleOfFirstThematic (expectedTitle: string) {
    await this.openSelect()

    const firstThematic = this.thematicLabels().first()
    await expect(firstThematic).toBeVisible()

    const firstActivity = this.collapse()
      .getByTestId('av-checkbox-list-item')
      .first()

    await expect(firstActivity).toContainText(expectedTitle)

    await this.closeSelect()
  }

  async verifyLastActivityTitleOfFirstThematic (expectedTitle: string) {
    await this.openSelect()

    const firstThematic = this.thematicLabels().first()
    await expect(firstThematic).toBeVisible()

    const firstThematicRow = firstThematic.locator(
      'xpath=ancestor::div[contains(@class, "av-row")][1]',
    )

    const nextThematic = this.thematicLabels().nth(1)
    await expect(nextThematic).toBeVisible()

    const nextThematicRow = nextThematic.locator(
      'xpath=ancestor::div[contains(@class, "av-row")][1]',
    )

    const firstRowHandle = await firstThematicRow.elementHandle()
    const nextRowHandle = await nextThematicRow.elementHandle()

    expect(firstRowHandle).not.toBeNull()
    expect(nextRowHandle).not.toBeNull()

    const activityItems = this.collapse().getByTestId('av-checkbox-list-item')
    const itemsCount = await activityItems.count()

    let lastActivity: Locator | undefined

    for (let i = 0; i < itemsCount; i++) {
      const item = activityItems.nth(i)

      const isAfterFirstThematic = await item.evaluate(
        (element, firstRow) => Boolean(
          firstRow
          && (firstRow.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING),
        ),
        firstRowHandle,
      )

      const isBeforeNextThematic = await item.evaluate(
        (element, nextRow) => Boolean(
          nextRow
          && (element.compareDocumentPosition(nextRow) & Node.DOCUMENT_POSITION_FOLLOWING),
        ),
        nextRowHandle,
      )

      if (isAfterFirstThematic && isBeforeNextThematic) {
        lastActivity = item
      }
    }

    expect(
      lastActivity,
      'Expected at least 1 activity in the first thematic',
    ).toBeDefined()

    await expect(lastActivity!).toContainText(expectedTitle)

    await this.closeSelect()
  }

  async selectSecondActivityOfThematic (thematic: string) {
    await this.openSelect()

    const heading = await this.thematicHeading(thematic)

    const firstItem = heading.locator(
      'xpath=ancestor::div[contains(@class, "av-row")]/following-sibling::*[@data-testid="av-checkbox-list-item"][1]',
    )

    const secondItem = firstItem.locator(
      'xpath=following-sibling::*[@data-testid="av-checkbox-list-item"][1]',
    )

    await expect(
      secondItem,
      `Thematic ${thematic} should have at least 2 activities`,
    ).toBeVisible()

    const checkbox = secondItem.locator('input[type="checkbox"]')
    const id = await checkbox.getAttribute('id')

    expect(id, `Second activity in ${thematic} should have a checkbox id`).toBeTruthy()

    const label = this.collapse().locator(`label[for="${id}"]`)
    await clickOnElement(label)
  }

  async verifyAllExpectedThematics (expected: string[]) {
    await this.openSelect()

    for (const thematic of expected) {
      const heading = await this.thematicHeading(thematic)

      const firstItem = heading.locator(
        'xpath=ancestor::div[contains(@class, "av-row")]/following-sibling::*[@data-testid="av-checkbox-list-item"][1]',
      )

      await expect(
        firstItem,
        `Thematic ${thematic} should have at least 1 activity`,
      ).toBeVisible()
    }

    await this.closeSelect()
  }
}
