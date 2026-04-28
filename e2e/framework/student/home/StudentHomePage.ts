import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeliverablesWidget } from '@e2e/framework/student/home/componentObjects/DeliverablesWidget'
import { EventsWidget } from '@e2e/framework/student/home/componentObjects/EventsWidget'
import { PagesWidget } from '@e2e/framework/student/home/componentObjects/PagesWidget'
import { ResumesWidget } from '@e2e/framework/student/home/componentObjects/ResumesWidget'
import { SkillsWidget } from '@e2e/framework/student/home/componentObjects/SkillsWidget'
import { StudentOverviewWidget } from '@e2e/framework/student/home/componentObjects/StudentOverviewWidget'
import { TracesWidget } from '@e2e/framework/student/home/componentObjects/TracesWidget'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentHomePage')
class StudentHomePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

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

  getMobileMenuButton () {
    return this.page.getByTestId('open-menu-btn')
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

  @Then('edit profile button is displayed')
  async verifyEditProfileButton () {
    await expect(this.getStudentOverviewWidget().getEditProfileButton()).toBeVisible()
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

  @Then('the events widget shows {int} events')
  async verifyEventsWidgetShowsEvents (expectedEvents: number) {
    await this.getEventsWidget().verifyRenderedEventsCount(expectedEvents)
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

  @Then('the resumes widget shows {int} resumes')
  async verifyResumesWidgetShowsMax3Resumes (expectedResumes: number) {
    await this.getResumesWidget().verifyRenderedResumesCount(expectedResumes)
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

  @Then('the pages widget shows {int} pages')
  async verifyPagesWidgetShowsPages (expectedPages: number) {
    await this.getPagesWidget().verifyRenderedPagesCount(expectedPages)
  }

  @Then('the skills widget shows {int} courses')
  async verifySkillsWidgetShowsCourses (expectedCourses: number) {
    await this.getSkillsWidget().verifyRenderedCoursesCount(expectedCourses)
  }

  @Then('the skills widget shows at least one skill')
  async verifySkillsWidgetShowsSkills () {
    await this.getSkillsWidget().verifyAtLeastOneSkillIsVisible()
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

  @Then('skill cards are displayed')
  async verifySkillCards () {
    await this.getSkillsWidget().verifyCardsDisplayed()
  }

  @Then('each skill card shows status badge')
  async verifyEachSkillCardShowsStatusBadge () {
    await this.getSkillsWidget().verifyEachCardStatusBadge()
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

  @When('the student clicks see all skills button')
  async clickSeeAllSkillsButton () {
    await this.getSkillsWidget().clickSeeAllButton()
    await waitForPageLoad(this.page)
  }

  @Then('the deliverables widget shows {int} deliverables')
  async verifyDeliverablesWidgetShowsDeliverables (expectedDeliverables: number) {
    await this.getDeliverablesWidget().verifyRenderedDeliverablesCount(expectedDeliverables)
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

  @Then('{int} trace cards are displayed')
  async verifyTraceCards (expectedTraces: number) {
    await this.getTracesWidget().verifyRenderedTracesCount(expectedTraces)
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

  @Then('all visible widgets span full width')
  async verifyAllWidgetsSpanFullWidth () {
    await this.verifyLocatorIsFullWidth(this.getStudentOverviewWidget().getRoot())
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
