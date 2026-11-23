import { createMockedGetNationalToolsResponse } from '#shared/__mocks__/fixtures/national-tools.fixtures'
import { getNationalToolsErrorHandler } from '#shared/__mocks__/msw/handlers/national-tools.handlers'
import { server } from '#shared/__mocks__/msw/server'
import { usePaginatedNationalTools } from '#shared/composables/use-paginated-national-tools/use-paginated-national-tools'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { ref } from 'vue'

const unmounts: Array<() => void> = []

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
})

function mountUsePaginatedNationalTools ({
  currentPage = 0,
}: { currentPage?: number } = {}) {
  const currentPageRef = ref(currentPage)

  const { result, unmount } = mountComposable(() => usePaginatedNationalTools({
    currentPageRef,
  }), { useTanstack: true })
  unmounts.push(unmount)

  return {
    ...result,
    currentPageRef,
  }
}

BddTest().given('a usePaginatedNationalTools composable', () => {
  BddTest().when('the composable is mounted', () => {
    let result: ReturnType<typeof mountUsePaginatedNationalTools>

    beforeEach(() => {
      result = mountUsePaginatedNationalTools()
    })

    BddTest().then('it should expose the pagination handlers', () => {
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })

    BddTest().then('it should initialize the national tools list', () => {
      expect(result.nationalTools.value).toEqual([])
    })

    BddTest().then('it should return the national tools and page info from the API', async () => {
      const expected = createMockedGetNationalToolsResponse({ page: 0, pageSize: PageSizes.TWELVE }, 30)
      await vi.waitFor(() => {
        expect(result.nationalTools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })

    BddTest().then('it should expose the fetching state and error', () => {
      expect(result.isFetching.value).toBeDefined()
      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the current page changes', () => {
    let result: ReturnType<typeof mountUsePaginatedNationalTools>

    beforeEach(() => {
      result = mountUsePaginatedNationalTools()
    })

    BddTest().then('it should request the selected page', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))
      result.onUpdateCurrentPage(1)

      expect(result.currentPageRef.value).toBe(1)
      const expected = createMockedGetNationalToolsResponse({ page: 1, pageSize: PageSizes.TWELVE }, 30)
      await vi.waitFor(() => {
        expect(result.nationalTools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the API returns an error', () => {
    BddTest().then('it should expose the error', async () => {
      server.use(getNationalToolsErrorHandler)
      const result = mountUsePaginatedNationalTools()

      await vi.waitFor(() => expect(result.error.value).not.toBeNull())
      expect(result.nationalTools.value).toEqual([])
    })
  })

  BddTest().when('a new test runs after the API error', () => {
    BddTest().then('it should use the default handler again', async () => {
      const result = mountUsePaginatedNationalTools()
      await vi.waitFor(() => expect(result.nationalTools.value).toHaveLength(PageSizes.TWELVE))
      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the composable is initialized with a custom current page', () => {
    let result: ReturnType<typeof mountUsePaginatedNationalTools>

    beforeEach(() => {
      result = mountUsePaginatedNationalTools({ currentPage: 2 })
    })

    BddTest().then('it should reset the current page on initialization', () => {
      expect(result.currentPageRef.value).toBe(0)
    })
  })
})
