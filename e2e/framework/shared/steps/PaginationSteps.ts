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

  @When('the user navigates to next page using top pagination')
  async navigateToNextViaTopPagination () {
    await this.getTopPagination().navigateToNext()
  }

  @When('the user navigates to page {int} using bottom pagination')
  async navigateToPageViaBottomPagination (pageNum: number) {
    await this.getBottomPagination().navigateToPage(pageNum)
  }

  @Then('the top pagination next button is disabled')
  async verifyTopNextDisabled () {
    await this.getTopPagination().verifyNextDisabled()
  }

  @Then('the bottom pagination next button is disabled')
  async verifyBottomNextDisabled () {
    await this.getBottomPagination().verifyNextDisabled()
  }
}
