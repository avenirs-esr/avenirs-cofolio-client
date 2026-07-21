import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { DeclaredSkillAssociationsObject } from '@e2e/framework/student/lifeProject/declaredSkillDetails/componentObjects/DeclaredSkillAssociationsObject'
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

  @Then('the delete associations dropdown is visible')
  async verifyDeleteAssociationsDropdownVisible () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsDropdownVisible()
  }

  @When('the student opens the delete associations dropdown')
  async openDeleteAssociationsDropdown () {
    await this.getDeclaredSkillAssociations().openDeleteAssociationsDropdown()
  }

  @When('the student selects the activities delete option')
  async selectDeleteActivitiesOption () {
    await this.getDeclaredSkillAssociations().selectDeleteActivitiesOption()
  }

  @Then('the delete associations modal is visible')
  async verifyDeleteAssociationsModalVisible () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsModalVisible()
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

  @Then('the delete associations modal is hidden')
  async verifyDeleteAssociationsModalHidden () {
    await this.getDeclaredSkillAssociations().verifyDeleteAssociationsModalHidden()
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
