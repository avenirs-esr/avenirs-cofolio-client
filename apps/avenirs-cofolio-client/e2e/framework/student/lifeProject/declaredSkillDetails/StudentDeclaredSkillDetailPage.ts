import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { t } from '@e2e/framework/shared/utils/i18n'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeclaredSkillAssociationsObject } from '@e2e/framework/student/lifeProject/declaredSkillDetails/componentObjects/DeclaredSkillAssociationsObject'
import { expect } from '@playwright/test'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('studentDeclaredSkillDetailPage')
class StudentDeclaredSkillDetailPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getSkillAssociationsTabItem () {
    return this.page.getByTestId('skill-associations-tab-item')
  }

  getDeclaredSkillAssociations () {
    return new DeclaredSkillAssociationsObject(this.page.getByTestId('declared-skill-associations'))
  }

  getManageDropDownTrigger () {
    return this.page.getByTestId('manage-entity-dropdown').getByRole('button')
  }

  getAssociationTypeSelect () {
    return this.page.getByTestId('association-type-select')
  }

  getTypeOption (type: string) {
    return this.page.locator(`label[for="select-collapse-options-list-${type}-checkbox"]`)
  }

  getDissociateActionItem () {
    return this.page.getByText(t('global.buttons.dissociate'), { exact: true })
  }

  getDeleteAssociationsModal () {
    return this.page.getByTestId('delete-associations-modal')
  }

  @When('the student opens the declared skill associations tab')
  async clickAssociationsTab () {
    await this.getSkillAssociationsTabItem().click()
    await waitForPageLoad(this.page)
  }

  @Then('the declared skill associations are loaded')
  async verifyAssociationsLoaded () {
    await this.getDeclaredSkillAssociations().verifyVisible()
  }

  @Then('the trace associations card is visible')
  async verifyTracesCardVisible () {
    await this.getDeclaredSkillAssociations().verifyTracesCardVisible()
  }

  @Then('the trace associations title is defined')
  async verifyTracesCardTitleDefined () {
    await this.getDeclaredSkillAssociations().verifyTracesCardTitleDefined()
  }

  @When('the student expands the trace associations card')
  async expandTracesCard () {
    await this.getDeclaredSkillAssociations().expandTracesCard()
  }

  @Then('the trace association items are not empty')
  async verifyTraceItemsNotEmpty () {
    await this.getDeclaredSkillAssociations().verifyTraceItemsNotEmpty()
  }

  @Then('each trace association item has a defined title')
  async verifyAllTraceItemsHaveTitles () {
    await this.getDeclaredSkillAssociations().verifyAllTraceItemsHaveTitles()
  }

  @Then('the activity associations card is visible')
  async verifyActivitiesCardVisible () {
    await this.getDeclaredSkillAssociations().verifyActivitiesCardVisible()
  }

  @Then('the activity associations title is defined')
  async verifyActivitiesCardTitleDefined () {
    await this.getDeclaredSkillAssociations().verifyActivitiesCardTitleDefined()
  }

  @When('the student expands the activity associations card')
  async expandActivitiesCard () {
    await this.getDeclaredSkillAssociations().expandActivitiesCard()
  }

  @Then('the activity association items are not empty')
  async verifyActivityItemsNotEmpty () {
    await this.getDeclaredSkillAssociations().verifyActivityItemsNotEmpty()
  }

  @Then('each activity association item has a defined title')
  async verifyAllActivityItemsHaveTitles () {
    await this.getDeclaredSkillAssociations().verifyAllActivityItemsHaveTitles()
  }

  @When('the student opens the manage declared skill dropdown')
  async openManageDropdown () {
    await clickOnElement(this.getManageDropDownTrigger())
  }

  @When('the student clicks the dissociate action')
  async clickDissociateAction () {
    await clickOnElement(this.getDissociateActionItem())
    await waitForPageLoad(this.page)
  }

  @When('the student selects the activities type in the association type select')
  async selectActivityTypeInDeleteModal () {
    await clickOnElement(this.getAssociationTypeSelect())
    await this.page.locator('label[for="select-collapse-options-list-DECLARED_ACTIVITY-checkbox"]').waitFor({ state: 'visible' })
    await clickOnElement(this.getTypeOption('DECLARED_ACTIVITY'))
  }

  @Then('the delete associations modal is visible')
  async verifyDeleteAssociationsModalVisible () {
    await expect(this.getDeleteAssociationsModal()).toBeVisible()
  }

  @Then('the delete associations modal is hidden')
  async verifyDeleteAssociationsModalHidden () {
    await expect(this.getDeleteAssociationsModal()).toBeHidden()
  }

  @Then('the delete associations modal contains items to delete')
  async verifyDeleteAssociationsModalItemsNotEmpty () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsModalItemsNotEmpty()
  }

  @Then('the delete associations modal confirm button is visible')
  async verifyDeleteAssociationsModalConfirmButtonVisible () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsModalConfirmButtonVisible()
  }

  @Then('the delete associations modal cancel button is visible')
  async verifyDeleteAssociationsModalCancelButtonVisible () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsModalCancelButtonVisible()
  }

  @When('the student cancels the delete associations modal')
  async cancelDeleteAssociationsModal () {
    await this.getDeclaredSkillAssociations().cancelDeleteAssociationsModal()
  }

  @When('the student selects the first activity to delete')
  async selectFirstDeleteAssociationsModalItem () {
    await this.getDeclaredSkillAssociations().selectFirstDeleteAssociationsModalItem()
  }

  @When('the student confirms the delete associations modal')
  async confirmDeleteAssociationsModal () {
    await this.getDeclaredSkillAssociations().confirmDeleteAssociationsModal()
  }

  @Then('the delete associations confirmation modal is visible')
  async verifyDeleteAssociationsConfirmModalVisible () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsConfirmModalVisible()
  }

  @When('the student cancels the delete associations confirmation modal')
  async cancelDeleteAssociationsConfirmModal () {
    await this.getDeclaredSkillAssociations().cancelDeleteAssociationsConfirmModal()
  }

  @Then('the delete associations confirmation modal is hidden')
  async verifyDeleteAssociationsConfirmModalHidden () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsConfirmModalHidden()
  }
}
