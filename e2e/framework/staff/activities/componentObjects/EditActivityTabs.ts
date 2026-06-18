import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Page } from '@playwright/test'

export class EditActivityTabs {
  constructor (private page: Page) {}

  private getTabs () {
    return this.page.getByTestId('add-national-activity-tabs')
  }

  private getThematicSelect () {
    return this.page.getByTestId('thematic-select-form-field')
  }

  private getActivityConsignFormField () {
    return this.page.getByTestId('activity-consign-form-field')
  }

  private getReflectionToggle () {
    return this.page.getByTestId('reflection-parameter-toggle')
  }

  private getToggle () {
    return this.page.getByTestId('trace-allowed-associations-toggle')
  }

  private getContextSection () {
    return this.page.getByTestId('activity-execution-period-input')
  }

  private getSummarySection () {
    return this.page.getByTestId('activity-summary-input')
  }

  private getActivityBannerFormField () {
    return this.page.getByTestId('activity-banner-form-field')
  }

  private getPublishButton () {
    return this.page.getByTestId('publish-button')
  }

  private getPublishConfirmationModal () {
    return this.page.getByTestId('publish-confirmation-modal')
  }

  private getPublishCancelButton () {
    return this.page.getByTestId('publish-confirmation-modal').getByTestId('cancel-button')
  }

  private getPublishConfirmButton () {
    return this.page.getByTestId('publish-confirmation-modal').getByTestId('confirm-button')
  }

  private getContentTab () {
    return this.getTabs().getByTestId('activity-content-tab-item')
  }

  private getContentTabPanel () {
    return this.getTabs().getByTestId('activity-content-tab')
  }

  private getPublicationTab () {
    return this.getTabs().getByTestId('activity-publication-tab-item')
  }

  private getPublicationTabPanel () {
    return this.getTabs().getByTestId('activity-publication-tab-content')
  }

  async verifyContentTabActiveByDefault () {
    await expect(this.getContentTab()).toHaveAttribute('aria-selected', 'true')
    await expect(this.getContentTabPanel()).toBeVisible()
  }

  async clickPublicationTab () {
    await clickOnElement(this.getPublicationTab())
  }

  async verifyPublicationTabActive () {
    await expect(this.getPublicationTab()).toHaveAttribute('aria-selected', 'true')
    await expect(this.getPublicationTabPanel()).toBeVisible()
  }

  async verifyThematicSelectVisible () {
    await expect(this.getThematicSelect()).toBeVisible()
  }

  async verifyReflectionToggleVisible () {
    await expect(this.getReflectionToggle()).toBeVisible()
  }

  async verifyToggleVisible () {
    await expect(this.getToggle()).toBeVisible()
  }

  async verifyActivityConsignFormFieldCollapsed () {
    await expect(this.getActivityConsignFormField()).not.toBeVisible()
  }

  async verifyContextSectionCollapsed () {
    await expect(this.getContextSection()).not.toBeVisible()
  }

  async verifyContextSectionVisible () {
    await expect(this.getContextSection()).toBeVisible()
  }

  async verifySummarySectionVisible () {
    await expect(this.getSummarySection()).toBeVisible()
  }

  async verifyActivityBannerFormFieldVisible () {
    await expect(this.getActivityBannerFormField()).toBeVisible()
  }

  private getFeedbackCard () {
    return this.page.getByTestId('feedback-parameter-toggle')
  }

  private getFeedbackMainToggle () {
    return this.page.getByTestId('feedback-main-toggle')
  }

  private getFeedbackMainToggleLabel () {
    return this.page.getByTestId('feedback-main-toggle-label')
  }

  private getFeedbackInfinityToggle () {
    return this.page.getByTestId('feedback-infinity-toggle-input')
  }

  private getFeedbackInfinityToggleLabel () {
    return this.page.getByTestId('feedback-infinity-toggle-input-label')
  }

  private getFeedbackMaxInputContainer () {
    return this.page.getByTestId('feedback-allowed-iterations-input')
  }

  async verifyFeedbackCardVisible () {
    await expect(this.getFeedbackCard()).toBeVisible()
  }

  async isFeedbackEnabled (): Promise<boolean> {
    return this.getFeedbackMainToggle().isChecked()
  }

  async ensureFeedbackEnabled () {
    const enabled = await this.isFeedbackEnabled()
    if (!enabled) {
      await clickOnElement(this.getFeedbackMainToggleLabel())
    }
  }

  async disableFeedback () {
    const enabled = await this.isFeedbackEnabled()
    if (enabled) {
      await clickOnElement(this.getFeedbackMainToggleLabel())
    }
  }

  async isInfinityFeedbackEnabled (): Promise<boolean> {
    return this.getFeedbackInfinityToggle().isChecked()
  }

  async enableInfinityFeedback () {
    const enabled = await this.isInfinityFeedbackEnabled()
    if (!enabled) {
      await clickOnElement(this.getFeedbackInfinityToggleLabel())
    }
  }

  async disableInfinityFeedback () {
    const enabled = await this.isInfinityFeedbackEnabled()
    if (enabled) {
      await clickOnElement(this.getFeedbackInfinityToggleLabel())
    }
  }

  async verifyFeedbackMaxInputVisible () {
    await expect(this.getFeedbackMaxInputContainer()).toBeVisible()
  }

  async verifyFeedbackMaxInputHidden () {
    await expect(this.getFeedbackMaxInputContainer()).toBeHidden()
  }

  async verifyPublishButtonVisible () {
    await expect(this.getPublishButton()).toBeVisible()
  }

  async verifyPublishButtonEnabled () {
    await expect(this.getPublishButton()).toBeEnabled()
  }

  async clickPublishButton () {
    await clickOnElement(this.getPublishButton())
  }

  async verifyPublishConfirmationModalVisible () {
    await expect(this.getPublishConfirmationModal()).toBeVisible()
  }

  async verifyPublishConfirmationModalNotVisible () {
    await expect(this.getPublishConfirmationModal()).not.toBeVisible()
  }

  async verifyPublishConfirmButtonVisible () {
    await expect(this.getPublishConfirmButton()).toBeVisible()
  }

  async verifyPublishCancelButtonVisible () {
    await expect(this.getPublishCancelButton()).toBeVisible()
  }

  async clickPublishCancelButton () {
    await clickOnElement(this.getPublishCancelButton())
  }
}
