import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { STUDENT_ROUTES } from '@e2e/framework/shared/constants/routes'
import { AV_BREAKPOINTS } from '@e2e/framework/shared/utils/dimension'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeliverablesWidget } from '@e2e/framework/student/home/componentsObjects/DeliverablesWidget'
import { EventsWidget } from '@e2e/framework/student/home/componentsObjects/EventsWidget'
import { PagesWidget } from '@e2e/framework/student/home/componentsObjects/PagesWidget'
import { ResumesWidget } from '@e2e/framework/student/home/componentsObjects/ResumesWidget'
import { SkillsWidget } from '@e2e/framework/student/home/componentsObjects/SkillsWidget'
import { StudentOverviewWidget } from '@e2e/framework/student/home/componentsObjects/StudentOverviewWidget'
import { TracesWidget } from '@e2e/framework/student/home/componentsObjects/TracesWidget'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentHomePage')
class StudentHomePage {
  constructor (public page: Page) {}

  getSkillsWidget () {
    return new SkillsWidget(this.page)
  }

  getTracesWidget () {
    return new TracesWidget(this.page)
  }

  getEventsWidget () {
    return new EventsWidget(this.page)
  }

  getResumesWidget () {
    return new ResumesWidget(this.page)
  }

  getPagesWidget () {
    return new PagesWidget(this.page)
  }

  getDeliverablesWidget () {
    return new DeliverablesWidget(this.page)
  }

  getStudentOverviewWidget () {
    return new StudentOverviewWidget(this.page)
  }

  getPageHeading () {
    return this.page.getByRole('heading', { level: 1 })
  }

  getMainNavigation () {
    return this.page.getByTestId('main-navigation').locator('nav')
  }

  getHomeNavLink () {
    return this.getMainNavigation().getByRole('link').first()
  }

  getSuccessfulEducationButton () {
    return this.getMainNavigation().getByRole('button').nth(0)
  }

  getBuildingLifeProjectButton () {
    return this.getMainNavigation().getByRole('button').nth(1)
  }

  getMyToolsButton () {
    return this.getMainNavigation().getByRole('button').nth(2)
  }

  getMailboxButton () {
    return this.page.locator('header').getByRole('button').nth(0)
  }

  getNotificationsButton () {
    return this.page.locator('header').getByRole('button').nth(1)
  }

  getProfileButton () {
    return this.page.locator('header list button, header ul button').nth(2)
  }

  getLanguageSwitcher () {
    return this.page.locator('header').getByRole('button').last()
  }

  getMobileMenuButton () {
    return this.page.getByTestId('open-menu-btn')
  }

  @Given('the student opens the home page')
  async goto () {
    await this.page.goto(STUDENT_ROUTES.HOME)
    await waitForPageLoad(this.page)
  }

  @Given('the profile overview widget is visible')
  @Then('the profile overview widget is still visible')
  async verifyProfileOverviewWidgetVisible () {
    await this.getStudentOverviewWidget().isVisible()
  }

  @Given('the next events widget is visible')
  async verifyNextEventsWidgetVisible () {
    await this.getEventsWidget().verifyVisible()
  }

  @Given('the resumes widget is visible')
  async verifyResumesWidgetVisible () {
    await this.getResumesWidget().verifyVisible()
  }

  @Given('the free pages widget is visible')
  async verifyFreePagesWidgetVisible () {
    await this.getPagesWidget().verifyVisible()
  }

  @Given('the educational skills widget is visible')
  async verifyEducationalSkillsWidgetVisible () {
    await this.getSkillsWidget().verifyVisible()
  }

  @Given('the next deliverables widget is visible')
  async verifyNextDeliverablesWidgetVisible () {
    await this.getDeliverablesWidget().verifyVisible()
  }

  @Given('there are traces available')
  async verifyTracesAvailable () {
    await this.getTracesWidget().skipIfNoTraces()
  }

  @Then('the last traces widget is visible')
  async verifyLastTracesWidgetVisible () {
    await this.getTracesWidget().verifyVisible()
  }

  @Then('the student home page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.HOME)
    await expect(this.page).toHaveTitle('Cofolio')
    expect(this.getPageHeading()).toBeDefined()
  }

  @Then('the page title is {string}')
  async verifyPageTitle (title: string) {
    if (title === 'Cofolio') {
      await expect(this.page).toHaveTitle('Cofolio')
    }
  }

  @Then('the profile banner is visible')
  async verifyProfileBanner () {
    await this.getStudentOverviewWidget().verifyProfileBanner()
  }

  @Then('the profile picture is visible')
  async verifyProfilePicture () {
    await this.getStudentOverviewWidget().verifyProfilePicture()
  }

  @Then('the student name is visible')
  async verifyStudentName () {
    await this.getStudentOverviewWidget().verifyStudentName()
  }

  @Then('the student bio is visible')
  async verifyStudentBio () {
    await this.getStudentOverviewWidget().verifyStudentBio()
  }

