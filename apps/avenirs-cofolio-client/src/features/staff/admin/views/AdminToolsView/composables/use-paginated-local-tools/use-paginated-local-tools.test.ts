import type { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { createMockedGetLocalToolsResponse } from '@/__mocks__/fixtures/staffs/tools.fixtures'
import { getLocalToolsErrorHandler } from '@/__mocks__/msw/handlers/staffs/tools.handlers'
import { server } from '@/__mocks__/msw/server'
import { usePaginatedLocalTools } from '@/features/staff/admin/views/AdminToolsView/composables/use-paginated-local-tools/use-paginated-local-tools'

const unmounts: Array<() => void> = []

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
})

function mountUsePaginatedLocalTools ({
  currentPage = 0,
  type = 'LOCAL' as EToolType,
}: {
  currentPage?: number
  type?: EToolType
} = {}) {
  const currentPageRef = ref(currentPage)
  const typeRef = ref(type)

  const { result, unmount } = mountComposable(() => usePaginatedLocalTools({
    currentPageRef,
    typeRef,
  }), { useTanstack: true })

  unmounts.push(unmount)

  return {
    ...result,
    currentPageRef,
    typeRef,
  }
}

BddTest().given('a usePaginatedLocalTools composable', () => {
  BddTest().when('the composable is mounted', () => {
    let result: ReturnType<typeof mountUsePaginatedLocalTools>

    beforeEach(() => {
      result = mountUsePaginatedLocalTools()
    })

    BddTest().then('it should expose the pagination handlers', () => {
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })

    BddTest().then('it should initialize the local tools list', () => {
      expect(result.localTools.value).toEqual([])
    })

    BddTest().then('it should return the local tools and page info from the API', async () => {
      const expected = createMockedGetLocalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: result.typeRef.value
      }, 30)

      await vi.waitFor(() => {
        expect(result.localTools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })

    BddTest().then('it should expose the fetching state and error', () => {
      expect(result.isFetching.value).toBeDefined()
      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the current page changes', () => {
    let result: ReturnType<typeof mountUsePaginatedLocalTools>

    beforeEach(() => {
      result = mountUsePaginatedLocalTools()
    })

    BddTest().then('it should request the selected page', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.onUpdateCurrentPage(1)

      expect(result.currentPageRef.value).toBe(1)

      const expected = createMockedGetLocalToolsResponse({
        page: 1,
        pageSize: PageSizes.TWELVE,
        type: result.typeRef.value
      }, 30)

      await vi.waitFor(() => {
        expect(result.localTools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the tool type changes', () => {
    let result: ReturnType<typeof mountUsePaginatedLocalTools>

    beforeEach(() => {
      result = mountUsePaginatedLocalTools()
    })

    BddTest().then('it should request tools of the selected type', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.typeRef.value = 'REGIONAL' as EToolType

      const expected = createMockedGetLocalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: result.typeRef.value
      }, 30)

      await vi.waitFor(() => {
        expect(result.localTools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the API returns an error', () => {
    BddTest().then('it should expose the error', async () => {
      server.use(getLocalToolsErrorHandler)

      const result = mountUsePaginatedLocalTools()

      await vi.waitFor(() => expect(result.error.value).not.toBeNull())

      expect(result.localTools.value).toEqual([])
    })
  })

  BddTest().when('a new test runs after the API error', () => {
    BddTest().then('it should use the default handler again', async () => {
      const result = mountUsePaginatedLocalTools()

      await vi.waitFor(() => {
        expect(result.localTools.value).toHaveLength(PageSizes.TWELVE)
      })

      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the composable is initialized with a custom current page', () => {
    let result: ReturnType<typeof mountUsePaginatedLocalTools>

    beforeEach(() => {
      result = mountUsePaginatedLocalTools({ currentPage: 2 })
    })

    BddTest().then('it should reset the current page on initialization', () => {
      expect(result.currentPageRef.value).toBe(0)
    })
  })
})
