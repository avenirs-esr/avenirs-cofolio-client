import { BaseObject } from '@e2e/framework/shared/base/BaseObject'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { SubscribeActivityModal } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/SubscribeActivityModal'
import { UnsubscribeActivitiesConfirmModal } from '@e2e/framework/student/lifeProject/activitiesCatalog/componentObjects/UnsubscribeActivitiesConfirmModal'
import { expect, type Page } from '@playwright/test'

export class ActivityPreview extends BaseObject {
  constructor (protected page: Page) {
    super(page.getByTestId('activity-preview'), page)
  }

  getBanner () {
    return this.root.getByTestId('activity-banner')
  }

  getTitle () {
    return this.root.getByTestId('activity-title')
  }

  getThematicBadge () {
    return this.root.getByTestId('activity-thematic-badge')
  }

  getSummary () {
    return this.root.getByTestId('activity-summary')
  }

  getExecutionPeriodInfo () {
    return this.root.getByTestId('activity-execution-period-info')
  }

  getUnsubscribeButton () {
    return this.root.getByTestId('unsubscribe-button')
  }

  getSubscribeButton () {
    return this.root.getByTestId('subscribe-button')
  }

  getAccessButton () {
    return this.root.getByTestId('access-button')
  }

  getUnsubscribeActivitiesConfirmModal () {
    return new UnsubscribeActivitiesConfirmModal(this.page)
  }

  getSubscribeActivityModal () {
    return new SubscribeActivityModal(this.page)
  }

  async verifyVisible () {
    await this.isVisible()
    await expect(this.getBanner()).toBeVisible()
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getSummary()).toBeVisible()
    await expect(this.getExecutionPeriodInfo()).toBeVisible()
    await expect(this.getThematicBadge()).toBeVisible()
  }

  async verifyBanner () {
    await expect(this.getBanner()).toBeVisible()
    await expect(this.getBanner()).toHaveAttribute('src', /./)
  }

  async verifyTitle () {
    await expect(this.getTitle()).toBeVisible()
    await expect(this.getTitle()).not.toBeEmpty()
  }

  async verifyThematicBadge () {
    await expect(this.getThematicBadge()).toBeVisible()
    await expect(this.getThematicBadge()).not.toBeEmpty()
  }

  async verifySummary () {
    await expect(this.getSummary()).toBeVisible()
    await expect(this.getSummary()).not.toBeEmpty()
  }

  async verifyExecutionPeriodInfo () {
    await expect(this.getExecutionPeriodInfo()).toBeVisible()
    await expect(this.getExecutionPeriodInfo()).not.toBeEmpty()
  }

  async verifySubscribeButton () {
    const expectedText = t('student.buildProject.activities.buttons.subscribe')
    await expect(this.getSubscribeButton()).toBeVisible()
    await expect(this.getSubscribeButton()).toHaveText(expectedText)
  }

  async verifySubscribeButtonHidden () {
    await expect(this.getSubscribeButton()).toBeHidden()
  }

  async verifyUnsubscribeButton () {
    const expectedText = t('student.buildProject.activities.buttons.unsubscribe')
    await expect(this.getUnsubscribeButton()).toBeVisible()
    await expect(this.getUnsubscribeButton()).toHaveText(expectedText)
  }

  async verifyUnsubscribeButtonHidden () {
    await expect(this.getUnsubscribeButton()).toBeHidden()
  }

  async verifyAccessButtonVisible () {
    const expectedText = t('student.buildProject.activities.views.ProjectActivitiesCatalogView.buttons.access')
    await expect(this.getAccessButton()).toBeVisible()
    await expect(this.getAccessButton()).toHaveText(expectedText)
  }

  async verifyAccessButtonHidden () {
    await expect(this.getAccessButton()).toBeHidden()
  }

  async clickAccessButton () {
    await expect(this.getAccessButton()).toBeVisible()
    await this.getAccessButton().click()
    await waitForPageLoad(this.page)
  }

  async verify () {
    await this.verifyVisible()
    await this.verifyBanner()
    await this.verifyTitle()
    await this.verifyThematicBadge()
    await this.verifySummary()
    await this.verifyExecutionPeriodInfo()
    await this.verifySubscribeButton()
  }

  async clickSubscribeButton () {
    await this.getSubscribeButton().click()
    await waitForPageLoad(this.page)
  }

  async verifySubscribeActivityModal () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.verify()
  }

  async clickSubscribeModalConfirmButton () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.clickConfirm()
  }

  async fillSubscribeModalPeriodStartDate (date: string) {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.fillStartDate(date)
  }

  async clickSubscribeModalCancelButton () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.clickCancel()
  }

  async clickSubscribeModalCancelButtonAndConfirm () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.clickCancelAndConfirm()
  }

  async clickSubscribeModalCancelButtonAndCancel () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.clickCancelAndCancel()
  }

  async verifySubscribeActivityModalHidden () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.verifyHidden()
  }

  async verifyCancelSubscribeActivityConfirmModal () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.verifyCancelSubscribeActivityConfirmModal()
  }

  async verifyCancelSubscribeActivityConfirmModalHidden () {
    const subscribeActivityModal = this.getSubscribeActivityModal()
    await subscribeActivityModal.verifyCancelSubscribeActivityConfirmModalHidden()
  }

  async clickUnsubscribeButton () {
    await this.getUnsubscribeButton().click()
    await waitForPageLoad(this.page)
  }

  async verifyUnsubscribeActivitiesConfirmModal () {
    const unsubscribeActivitiesConfirmModal = this.getUnsubscribeActivitiesConfirmModal()
    await unsubscribeActivitiesConfirmModal.verify()
  }

  async clickUnsubscribeActivitiesConfirmModalConfirmButton () {
    const unsubscribeActivitiesConfirmModal = this.getUnsubscribeActivitiesConfirmModal()
    await unsubscribeActivitiesConfirmModal.clickConfirm()
  }
}
