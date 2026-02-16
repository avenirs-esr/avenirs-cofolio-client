import type { Page } from '@playwright/test'
import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'

export class StudentLayout extends BaseObject {
  constructor (protected page: Page) {
    super(page.locator('header'), page)
  }

  getMainNavigation () {
    return this.root.getByTestId('main-navigation').locator('nav')
  }

  getHomeNavLink () {
    return this.getMainNavigation().getByRole('link', {
      name: t('student.global.navigation.tabs.home').toUpperCase(),
    })
  }

  getSuccessfulEducationButton () {
    return this.getMainNavigation().getByRole('button', {
      name: t('student.global.navigation.tabs.education.header').toUpperCase(),
    })
  }

  getBuildingLifeProjectButton () {
    return this.getMainNavigation().getByRole('button', {
      name: t('student.global.navigation.tabs.project.header').toUpperCase(),
    })
  }

  getProjectActivitiesLink () {
    return this.getMainNavigation().getByRole('link', {
      name: t('student.global.navigation.tabs.project.items.activities'),
    })
  }

  getMyToolsButton () {
    return this.getMainNavigation().getByRole('button', {
      name: t('student.global.navigation.tabs.tools.header').toUpperCase(),
    })
  }

  getMailboxButton () {
    return this.root.getByTestId('mailbox-button').getByRole('button')
  }

  getNotificationsButton () {
    return this.root.getByTestId('notifications-button').getByRole('button')
  }

  getProfileButton () {
    return this.root.getByTestId('profile-button').getByRole('button')
  }

  getLanguageSwitcher () {
    return this.root.locator('#language-selector')
  }

  getMobileMenuButton () {
    return this.root.getByTestId('open-menu-btn')
  }
}
