import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { WritingFeedbackFloatingPanel } from '@e2e/framework/staff/feedbacks/componentObjects/WritingFeedbackFloatingPanel'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('staffActivityFeedbackDetailsPage')
export class StaffActivityFeedbackDetailsPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  private getStudentFeedbackSelect () {
    return this.page.getByTestId('student-feedback-select')
  }

  private getStudentPerspectiveCard () {
    return this.page.getByTestId('student-perspective-card')
  }

  private getStudentPerspectiveCardExpanded () {
    return this.page.locator('[data-testid="student-perspective-card"][data-collapsed="false"]')
  }

  private getFeedbackAssociatedElementsCard () {
    return this.page.getByTestId('feedback-associated-elements-card')
  }

  private getFeedbackAssociatedElementsCardExpanded () {
    return this.page.locator('[data-testid="feedback-associated-elements-card"][data-collapsed="false"]')
  }

  private getAssociatedElementCard () {
    return this.page.getByTestId('associated-element-card').first()
  }

  private getWritingFeedbackFloatingPanel () {
    return new WritingFeedbackFloatingPanel(
      this.page.getByTestId('writing-feedback-floating-panel'),
    )
  }

  @Then('the staff activity feedback details page is displayed')
  async verifyPageLoaded () {
    const expectedPattern = STAFF_ROUTES.ACTIVITY_FEEDBACK_DETAILS
      .replace(':feedbackId', '[^/]+')

    await expect(this.page).toHaveURL(new RegExp(expectedPattern))
  }

  @Then('the student feedback select is visible')
  async verifyStudentFeedbackSelectVisible () {
    await expect(this.getStudentFeedbackSelect()).toBeVisible()
  }

  @Then('the student perspective card is visible')
  async verifyStudentPerspectiveCardVisible () {
    await expect(this.getStudentPerspectiveCard()).toBeVisible()
  }

  @Then('the student perspective card is expanded by default')
  async verifyStudentPerspectiveCardExpandedByDefault () {
    await expect(this.getStudentPerspectiveCardExpanded()).toBeVisible()
  }

  @Then('the feedback associated elements card is visible')
  async verifyFeedbackAssociatedElementsCardVisible () {
    await expect(this.getFeedbackAssociatedElementsCard()).toBeVisible()
  }

  @Then('the feedback associated elements card is expanded by default')
  async verifyFeedbackAssociatedElementsCardExpandedByDefault () {
    await expect(this.getFeedbackAssociatedElementsCardExpanded()).toBeVisible()
  }

  @Then('the feedback associated elements card contains at least one element')
  async verifyAssociatedElementCardPresent () {
    await expect(this.getAssociatedElementCard()).toBeVisible()
  }

  @Then('the writing feedback floating panel is visible')
  async verifyWritingFeedbackFloatingPanelVisible () {
    await this.getWritingFeedbackFloatingPanel().verifyPanelVisible()
  }

  @When('the staff expands the writing feedback floating panel')
  async expandWritingFeedbackFloatingPanel () {
    await this.getWritingFeedbackFloatingPanel().clickExpandButton()
  }

  @Then('the writing feedback floating panel is expanded')
  async verifyWritingFeedbackFloatingPanelExpanded () {
    await this.getWritingFeedbackFloatingPanel().verifyPanelExpanded()
  }

  @Then('the writing feedback tab is visible in the expanded floating panel')
  async verifyWritingFeedbackTabVisible () {
    await this.getWritingFeedbackFloatingPanel().verifyWriteFeedbackTab()
  }

  @When('the staff cancels writing feedback in the floating panel')
  async cancelWritingFeedback () {
    await this.getWritingFeedbackFloatingPanel().clickCollapseButton()
  }

  @Then('the writing feedback floating panel is collapsed')
  async verifyWritingFeedbackFloatingPanelCollapsed () {
    await this.getWritingFeedbackFloatingPanel().verifyPanelCollapsed()
  }

  @When('the staff clicks on the history tab')
  async clickHistoryTab () {
    await this.getWritingFeedbackFloatingPanel().clickHistoryTab()
  }

  @Then('the feedbacks history tab is visible')
  async verifyFeedbacksHistoryTabVisible () {
    await this.getWritingFeedbackFloatingPanel().verifyHistoryTabVisible()
  }

  @Then('the feedbacks history tab contains at least one feedback history card')
  async verifyFeedbacksHistoryTabContainsCards () {
    await this.getWritingFeedbackFloatingPanel().verifyHistoryTabContainsAtLeastOneCard()
  }

  @Then('the first feedback history card is collapsed')
  async verifyFirstFeedbackHistoryCardCollapsed () {
    await this.getWritingFeedbackFloatingPanel().verifyHistoryTabFirstCardCollapsed()
  }

  @When('the staff expands the first feedback history card')
  async expandFirstFeedbackHistoryCard () {
    await this.getWritingFeedbackFloatingPanel().expandHistoryTabFirstCard()
  }

  @Then('the first feedback history card collapsed state is visible')
  async verifyFirstFeedbackHistoryCardCollapsedStateVisible () {
    await this.getWritingFeedbackFloatingPanel().verifyHistoryTabFirstCardCollapsedStateVisible()
  }

  @Then('the first feedback history card expanded state is visible')
  async verifyFirstFeedbackHistoryCardExpandedStateVisible () {
    await this.getWritingFeedbackFloatingPanel().verifyHistoryTabFirstCardExpandedStateVisible()
  }

  @Then('the feedbacks history tab displays feedbacks in anti-chronological order')
  async verifyFeedbacksHistoryAntiChronologicalOrder () {
    await this.getWritingFeedbackFloatingPanel().verifyHistoryTabAntiChronologicalOrder()
  }
}
