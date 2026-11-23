import { usePaginatedNationalTools } from '#shared/composables/use-paginated-national-tools/use-paginated-national-tools'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { ref } from 'vue'

function mountUsePaginatedNationalTools ({
  currentPage = 0,
}: { currentPage?: number } = {}) {
  const currentPageRef = ref(currentPage)

  const { result } = mountComposable(() => usePaginatedNationalTools({
    currentPageRef,
  }), { useTanstack: true })

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
      await vi.waitFor(() => {
        expect(result.nationalTools.value.length).toBeGreaterThan(0)
        expect(result.pageInfo.value).toBeDefined()
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

    BddTest().then('it should update the selected page', () => {
      result.onUpdateCurrentPage(1)

      expect(result.currentPageRef.value).toBe(1)
    })
  })

  BddTest().when('the composable is initialized with a custom current page', () => {
    let result: ReturnType<typeof mountUsePaginatedNationalTools>

    beforeEach(() => {
      result = mountUsePaginatedNationalTools({ currentPage: 2 })
    })

    BddTest().then('it should use the provided current page', () => {
      expect(result.currentPageRef.value).toBe(2)
    })
  })
})
