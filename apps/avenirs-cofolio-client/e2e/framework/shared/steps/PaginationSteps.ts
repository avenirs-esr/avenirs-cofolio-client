import type { test } from '@e2e/framework/shared/fixtures/fixtures'
import type { Page } from '@playwright/test'
import { PaginationObject } from '@e2e/framework/shared/componentObjects/PaginationObject'
import { Fixture, Then, When } from 'playwright-bdd/decorators'

export
@Fixture<typeof test>('paginationSteps')
class PaginationSteps {
  constructor (public page: Page) {}

  getTopPagination () {
    return new PaginationObject(this.page.getByTestId('pagination').locator('#top-pagination'))
  }

  getBottomPagination () {
    return new PaginationObject(this.page.getByTestId('pagination').locator('#bottom-pagination'))
  }

  @Then('the bottom pagination shows {int} pages')
  async verifyBottomPaginationPageCount (count: number) {
    await this.getBottomPagination().verifyPageCount(count)
  }

  @When('the user navigates to first page using top pagination')
  async navigateToFirstViaTopPagination () {
    await this.getTopPagination().navigateToFirst()
  }

  @When('the user navigates to first page using bottom pagination')
  async navigateToFirstViaBottomPagination () {
    await this.getBottomPagination().navigateToFirst()
  }

  @When('the user navigates to previous page using top pagination')
  async navigateToPreviousViaTopPagination () {
    await this.getTopPagination().navigateToPrevious()
  }

  @When('the user navigates to previous page using bottom pagination')
  async navigateToPreviousViaBottomPagination () {
    await this.getBottomPagination().navigateToPrevious()
  }

  @When('the user navigates to next page using top pagination')
  async navigateToNextViaTopPagination () {
    await this.getTopPagination().navigateToNext()
  }

  @When('the user navigates to next page using bottom pagination')
  async navigateToNextViaBottomPagination () {
    await this.getBottomPagination().navigateToNext()
  }

  @When('the user navigates to last page using top pagination')
  async navigateToLastViaTopPagination () {
    await this.getTopPagination().navigateToLast()
  }

  @When('the user navigates to last page using bottom pagination')
  async navigateToLastViaBottomPagination () {
    await this.getBottomPagination().navigateToLast()
  }

  @When('the user navigates to page {int} using bottom pagination')
  async navigateToPageViaBottomPagination (pageNum: number) {
    await this.getBottomPagination().navigateToPage(pageNum)
  }

  @Then('the top pagination first button is disabled')
  async verifyTopFirstDisabled () {
    await this.getTopPagination().verifyFirstDisabled()
  }

  @Then('the top pagination previous button is disabled')
  async verifyTopPreviousDisabled () {
    await this.getTopPagination().verifyPreviousDisabled()
  }

  @Then('the top pagination next button is disabled')
  async verifyTopNextDisabled () {
    await this.getTopPagination().verifyNextDisabled()
  }

  @Then('the top pagination last button is disabled')
  async verifyTopLastDisabled () {
    await this.getTopPagination().verifyLastDisabled()
  }

  @Then('the bottom pagination first button is disabled')
  async verifyBottomFirstDisabled () {
    await this.getBottomPagination().verifyFirstDisabled()
  }

  @Then('the bottom pagination previous button is disabled')
  async verifyBottomPreviousDisabled () {
    await this.getBottomPagination().verifyPreviousDisabled()
  }

  @Then('the bottom pagination next button is enabled')
  async verifyBottomNextEnabled () {
    await this.getBottomPagination().verifyNextEnabled()
  }

  @Then('the bottom pagination next button is disabled')
  async verifyBottomNextDisabled () {
    await this.getBottomPagination().verifyNextDisabled()
  }

  @Then('the bottom pagination last button is disabled')
  async verifyBottomLastDisabled () {
    await this.getBottomPagination().verifyLastDisabled()
  }

  @When('the user changes the page size to {int}')
  async changePageSizeTo (size: number) {
    await this.page.getByTestId('page-size-picker').getByRole('button', { name: String(size), exact: true }).click()
  }
}
