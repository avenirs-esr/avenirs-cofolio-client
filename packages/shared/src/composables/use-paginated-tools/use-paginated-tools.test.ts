import type { EToolType } from '#shared/api/avenir-esr'
import {
  createMockedGetAvailableToolsResponse,
  createMockedGetLocalToolsResponse,
  createMockedGetNationalToolsResponse,
} from '#shared/__mocks__/fixtures/tools.fixtures'
import {
  getAvailableToolsErrorHandler,
  getLocalToolsErrorHandler,
  getNationalToolsErrorHandler,
} from '#shared/__mocks__/msw/handlers/tools.handlers'
import { server } from '#shared/__mocks__/msw/server'
import { usePaginatedTools } from '#shared/composables/use-paginated-tools/use-paginated-tools'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { ref } from 'vue'

const unmounts: Array<() => void> = []

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
})

function mountUsePaginatedTools ({
  currentPage = 0,
  type,
  previewMode = false,
}: {
  currentPage?: number
  type?: EToolType
  previewMode?: boolean
} = {}) {
  const currentPageRef = ref(currentPage)
  const typeRef = ref(type)
  const previewModeRef = ref(previewMode)

  const { result, unmount } = mountComposable(() => usePaginatedTools({
    currentPageRef,
    typeRef,
    previewModeRef,
  }), { useTanstack: true })

  unmounts.push(unmount)

  return {
    ...result,
    currentPageRef,
    typeRef,
    previewModeRef,
  }
}

BddTest().given('a usePaginatedTools composable', () => {
  BddTest().when('the composable is mounted without a type', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools()
    })

    BddTest().then('it should expose the pagination handlers', () => {
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })

    BddTest().then('it should initialize the tools list', () => {
      expect(result.tools.value).toEqual([])
    })

    BddTest().then('it should return national tools and page info from the API', async () => {
      const expected = createMockedGetNationalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })

    BddTest().then('it should expose the fetching state and error', () => {
      expect(result.isFetching.value).toBeDefined()
      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the type is NATIONAL', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ type: 'NATIONAL' as EToolType })
    })

    BddTest().then('it should return national tools', async () => {
      const expected = createMockedGetNationalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the type is LOCAL', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ type: 'LOCAL' as EToolType })
    })

    BddTest().then('it should return local tools', async () => {
      const expected = createMockedGetLocalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: result.typeRef.value!,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the type is REGIONAL', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ type: 'REGIONAL' as EToolType })
    })

    BddTest().then('it should return local tools filtered by the regional type', async () => {
      const expected = createMockedGetLocalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: result.typeRef.value!,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the preview mode is enabled', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({
        type: 'LOCAL' as EToolType,
        previewMode: true,
      })
    })

    BddTest().then('it should return available tools and page info from the API', async () => {
      const expected = createMockedGetAvailableToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: 'LOCAL' as EToolType,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })

    BddTest().then('it should expose the fetching state and error', () => {
      expect(result.isFetching.value).toBeDefined()
      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the current page changes', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools()
    })

    BddTest().then('it should request the selected page', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.onUpdateCurrentPage(1)

      expect(result.currentPageRef.value).toBe(1)

      const expected = createMockedGetNationalToolsResponse({
        page: 1,
        pageSize: PageSizes.TWELVE,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the type changes from NATIONAL to LOCAL', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ type: 'NATIONAL' as EToolType })
    })

    BddTest().then('it should request local tools of the selected type', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.typeRef.value = 'LOCAL' as EToolType

      const expected = createMockedGetLocalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: 'LOCAL' as EToolType,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the type changes from LOCAL to NATIONAL', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ type: 'LOCAL' as EToolType })
    })

    BddTest().then('it should request national tools', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.typeRef.value = 'NATIONAL' as EToolType

      const expected = createMockedGetNationalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the preview mode changes from disabled to enabled', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ type: 'LOCAL' as EToolType })
    })

    BddTest().then('it should request available tools', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.previewModeRef.value = true

      const expected = createMockedGetAvailableToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: 'LOCAL' as EToolType,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the preview mode changes from enabled to disabled', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({
        type: 'LOCAL' as EToolType,
        previewMode: true,
      })
    })

    BddTest().then('it should request local tools', async () => {
      await vi.waitFor(() => expect(result.pageInfo.value?.page).toBe(0))

      result.previewModeRef.value = false

      const expected = createMockedGetLocalToolsResponse({
        page: 0,
        pageSize: PageSizes.TWELVE,
        type: 'LOCAL' as EToolType,
      }, 30)

      await vi.waitFor(() => {
        expect(result.tools.value).toEqual(expected.data)
        expect(result.pageInfo.value).toEqual(expected.page)
      })
    })
  })

  BddTest().when('the API returns a national tools error', () => {
    BddTest().then('it should expose the error', async () => {
      server.use(getNationalToolsErrorHandler)

      const result = mountUsePaginatedTools()

      await vi.waitFor(() => expect(result.error.value).not.toBeNull())
      expect(result.tools.value).toEqual([])
    })
  })

  BddTest().when('the API returns a local tools error', () => {
    BddTest().then('it should expose the error', async () => {
      server.use(getLocalToolsErrorHandler)

      const result = mountUsePaginatedTools({ type: 'LOCAL' as EToolType })

      await vi.waitFor(() => expect(result.error.value).not.toBeNull())
      expect(result.tools.value).toEqual([])
    })
  })

  BddTest().when('the API returns an available tools error', () => {
    BddTest().then('it should expose the error', async () => {
      server.use(getAvailableToolsErrorHandler)

      const result = mountUsePaginatedTools({ previewMode: true })

      await vi.waitFor(() => expect(result.error.value).not.toBeNull())
      expect(result.tools.value).toEqual([])
    })
  })

  BddTest().when('a new test runs after an API error', () => {
    BddTest().then('it should use the default handler again', async () => {
      const result = mountUsePaginatedTools()

      await vi.waitFor(() => {
        expect(result.tools.value).toHaveLength(PageSizes.TWELVE)
      })

      expect(result.error.value).toBeNull()
    })
  })

  BddTest().when('the composable is initialized with a custom current page', () => {
    let result: ReturnType<typeof mountUsePaginatedTools>

    beforeEach(() => {
      result = mountUsePaginatedTools({ currentPage: 2 })
    })

    BddTest().then('it should reset the current page on initialization', () => {
      expect(result.currentPageRef.value).toBe(0)
    })
  })
})
