import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import { BasePage } from '@e2e/framework/shared/base/BasePage'
import { STAFF_ROUTES } from '@e2e/framework/shared/constants/routes'
import { clickOnElement } from '@e2e/framework/shared/utils/click'
import { waitForPageLoad } from '@e2e/framework/shared/utils/waits'
import { expect, type Page } from '@playwright/test'
import { Fixture, Given, Then } from 'playwright-bdd/decorators'

@Fixture<typeof test>('editNationalActivityContentPage')
export class EditNationalActivityContentPage extends BasePage {
  constructor (public page: Page) {
    super(page)
  }

  getPageTitle () {
    return this.page.getByTestId('page-title')
  }

  getBackButton () {
    return this.page
      .locator('button')
      .filter({ hasText: /retour|back/i })
      .first()
  }

  getBreadcrumbLinks () {
    return this.page.locator('[role="navigation"] a, [class*="breadcrumb"] a')
  }

  getActivityTitleFormField () {
    return this.page.locator('input[type="text"]').first()
  }

  getActivityConsignFormField () {
    return this.page.locator('[contenteditable="true"]').first()
  }

  getNextStepButton () {
    return this.page.getByRole('button', { name: /étape suivante/i })
  }

  getSideNavigationMenu () {
    return this.page.locator('[class*="side-navigation"], [class*="sidenav"]').first()
  }

  getActivityContentForm () {
    return this.page.locator('[class*="av-col"][class*="av-gap"]').first()
  }

  @Given('the staff creates a test national activity')
  async createTestNationalActivity () {
    const createButton = this.page.getByTestId('create-activity-button')
    if (await createButton.isVisible()) {
      await clickOnElement(createButton)

      const modal = this.page.getByTestId('activity-draft-creation-modal')
      await expect(modal).toBeVisible()

      const titleInput = modal.getByTestId('activity-title-form-field')
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test National Activity')
      }

      const confirmButton = modal.getByTestId('confirm-button')
      if (await confirmButton.isVisible()) {
        await clickOnElement(confirmButton)

        await waitForPageLoad(this.page)
      }
    }
  }

  @Then('the edit national activity content page is displayed')
  async verifyPageLoaded () {
    await expect(this.page).toHaveURL(/\/cofolio\/staff\/activities\/.*\/edit/)
  }

  @Then('the page title is correct for edit national activity content')
  async verifyPageTitleCorrect () {
    const pageTitle = this.getPageTitle()
    await expect(pageTitle).toBeVisible()
    const heading = pageTitle.getByRole('heading')
    await expect(heading).toBeVisible()
    const titleText = await heading.textContent()
    expect(titleText).toMatch(/Créer|Modifier/)
  }

  @Then('the page navigates to staff home page')
  async verifyNavigateToStaffHomePage () {
    await expect(this.page).toHaveURL(STAFF_ROUTES.HOME)
  }

  @Given('the activity content form is visible')
  async verifyActivityContentFormVisible () {
    const form = this.getActivityContentForm()
    await expect(form).toBeVisible()
  }

  @Then('the activity title form field is visible')
  async verifyActivityTitleFormFieldVisible () {
    await expect(this.getActivityTitleFormField()).toBeVisible()
  }

  @Then('the activity title form field has a label')
  async verifyActivityTitleFormFieldHasLabel () {
    const titleField = this.getActivityTitleFormField()
    const label = titleField.locator('xpath=preceding::label[1]')
    await expect(label).toBeVisible()
  }

  @Then('the activity consign form field is visible')
  async verifyActivityConsignFormFieldVisible () {
    await expect(this.getActivityConsignFormField()).toBeVisible()
  }

  @Then('the activity consign form field has a label')
  async verifyActivityConsignFormFieldHasLabel () {
    const consignField = this.getActivityConsignFormField()
    const label = consignField.locator('xpath=preceding::label[1]')
    await expect(label).toBeVisible()
  }

  @Then('the next step button is visible')
  async verifyNextStepButtonVisible () {
    await expect(this.getNextStepButton()).toBeVisible()
  }

  @Then('the next step button has correct label')
  async verifyNextStepButtonHasCorrectLabel () {
    const button = this.getNextStepButton()
    await expect(button).toContainText(/étape suivante/i)
  }

  @Then('the side navigation menu is visible')
  async verifySideNavigationMenuVisible () {
    const sideNav = this.getSideNavigationMenu()
    await expect(sideNav).toBeVisible()
  }

  @Then('the side navigation has TITLE section')
  async verifySideNavigationHasTitleSection () {
    await expect(this.page.getByTestId('menu-CONTENT-TITLE')).toBeVisible()
  }

  @Then('the side navigation has INSTRUCTIONS section')
  async verifySideNavigationHasInstructionsSection () {
    await expect(this.page.getByTestId('menu-CONTENT-INSTRUCTIONS')).toBeVisible()
  }

  @Then('the side navigation has CONTEXT section')
  async verifySideNavigationHasContextSection () {
    await expect(this.page.getByTestId('menu-CONTENT-CONTEXT')).toBeVisible()
  }

  @Then('the side navigation has DOCUMENTS section')
  async verifySideNavigationHasDocumentsSection () {
    await expect(this.page.getByTestId('menu-CONTENT-DOCUMENTS')).toBeVisible()
  }

  @Then('the side navigation has SCHEDULE section')
  async verifySideNavigationHasScheduleSection () {
    await expect(this.page.getByTestId('menu-CONTENT-SCHEDULE')).toBeVisible()
  }

  @Then('the side navigation has MODALITIES section')
  async verifySideNavigationHasModalitiesSection () {
    await expect(this.page.getByTestId('menu-CONTENT-MODALITIES')).toBeVisible()
  }

  @Then('the side navigation has THEMATIC section')
  async verifySideNavigationHasThematicSection () {
    await expect(this.page.getByTestId('menu-CONTENT-THEMATIC')).toBeVisible()
  }

  @Then('the side navigation menu is not visible')
  async verifySideNavigationMenuNotVisible () {
    await expect(this.getSideNavigationMenu()).not.toBeVisible()
  }
}
