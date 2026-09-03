# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/student/lifeProject/activitiesCatalog/activitiesCatalog.mobile.feature.spec.js >> Student Project Activities Catalog Page >> Activities Navigation - Mobile >> Student sees first thematic activities in select navigation
- Location: .features-gen/tests/student/lifeProject/activitiesCatalog/activitiesCatalog.mobile.feature.spec.js:31:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('select[data-testid="activities-select-navigation"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('select[data-testid="activities-select-navigation"]')

```

# Test source

```ts
  1   | import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
  2   | import { expect, type Locator, type Page } from '@playwright/test'
  3   | 
  4   | export class ActivitiesSelectNavigation extends BaseObject {
  5   |   private static readonly SELECT_TESTID = 'activities-select-navigation'
  6   |   private static readonly OPTGROUP_PREFIX = 'select-optgroup-'
  7   |   private static readonly EXPECTED_ENABLED_OPTIONS = 28
  8   | 
  9   |   constructor (protected page: Page) {
  10  |     super(page.locator(`select[data-testid="${ActivitiesSelectNavigation.SELECT_TESTID}"]`), page)
  11  |   }
  12  | 
  13  |   private select (): Locator {
  14  |     return this.root
  15  |   }
  16  | 
  17  |   private enabledOptions (): Locator {
  18  |     return this.select().locator('option:not([disabled])')
  19  |   }
  20  | 
  21  |   private optgroups (): Locator {
  22  |     return this.select().locator(`[data-testid^="${ActivitiesSelectNavigation.OPTGROUP_PREFIX}"]`)
  23  |   }
  24  | 
  25  |   private optgroup (thematic: string): Locator {
  26  |     return this.select().locator(`[data-testid="${ActivitiesSelectNavigation.OPTGROUP_PREFIX}${thematic}"]`)
  27  |   }
  28  | 
  29  |   private enabledOptionsInThematic (thematic: string): Locator {
  30  |     return this.optgroup(thematic).locator('option:not([disabled])')
  31  |   }
  32  | 
  33  |   private firstOptgroup (): Locator {
  34  |     return this.optgroups().first()
  35  |   }
  36  | 
  37  |   private async readOptionLabel (option: Locator): Promise<string> {
  38  |     const text = (await option.textContent())?.trim()
  39  |     return text ?? ''
  40  |   }
  41  | 
  42  |   async verifyVisible () {
  43  |     await expect(this.select()).toBeVisible()
  44  |   }
  45  | 
  46  |   async verifyHidden () {
  47  |     await expect(this.select()).toBeHidden()
  48  |   }
  49  | 
  50  |   async verifyHasThematics () {
  51  |     await expect(this.enabledOptions()).toHaveCount(ActivitiesSelectNavigation.EXPECTED_ENABLED_OPTIONS)
  52  |   }
  53  | 
  54  |   async verifyFirstThematicIs (expected: string) {
> 55  |     await expect(this.select()).toBeVisible()
      |                                 ^ Error: expect(locator).toBeVisible() failed
  56  | 
  57  |     const first = this.firstOptgroup()
  58  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  59  |     await expect(first).toHaveAttribute(
  60  |       'data-testid',
  61  |       `${ActivitiesSelectNavigation.OPTGROUP_PREFIX}${expected}`,
  62  |     )
  63  |   }
  64  | 
  65  |   async verifyFirstThematicHasAtLeastOneActivity () {
  66  |     await expect(this.select()).toBeVisible()
  67  | 
  68  |     const first = this.firstOptgroup()
  69  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  70  | 
  71  |     const options = first.locator('option:not([disabled])')
  72  |     const count = await options.count()
  73  |     expect(count, 'Expected at least 1 enabled option in first optgroup').toBeGreaterThan(0)
  74  |   }
  75  | 
  76  |   async verifyFirstActivityTitleOfFirstThematic (expectedTitle: string) {
  77  |     await expect(this.select()).toBeVisible()
  78  | 
  79  |     const first = this.firstOptgroup()
  80  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  81  | 
  82  |     const firstOption = first.locator('option:not([disabled])').first()
  83  |     await expect(firstOption, 'Expected at least 1 option in first optgroup').toHaveCount(1)
  84  | 
  85  |     const label = await this.readOptionLabel(firstOption)
  86  |     expect(label, 'First activity label mismatch in first optgroup').toContain(expectedTitle)
  87  |   }
  88  | 
  89  |   async verifyLastActivityTitleOfFirstThematic (expectedTitle: string) {
  90  |     await expect(this.select()).toBeVisible()
  91  | 
  92  |     const first = this.firstOptgroup()
  93  |     await expect(first, 'Expected at least 1 optgroup in select navigation').toHaveCount(1)
  94  | 
  95  |     const lastOption = first.locator('option:not([disabled])').last()
  96  |     await expect(lastOption, 'Expected at least 1 option in first optgroup').toHaveCount(1)
  97  | 
  98  |     const label = await this.readOptionLabel(lastOption)
  99  |     expect(label, 'Last activity label mismatch in first optgroup').toContain(expectedTitle)
  100 |   }
  101 | 
  102 |   async selectSecondActivityOfThematic (thematic: string) {
  103 |     const select = this.select()
  104 |     await expect(select).toBeVisible()
  105 | 
  106 |     const group = this.optgroup(thematic)
  107 |     await expect(group, `Missing optgroup for thematic: ${thematic}`).toHaveCount(1)
  108 | 
  109 |     const options = this.enabledOptionsInThematic(thematic)
  110 |     const count = await options.count()
  111 |     expect(
  112 |       count,
  113 |       `Thematic ${thematic} should have at least 2 activities to select the second one`,
  114 |     ).toBeGreaterThanOrEqual(2)
  115 | 
  116 |     const value = await options.nth(1).getAttribute('value')
  117 |     expect(value, `Second option in thematic ${thematic} should have a value`).toBeTruthy()
  118 | 
  119 |     await select.selectOption(value!)
  120 |   }
  121 | 
  122 |   async verifyAllExpectedThematics (expected: string[]) {
  123 |     await expect(this.select()).toBeVisible()
  124 | 
  125 |     for (const thematic of expected) {
  126 |       const group = this.optgroup(thematic)
  127 |       await expect(group, `Missing optgroup for thematic: ${thematic}`).toHaveCount(1)
  128 | 
  129 |       const enabledCount = await group.locator('option:not([disabled])').count()
  130 |       expect(enabledCount, `Thematic ${thematic} should have at least 1 enabled activity`).toBeGreaterThan(0)
  131 |     }
  132 |   }
  133 | }
  134 | 
```