import type { Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'

export class StaffLayout extends BaseObject {
  constructor (protected page: Page) {
    super(page.locator('header'), page)
  }

  getMainNavigation () {
    return this.root.getByTestId('main-navigation').locator('nav')
  }

  getHomeNavLink () {
    return this.getMainNavigation().locator(`[data-testid="nav-router-link"][href="${STAFF_ROUTES.HOME}"]`)
  }
}
