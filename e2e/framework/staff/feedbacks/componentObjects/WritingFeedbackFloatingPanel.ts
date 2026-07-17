import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { FeedbacksHistoryTab } from '@e2e/framework/staff/feedbacks/componentObjects/FeedbacksHistoryTab'
import { expect, type Locator } from '@playwright/test'

export class WritingFeedbackFloatingPanel extends BaseObject {
  constructor (root: Locator) {
    super(root)
  }

  private getCollapsedPanelCard () {
    return this.root.locator('[data-testid="av-floating-panel-card"][data-collapsed="true"]')
  }

  private getCollapseButton () {
    return this.getExpandedPanelCard().locator('header').getByRole('button')
  }

  private getExpandedPanelCard () {
    return this.root.locator('[data-testid="av-floating-panel-card"][data-collapsed="false"]')
  }

  private getExpandButton () {
    return this.getCollapsedPanelCard().locator('header').getByRole('button')
  }

  private getHistoryTabButton () {
    return this.getExpandedPanelCard().getByTestId('history-tab-button')
  }

  private getFeedbacksHistoryTab () {
    return new FeedbacksHistoryTab(
      this.getExpandedPanelCard().getByTestId('feedbacks-history-tab'),
    )
  }

  private async getWriteFeedbackTab () {
    const writeFeedbackTab = this.getExpandedPanelCard().getByTestId('write-feedback-tab')
    await expect(writeFeedbackTab).toBeVisible()
    return writeFeedbackTab
  }

  private async verifyWriteFeedbackTabVisible () {
    await expect(await this.getWriteFeedbackTab()).toBeVisible()
  }

  private async getWriteFeedbackForm () {
    const writeFeedbackForm = (await this.getWriteFeedbackTab()).getByTestId('write-feedback-form')
    await expect(writeFeedbackForm).toBeVisible()
    return writeFeedbackForm
  }

  private async verifyWriteFeedbackFormVisible () {
    await expect(await this.getWriteFeedbackForm()).toBeVisible()
  }

  private async getFeedbackFormField () {
    const feedbackFormField = (await this.getWriteFeedbackTab()).getByTestId('feedback-form-field')
    await expect(feedbackFormField).toBeVisible()
    return feedbackFormField
  }

  private async verifyFeedbackFormFieldVisible () {
    await expect(await this.getFeedbackFormField()).toBeVisible()
  }

  private async getWriteFeedbackCancelButton () {
    const cancelButton = (await this.getWriteFeedbackTab()).getByTestId('cancel-button')
    await expect(cancelButton).toBeVisible()
    return cancelButton
  }

  private async getWriteFeedbackSendButton () {
    const sendButton = (await this.getWriteFeedbackTab()).getByTestId('confirm-button')
    await expect(sendButton).toBeVisible()
    return sendButton
  }

  async verifyPanelVisible () {
    await expect(this.root).toBeVisible()
  }

  async verifyPanelExpanded () {
    await expect(this.getExpandedPanelCard()).toBeVisible()
    await expect(this.getCollapsedPanelCard()).toBeHidden()
  }

  async verifyPanelCollapsed () {
    await expect(this.getCollapsedPanelCard()).toBeVisible()
    await expect(this.getExpandedPanelCard()).toBeHidden()
  }

  async clickCollapseButton () {
    await clickOnElement(this.getCollapseButton())
  }

  async clickExpandButton () {
    await clickOnElement(this.getExpandButton())
  }

  async verifyWriteFeedbackTab () {
    await this.verifyWriteFeedbackTabVisible()
    await this.verifyWriteFeedbackFormVisible()
    await this.verifyFeedbackFormFieldVisible()
    await expect(await this.getWriteFeedbackCancelButton()).toBeVisible()
    await expect(await this.getWriteFeedbackSendButton()).toBeVisible()
  }

  async clickHistoryTab () {
    await clickOnElement(this.getHistoryTabButton())
  }

  async verifyHistoryTabVisible () {
    await this.getFeedbacksHistoryTab().verifyVisible()
  }

  async verifyHistoryTabContainsAtLeastOneCard () {
    await this.getFeedbacksHistoryTab().verifyContainsAtLeastOneCard()
  }

  async verifyHistoryTabFirstCardCollapsed () {
    await this.getFeedbacksHistoryTab().verifyFirstCardCollapsed()
  }

  async verifyHistoryTabFirstCardCollapsedStateVisible () {
    await this.getFeedbacksHistoryTab().verifyFirstCardCollapsedStateVisible()
  }

  async verifyHistoryTabFirstCardExpandedStateVisible () {
    await this.getFeedbacksHistoryTab().verifyFirstCardExpandedStateVisible()
  }

  async expandHistoryTabFirstCard () {
    await this.getFeedbacksHistoryTab().expandFirstCard()
  }

  async verifyHistoryTabAntiChronologicalOrder () {
    await this.getFeedbacksHistoryTab().verifyAntiChronologicalOrder()
  }

  async verifyFeedbackFormFieldEnabled () {
    const field = await this.getFeedbackFormField()
    await expect(field).toBeEnabled()
  }

  async verifyFeedbackFormFieldDisabled () {
    const field = await this.getFeedbackFormField()
    await expect(field).toBeDisabled()
  }

  async verifySendButtonEnabled () {
    await expect(await this.getWriteFeedbackSendButton()).toBeEnabled()
  }

  async verifySendButtonDisabled () {
    await expect(await this.getWriteFeedbackSendButton()).toBeDisabled()
  }

  async verifyCancelButtonEnabled () {
    await expect(await this.getWriteFeedbackCancelButton()).toBeEnabled()
  }
}