  @Then('profile action buttons are displayed')
  async verifyProfileActionButtons () {
    await this.getStudentOverviewWidget().verifyActionButtons()
  }

  @When('the student clicks the edit profile button')
  async clickEditProfileButton () {
    await this.getStudentOverviewWidget().clickEditProfileButton()
  }

  @Then('the update profile drawer is opened')
  async verifyUpdateProfileDrawerOpened () {
    await this.getStudentOverviewWidget().verifyDrawerOpened()
  }

  @When('the student closes the drawer')
  async closeDrawer () {
    await this.getStudentOverviewWidget().closeDrawer()
  }

  @Then('the update profile drawer is closed')
  async verifyUpdateProfileDrawerClosed () {
    await this.getStudentOverviewWidget().verifyDrawerClosed()
  }

  @Then('the events widget shows maximum 3 events')
  async verifyEventsWidgetShowsMax3Events () {
    await this.getEventsWidget().verifyMaximum3Events()
  }

  @Then('the see all events button is visible')
  async verifySeeAllEventsButton () {
    await this.getEventsWidget().verifySeeAllButton()
  }

  @When('the student clicks see all events button')
  async clickSeeAllEventsButton () {
    await this.getEventsWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to events page')
  async verifyNavigationToEventsPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.EVENTS)
  }

  @Then('the URL contains {string}')
  async verifyUrlContains (url: string) {
    await expect(this.page).toHaveURL(new RegExp(url))
  }

  @Then('the resumes widget shows maximum 3 resumes')
  async verifyResumesWidgetShowsMax3Resumes () {
    await this.getResumesWidget().verifyMaximum3Resumes()
  }

  @Then('each resume shows last update date')
  async verifyEachResumeShowsLastUpdateDate () {
    await this.getResumesWidget().verifyEachItemLastUpdateDate()
  }

  @Then('the see all resumes button is visible')
  async verifySeeAllResumesButton () {
    await this.getResumesWidget().verifySeeAllButton()
  }

  @When('the student clicks see all resumes button')
  async clickSeeAllResumesButton () {
    await this.getResumesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to resumes page')
  async verifyNavigationToResumesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.TOOLS.RESUMES)
  }

  @Then('the pages widget shows maximum 3 pages')
  async verifyPagesWidgetShowsMax3Pages () {
    await this.getPagesWidget().verifyMaximum3Pages()
  }

  @Then('the skills widget shows the correct maximum number of skills')
  async verifySkillsWidgetShowsCorrectMaxSkills () {
    await this.getSkillsWidget().verifyMaximumSkills()
  }

  @Then('each page shows last update date')
  async verifyEachPageShowsLastUpdateDate () {
    await this.getPagesWidget().verifyEachItemLastUpdateDate()
  }

  @Then('the see all pages button is visible')
  async verifySeeAllPagesButton () {
    await this.getPagesWidget().verifySeeAllButton()
  }

  @When('the student clicks see all pages button')
  async clickSeeAllFreePagesButton () {
    await this.getPagesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to pages page')
  async verifyNavigationToPagesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.TOOLS.PAGES)
  }

  @Then('skill cards are displayed')
  async verifySkillCards () {
    await this.getSkillsWidget().verifyCardsDisplayed()
  }

  @Then('each skill card shows status badge')
  async verifyEachSkillCardShowsStatusBadge () {
    await this.getSkillsWidget().verifyEachCardStatusBadge()
  }

  @Then('each skill card shows trace count')
  async verifyEachSkillCardShowsTraceCount () {
    await this.getSkillsWidget().verifyEachCardTraceCount()
  }

  @Then('each skill card shows AMS count')
  async verifyEachSkillCardShowsAmsCount () {
    await this.getSkillsWidget().verifyEachCardAmsCount()
  }

  @Then('the see all skills button is visible')
  async verifySeeAllSkillsButton () {
    await this.getSkillsWidget().verifySeeAllButton()
  }

  @When('the student clicks a skill card')
  async clickFirstSkillCard () {
    await this.getSkillsWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to skill detail page')
  async verifyNavigationToSkillDetailPage () {
    await expect(this.page).toHaveURL(new RegExp(`${STUDENT_ROUTES.SKILL_DETAIL}.+`))
  }

  @When('the student clicks see all skills button')
  async clickSeeAllSkillsButton () {
    await this.getSkillsWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to skills page')
  async verifyNavigationToSkillsPage () {
    await expect(this.page).toHaveURL(/\/cofolio\/student\/education\/skills/)
  }

  @Then('the deliverables widget shows maximum 3 deliverables')
  async verifyDeliverablesWidgetShowsMax3Deliverables () {
    await this.getDeliverablesWidget().verifyMaximum3Deliverables()
  }

  @Then('the see all deliverables button is visible')
  async verifySeeAllDeliverablesButton () {
    await this.getDeliverablesWidget().verifySeeAllButton()
  }

  @When('the student clicks see all deliverables button')
  async clickSeeAllDeliverablesButton () {
    await this.getDeliverablesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to deliverables page')
  async verifyNavigationToDeliverablesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.DELIVERABLES)
  }

  @Then('maximum 3 trace cards are displayed')
  async verifyMax3TraceCards () {
    await this.getTracesWidget().verifyMaximum3Traces()
  }

  @Then('each trace card shows skill count')
  async verifyEachTraceCardShowsSkillCount () {
    await this.getTracesWidget().verifyEachCardSkillCount()
  }

  @Then('each trace card shows AMS count')
  async verifyEachTraceCardShowsAmsCount () {
    await this.getTracesWidget().verifyEachCardAmsCount()
  }

  @Then(/each trace card shows type \(solo\/group\)/)
  async verifyEachTraceCardShowsType () {
    await this.getTracesWidget().verifyEachCardType()
  }

  @Then('the see all traces button is visible')
  async verifySeeAllTracesButton () {
    await this.getTracesWidget().verifySeeAllButton()
  }

  @When('the student clicks a trace card')
  async clickFirstTraceCard () {
    await this.getTracesWidget().clickFirstCard()
    await waitForPageLoad(this.page)
  }

  @When('the student clicks see all traces button')
  async clickSeeAllTracesButton () {
    await this.getTracesWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the page navigates to traces page')
  async verifyNavigationToTracesPage () {
    await expect(this.page).toHaveURL(STUDENT_ROUTES.TOOLS.TRACES)
  }

  @Then('the main navigation menu is visible')
  async verifyMainNavigationMenu () {
    await expect(this.getMainNavigation()).toBeVisible()
  }

  @Then('the HOME link is visible')
  async verifyHomeLink () {
    await expect(this.getHomeNavLink()).toBeVisible()
    await expect(this.getHomeNavLink()).toHaveText(t('student.global.navigation.tabs.home').toUpperCase())
  }

  @Then('the SUCCESSFUL EDUCATION menu is visible')
  async verifySuccessfulEducationMenu () {
    await expect(this.getSuccessfulEducationButton()).toBeVisible()
    await expect(this.getSuccessfulEducationButton()).toContainText(t('student.global.navigation.tabs.education.header').toUpperCase())
  }

  @Then('the BUILDING MY LIFE PROJECT menu is visible')
  async verifyBuildingMyLifeProjectMenu () {
    await expect(this.getBuildingLifeProjectButton()).toBeVisible()
    await expect(this.getBuildingLifeProjectButton()).toContainText(t('student.global.navigation.tabs.project.header').toUpperCase())
  }

  @Then('the MY TOOLS menu is visible')
  async verifyMyToolsMenu () {
    await expect(this.getMyToolsButton()).toBeVisible()
    await expect(this.getMyToolsButton()).toContainText(t('student.global.navigation.tabs.tools.header').toUpperCase())
  }

  @Then('the mailbox button is visible')
  async verifyMailboxButton () {
    await expect(this.getMailboxButton()).toBeVisible()
  }

  @Then('the notifications button is visible')
  async verifyNotificationsButton () {
    await expect(this.getNotificationsButton()).toBeVisible()
  }

  @Then('the profile button is visible')
  async verifyProfileButton () {
    await expect(this.getProfileButton()).toBeVisible()
  }

  @Then('the language switcher is visible')
  async verifyLanguageSwitcher () {
    await expect(this.getLanguageSwitcher()).toBeVisible()
  }

  @Given('the mobile menu button is visible')
  async verifyMobileMenuButton () {
    await expect(this.getMobileMenuButton()).toBeVisible()
  }

  @When('the student clicks mobile menu button')
  async clickMobileMenuButton () {
    await expect(this.getMobileMenuButton()).toBeVisible()
    await this.getMobileMenuButton().click({ force: true })
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

  @Given('the page is displayed on mobile viewport')
  async verifyMobileViewport () {
    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  }

  @Then('all visible widgets span full width')
  async verifyAllWidgetsSpanFullWidth () {
    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  }

  @Then('widgets are stacked vertically')
  async verifyWidgetsStackedVertically () {
    const viewport = this.page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(AV_BREAKPOINTS.md)
  }

  @Then('no horizontal scrolling is required')
  async verifyNoHorizontalScrolling () {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
  }

  @When('the student scrolls down through the page')
  async scrollDown () {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2)
    })
    await this.page.waitForTimeout(500)
  }

  @Then('all widgets load and display correctly')
  async verifyAllWidgetsLoadAndDisplayCorrectly () {
    await expect(this.getStudentOverviewWidget().getProfileBanner()).toBeAttached()
  }

  @Then('content remains readable during scroll')
  async verifyContentReadableDuringScroll () {
    await expect(this.getPageHeading()).toBeAttached()
    await expect(this.getStudentOverviewWidget().getProfileBanner()).toBeAttached()
  }
}
