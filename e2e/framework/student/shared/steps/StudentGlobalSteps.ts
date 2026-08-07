import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { StudentLayout } from '@e2e/framework/student/shared/componentObjects/StudentLayout'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentGlobalSteps')
class StudentGlobalSteps extends BasePage {
  private layout: StudentLayout

  constructor (page: Page) {
    super(page)
    this.layout = new StudentLayout(page)
  }

  @Then('the student home page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.HOME)
  }

  @Given('the student opens the home page')
  async goToHomePage () {
    await this.page.goto(STUDENT_ROUTES.HOME)
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to traces page')
  async verifyNavigationToTracesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.TOOLS.TRACES)
  }

  @Then('the page navigates to trace detail page')
  async verifyNavigationToTraceDetailPage () {
    await expect(this.page).toHaveURL(new RegExp(`${STUDENT_ROUTES.TRACE_DETAIL}.+`))
  }

  @Then('the main navigation menu is visible')
  async verifyMainNavigationMenu () {
    await expect(this.layout.getMainNavigation()).toBeVisible()
  }

  @Then('the HOME link is visible')
  async verifyHomeLink () {
    await expect(this.layout.getHomeNavLink()).toBeVisible()
    await expect(this.layout.getHomeNavLink()).toHaveText(t('student.global.navigation.tabs.home').toUpperCase())
  }

  @Then('the BUILDING MY LIFE PROJECT menu is visible')
  async verifyBuildingMyLifeProjectMenu () {
    await expect(this.layout.getBuildingLifeProjectButton()).toBeVisible()
    await expect(this.layout.getBuildingLifeProjectButton()).toContainText(t('student.global.navigation.tabs.project.header').toUpperCase())
  }

  @When('the user clicks on the BUILDING MY LIFE PROJECT menu')
  async openBuildingLifeProjectSubmenu () {
    await this.layout.getBuildingLifeProjectButton().click()
  }

  @Then('the PROJECT MY ACTIVITIES link is visible')
  async verifyProjectActivitiesLinkVisible () {
    await expect(this.layout.getProjectActivitiesLink()).toBeVisible()
  }

  @When('the user click on the PROJECT MY ACTIVITIES link')
  async clickMyActivitiesLink () {
    await this.layout.getProjectActivitiesLink().click()
  }

  @Then('the page navigates to project my activities page')
  async verifyNavigationToProjectActivitiesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.ACTIVITIES)
  }

  @Then('the MY TOOLS menu is visible')
  async verifyMyToolsMenu () {
    await expect(this.layout.getMyToolsButton()).toBeVisible()
    await expect(this.layout.getMyToolsButton()).toContainText(t('student.global.navigation.tabs.tools.header').toUpperCase())
  }

  @Then('the mailbox button is visible')
  async verifyMailboxButton () {
    await expect(this.layout.getMailboxButton()).toBeVisible()
  }

  @Then('the notifications button is visible')
  async verifyNotificationsButton () {
    await expect(this.layout.getNotificationsButton()).toBeVisible()
  }

  @Then('the profile button is visible')
  async verifyProfileButton () {
    await expect(this.layout.getProfileButton()).toBeVisible()
  }

  @Then('the language switcher is visible')
  async verifyLanguageSwitcher () {
    await expect(this.layout.getLanguageSwitcher()).toBeVisible()
  }

  @Given('the mobile menu button is visible')
  async verifyMobileMenuButton () {
    await expect(this.layout.getMobileMenuButton()).toBeVisible()
  }

  @When('the student clicks mobile menu button')
  async clickMobileMenuButton () {
    await expect(this.layout.getMobileMenuButton()).toBeVisible()
    await this.layout.getMobileMenuButton().click()
    await this.page.waitForTimeout(500)
  }

  @Then('the navigation drawer opens')
  async verifyNavigationDrawer () {
    const drawer = this.page.getByRole('dialog', { name: 'Menu' })
    await expect(drawer).toBeVisible()
  }

  @Then('all navigation items are visible in drawer')
  async verifyAllNavigationItemsInDrawer () {
    const drawer = this.page.locator('.av-drawer, [role="dialog"]')
    await expect(drawer.getByRole('link').first()).toBeVisible()
  }

  @Given('the student opens the project activities page')
  async goToProjectActivitiesPage () {
    await this.page.goto(STUDENT_ROUTES.PROJECT.ACTIVITIES)
    await waitForPageLoad(this.page)
  }

  @Then('the student project activities page is displayed')
  async verifyNavigationToActivitiesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.ACTIVITIES)
  }

  @Then('the student project activities page is displayed on library tab')
  async verifyNavigationToActivitiesPageOnLibraryTab () {
    await expect(this.page).toHaveURL(new RegExp(`${STUDENT_ROUTES.PROJECT.ACTIVITIES}.+`))
  }

  @Then('the activity details page is displayed')
  async verifyNavigationToHomeActivityDetailsPage () {
    await expect(this.page).toHaveURL(new RegExp(`${STUDENT_ROUTES.ACTIVITY}.+`))
  }

  @Given('the student opens the project personal career experiences page')
  async goToProjectPersonalCareerExperiencesPage () {
    await this.page.goto(STUDENT_ROUTES.PROJECT.PERSONAL_CAREER.EXPERIENCES)
    await waitForPageLoad(this.page)
  }

  @Then('the student project personal career experiences page is displayed')
  async verifyNavigationToProjectPersonalCareerExperiencesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.PERSONAL_CAREER.EXPERIENCES)
  }

  @Given('the student opens the tools kit page')
  async goToToolsKitPage () {
    await this.page.goto(STUDENT_ROUTES.TOOLS.KIT)
    await waitForPageLoad(this.page)
  }

  @Then('the student tools kit page is displayed')
  async verifyNavigationToToolsKitPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.TOOLS.KIT)
  }

  @Given('the student opens the tools traces page')
  async goToToolsTracesPage () {
    await this.page.goto(STUDENT_ROUTES.TOOLS.TRACES)
    await waitForPageLoad(this.page)
  }

  @Then('the student tools traces page is displayed')
  async verifyNavigationToToolsTracesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.TOOLS.TRACES)
  }

  @Given('the student opens the skills page')
  async goToSkillsPage () {
    await this.page.goto(STUDENT_ROUTES.PROJECT.SKILLS)
    await waitForPageLoad(this.page)
  }

  @Then('the student skills page is displayed')
  async verifyNavigationToProjectSkillsPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.PROJECT.SKILLS)
  }
}
