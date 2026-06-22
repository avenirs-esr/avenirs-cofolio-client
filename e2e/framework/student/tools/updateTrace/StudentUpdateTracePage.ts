import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { t } from '@e2e/framework/shared/utils/i18n'
import { expect, type Page } from '@playwright/test'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

@Fixture<typeof test>('studentUpdateTracePage')
export class StudentUpdateTracePage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getAuthorTypeContainer () {
    return this.page.getByTestId('author-type')
  }

  getAuthorTypeRadioSet () {
    return this.getAuthorTypeContainer().getByTestId('trace-author-type-radio-set')
  }

  getAuthorTypeRadioButtons () {
    return this.getAuthorTypeRadioSet().getByTestId('trace-author-type-radio-button')
  }

  getUpdateTraceDetailsTab () {
    return this.page.getByTestId('update-trace-details-tab')
  }

  getUpdateTraceAssociationsTab () {
    return this.page.getByTestId('update-trace-associations-tab')
  }

  getTraceAssociationsInUpdateView () {
    return this.page.getByTestId('trace-associations')
  }

  getSaveButton () {
    return this.page.getByTestId('update-trace-main-container').getByTestId('confirm-button')
  }

  getConfirmUpdateTraceModal () {
    return this.page.getByTestId('confirm-update-trace-modal')
  }

  getConfirmUpdateTraceModalTitle () {
    return this.page.getByTestId('confirm-update-trace-modal-title')
  }

  getConfirmUpdateTraceModalSubtitle () {
    return this.page.getByTestId('confirm-update-trace-modal-subtitle')
  }

  @Then('the update trace page is loaded')
  async verifyUpdateTracePageLoaded () {
    await expect(this.page.getByTestId('update-trace-main-container')).toBeVisible()
  }

  @Then('the author type is visible and contains 3 radio buttons')
  async verifyAuthorTypeVisible () {
    await expect(this.getAuthorTypeContainer()).toBeVisible()
    await expect(this.getAuthorTypeRadioSet()).toBeVisible()
    await expect(this.getAuthorTypeRadioButtons()).toHaveCount(3)
  }

  @Then('the update trace details tab is visible and active')
  async verifyUpdateTraceDetailsTabVisibleAndActive () {
    await expect(this.getUpdateTraceDetailsTab()).toBeVisible()
    await expect(this.getUpdateTraceDetailsTab()).toHaveAttribute('aria-selected', 'true')
  }

  @Then('the update trace associations tab is visible')
  async verifyUpdateTraceAssociationsTabVisible () {
    await expect(this.getUpdateTraceAssociationsTab()).toBeVisible()
  }

  @When('the student clicks on the update trace associations tab')
  async clickUpdateTraceAssociationsTab () {
    await clickOnElement(this.getUpdateTraceAssociationsTab())
  }

  @Then('the trace associations are visible in the update view')
  async verifyTraceAssociationsVisibleInUpdateView () {
    await expect(this.getTraceAssociationsInUpdateView()).toBeVisible()
  }

  @When('the student clicks the save trace button')
  async clickSaveTraceButton () {
    await clickOnElement(this.getSaveButton())
  }

  @Then('the confirm update trace modal is visible')
  async verifyConfirmUpdateTraceModalVisible () {
    await expect(this.getConfirmUpdateTraceModal()).toBeVisible()
  }

  @Then('the confirm update trace modal title and subtitle are visible')
  async verifyConfirmUpdateTraceModalContentVisible () {
    await expect(this.getConfirmUpdateTraceModalTitle()).toHaveText(
      t('student.traces.views.StudentUpdateTraceView.ConfirmUpdateTraceModal.title')
    )
    await expect(this.getConfirmUpdateTraceModalSubtitle()).toHaveText(
      t('student.traces.views.StudentUpdateTraceView.ConfirmUpdateTraceModal.subtitle')
    )
  }
}
