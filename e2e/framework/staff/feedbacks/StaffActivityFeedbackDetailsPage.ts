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
}
