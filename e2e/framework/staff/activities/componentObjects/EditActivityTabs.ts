import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { expect, type Locator, type Page } from '@playwright/test'

export class EditActivityTabs {
  constructor (private readonly page: Page) {}

  private getTabs () {
    return this.page.getByTestId('add-national-activity-tabs')
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

  private getThematicSelect () {
    return this.page.getByTestId('thematic-select-form-field')
  }

  private getActivityConsignFormField () {
    return this.page.getByTestId('activity-consign-form-field')
  }

  private getReflectionToggle () {
    return this.page.getByTestId('reflection-parameter-toggle')
  }

  private getTraceAllowedAssociationsToggle () {
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

  private getFeedbackCard () {
    return this.page.getByTestId('feedback-parameter-toggle')
  }

  private getFeedbackMainToggle () {
    return this.getFeedbackCard().locator('#feedback-main-toggle')
  }

  private getFeedbackMainToggleLabel () {
    return this.getFeedbackCard().locator(
      'label[for="feedback-main-toggle"]',
    )
  }

  private getFeedbackInfinityToggle () {
    return this.getFeedbackCard().locator(
      '#feedback-infinity-toggle-input',
    )
  }

  private getFeedbackInfinityToggleLabel () {
    return this.getFeedbackCard().locator(
      'label[for="feedback-infinity-toggle-input"]',
    )
  }

  private getFeedbackMaxInput () {
    return this.getFeedbackCard().getByTestId(
      'feedback-allowed-iterations-input',
    )
  }

  private getPublishButton () {
    return this.page.getByTestId('publish-button')
  }

  private getPublishConfirmationModal () {
    return this.page.getByTestId('publish-confirmation-modal')
  }

  private getPublishCancelButton () {
    return this.getPublishConfirmationModal().getByTestId('cancel-button')
  }

  private getPublishConfirmButton () {
    return this.getPublishConfirmationModal().getByTestId('confirm-button')
  }

  private async setToggleState (
    toggle: Locator,
    label: Locator,
    checked: boolean,
  ) {
    await expect(toggle).toBeAttached()

    const isChecked = await toggle.isChecked()

    if (isChecked === checked) {
      return
    }

    await clickOnElement(label)

    if (checked) {
      await expect(toggle).toBeChecked()
    }
    else {
      await expect(toggle).not.toBeChecked()
    }
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
    await expect(this.getTraceAllowedAssociationsToggle()).toBeVisible()
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

  async verifyFeedbackCardVisible () {
    await expect(this.getFeedbackCard()).toBeVisible()
  }

  async ensureFeedbackEnabled () {
    await this.setToggleState(
      this.getFeedbackMainToggle(),
      this.getFeedbackMainToggleLabel(),
      true,
    )
  }

  async disableFeedback () {
    await this.setToggleState(
      this.getFeedbackMainToggle(),
      this.getFeedbackMainToggleLabel(),
      false,
    )

    await expect(this.getFeedbackInfinityToggle()).not.toBeAttached()
    await expect(this.getFeedbackMaxInput()).not.toBeAttached()
  }

  async enableInfinityFeedback () {
    await this.setToggleState(
      this.getFeedbackInfinityToggle(),
      this.getFeedbackInfinityToggleLabel(),
      true,
    )

    await expect(this.getFeedbackMaxInput()).not.toBeAttached()
  }

  async disableInfinityFeedback () {
    await this.setToggleState(
      this.getFeedbackInfinityToggle(),
      this.getFeedbackInfinityToggleLabel(),
      false,
    )

    await expect(this.getFeedbackMaxInput()).toBeVisible()
  }

  async verifyFeedbackMaxInputVisible () {
    await expect(this.getFeedbackMaxInput()).toBeVisible()
  }

  async verifyFeedbackMaxInputHidden () {
    await expect(this.getFeedbackMaxInput()).not.toBeAttached()
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
