import type { Ref } from 'vue'
import { declaredProgramViewDTOFixture } from '@/__mocks__/fixtures/student'
import { declaredProgramDetailedErrorHandler, declaredProgramDetailedHandler, declaredProgramsQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  type DeclaredProgramsViewQueryReturnType,
  type DeleteDeclaredProgramMutationParams,
  useDeclaredProgramDetailedQuery,
  useDeclaredProgramsViewQuery,
  useDeleteDeclaredProgramMutation,
  useGetCachedDeclaredPrograms
} from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable, mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared programs view query', () => {
  let queryResult: DeclaredProgramsViewQueryReturnType
  let page: Ref<number>
  let pageSize: Ref<number>

  beforeEach(() => {
    vi.clearAllMocks()
    page = ref(0)
    pageSize = ref(10)
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredProgramsViewQuery({ page, pageSize }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return paginated data', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value?.data).toBeDefined()
      expect(queryResult.data.value?.page).toBeDefined()
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().then('it should compute declaredPrograms array', () => {
      expect(queryResult.declaredPrograms.value).toBeDefined()
      expect(Array.isArray(queryResult.declaredPrograms.value)).toBe(true)
    })

    BddTest().then('it should compute pageInfo object', () => {
      expect(queryResult.pageInfo.value).toBeDefined()
      expect(queryResult.pageInfo.value.page).toBe(0)
      expect(queryResult.pageInfo.value.pageSize).toBeDefined()
      expect(queryResult.pageInfo.value.totalElements).toBeDefined()
      expect(queryResult.pageInfo.value.totalPages).toBeDefined()
    })

    BddTest().then('it should return declared programs with expected structure', () => {
      const firstProgram = queryResult.declaredPrograms.value[0]
      if (firstProgram) {
        expect(firstProgram).toMatchObject({
          id: expect.any(String),
          title: expect.any(String)
        })
      }
    })

    BddTest().and('the page parameter changes', () => {
      beforeEach(async () => {
        page.value = 1
        await vi.waitFor(() => {
          expect(queryResult.pageInfo.value.page).toBe(1)
        })
      })

      BddTest().then('it should fetch new page data', () => {
        expect(queryResult.pageInfo.value.page).toBe(1)
      })

      BddTest().then('it should maintain success state', () => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().and('the pageSize parameter changes', () => {
      beforeEach(async () => {
        pageSize.value = 20
        await vi.waitFor(() => {
          expect(queryResult.pageInfo.value.pageSize).toBe(20)
        })
      })

      BddTest().then('it should fetch data with new page size', () => {
        expect(queryResult.pageInfo.value.pageSize).toBe(20)
      })
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredProgramsQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredProgramsViewQuery({ page, pageSize }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return empty declaredPrograms array', () => {
      expect(queryResult.declaredPrograms.value).toEqual([])
    })

    BddTest().then('it should return default pageInfo', () => {
      expect(queryResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })

  BddTest().when('the query data is undefined', () => {
    beforeEach(() => {
      queryResult = mountQueryComposable(() => useDeclaredProgramsViewQuery({ page, pageSize }))
    })

    BddTest().then('it should return empty array for declaredPrograms', () => {
      expect(queryResult.declaredPrograms.value).toEqual([])
    })

    BddTest().then('it should return default pageInfo with zeros', () => {
      expect(queryResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })
})

BddTest().given('a get cached declared programs composable', () => {
  function useTestWrapper (page: Ref<number>, pageSize: Ref<number>) {
    const query = useDeclaredProgramsViewQuery({
      page,
      pageSize
    })
    const cache = useGetCachedDeclaredPrograms()
    return { query, cache }
  }

  BddTest().when('no cached data exists', () => {
    let getCachedDeclaredProgramsComposable: ReturnType<typeof useGetCachedDeclaredPrograms>

    beforeEach(() => {
      const page = ref(0)
      const pageSize = ref(3)

      const result = mountComposable(() => useTestWrapper(page, pageSize), {
        useTanstack: true
      })
      getCachedDeclaredProgramsComposable = result.result.cache
    })

    BddTest().then('it should return empty elements array', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.declaredPrograms).toEqual([])
    })

    BddTest().then('it should return currentPage as -1', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.currentPage).toBe(-1)
    })
  })

  BddTest().when('cached data exists for one page', () => {
    let queryResult: ReturnType<typeof useDeclaredProgramsViewQuery>
    let getCachedDeclaredProgramsComposable: ReturnType<typeof useGetCachedDeclaredPrograms>

    beforeEach(async () => {
      const page = ref(0)
      const pageSize = ref(3)

      const composable = mountComposable(() => useTestWrapper(page, pageSize), {
        useTanstack: true
      })

      queryResult = composable.result.query
      getCachedDeclaredProgramsComposable = composable.result.cache

      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return the cached programs', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.declaredPrograms.length).toBeGreaterThan(0)
      expect(cached.declaredPrograms.length).toBe(3)
    })

    BddTest().then('it should return the currentPage', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.currentPage).toBe(0)
    })

    BddTest().then('it should return programs with valid structure', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      const firstProgram = cached.declaredPrograms[0]
      expect(firstProgram).toHaveProperty('id')
      expect(firstProgram).toHaveProperty('status')
      expect(firstProgram).toHaveProperty('title')
      expect(firstProgram).toHaveProperty('organization')
    })
  })

  BddTest().when('cached data exists for multiple pages', () => {
    let queryResult: ReturnType<typeof useDeclaredProgramsViewQuery>
    let getCachedDeclaredProgramsComposable: ReturnType<typeof useGetCachedDeclaredPrograms>
    let page: Ref<number>

    beforeEach(async () => {
      page = ref(0)
      const pageSize = ref(3)

      const composable = mountComposable(() => useTestWrapper(page, pageSize), {
        useTanstack: true
      })

      queryResult = composable.result.query
      getCachedDeclaredProgramsComposable = composable.result.cache

      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })

      page.value = 1

      await vi.waitFor(() => {
        expect(queryResult.pageInfo.value.page).toBe(1)
      })
    })

    BddTest().then('it should return all accumulated cached programs', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.declaredPrograms.length).toBeGreaterThan(3)
      expect(cached.declaredPrograms.length).toBe(6)
    })

    BddTest().then('it should return the highest page number', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.currentPage).toBe(1)
    })

    BddTest().then('it should not have duplicate programs', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      const ids = cached.declaredPrograms.map(el => el.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  BddTest().when('cached data exists with incomplete pages', () => {
    let queryResult: ReturnType<typeof useDeclaredProgramsViewQuery>
    let getCachedDeclaredProgramsComposable: ReturnType<typeof useGetCachedDeclaredPrograms>
    let page: Ref<number>

    beforeEach(async () => {
      page = ref(0)
      const pageSize = ref(3)

      const composable = mountComposable(() => useTestWrapper(page, pageSize), {
        useTanstack: true
      })

      queryResult = composable.result.query
      getCachedDeclaredProgramsComposable = composable.result.cache

      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })

      page.value = 2

      await vi.waitFor(() => {
        expect(queryResult.pageInfo.value.page).toBe(2)
      })
    })

    BddTest().then('it should return programs from all cached pages', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.declaredPrograms.length).toBeGreaterThan(0)
    })

    BddTest().then('it should return the maximum page number from cached data', () => {
      const cached = getCachedDeclaredProgramsComposable.getCachedDeclaredPrograms()
      expect(cached.currentPage).toBe(2)
    })
  })
})

BddTest().given('the useDeleteDeclaredProgramMutation composable', () => {
  let composableResult: ReturnType<typeof useDeleteDeclaredProgramMutation>
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    const result = mountComposable(() => useDeleteDeclaredProgramMutation({ onSuccess: mockOnSuccess, onError: mockOnError }), {
      useI18n: true,
      useTanstack: true,
      usePinia: true
    })
    composableResult = result.result
  })

  BddTest().when('checking the mutation initial state', () => {
    BddTest().then('it should have correct initial values', () => {
      expect(composableResult.isPending.value).toBe(false)
      expect(composableResult.isError.value).toBe(false)
      expect(composableResult.isSuccess.value).toBe(false)
      expect(composableResult.data.value).toBeUndefined()
    })
  })

  BddTest().when('the mutation is called with valid data', () => {
    BddTest().then('it should successfully delete the declared programs', async () => {
      const variables: DeleteDeclaredProgramMutationParams = {
        declaredProgramIds: ['program-to-delete-1', 'program-to-delete-2']
      }

      composableResult.mutate(variables)

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      expect(composableResult.data.value).toBe(`${variables.declaredProgramIds.length} programs deleted successfully`)
    })
  })

  BddTest().when('the mutation is called with an empty array', () => {
    BddTest().then('it should handle the error correctly', async () => {
      const variables: DeleteDeclaredProgramMutationParams = {
        declaredProgramIds: []
      }

      composableResult.mutate(variables)

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(mockOnError).toHaveBeenCalledTimes(1)
      expect(composableResult.error.value).toBeDefined()
    })
  })

  BddTest().when('the mutation is called with an invalid id', () => {
    BddTest().then('it should handle the error correctly', async () => {
      const variables: DeleteDeclaredProgramMutationParams = {
        declaredProgramIds: ['program-to-delete-1', 'INVALID_PROGRAM_ID']
      }

      composableResult.mutate(variables)

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(mockOnError).toHaveBeenCalledTimes(1)
      expect(composableResult.error.value).toBeDefined()
    })
  })
})

BddTest().given('a declared program detailed query', () => {
  let declaredProgramId: Ref<string>
  let queryResult: ReturnType<typeof useDeclaredProgramDetailedQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    declaredProgramId = ref('declared-program-123-456-789')
  })

  BddTest().when('the query is executed with a valid declaredProgramId', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedHandler)
      queryResult = mountQueryComposable(() => useDeclaredProgramDetailedQuery(declaredProgramId))

      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return declared program detailed data', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value).toEqual(declaredProgramViewDTOFixture)
    })

    BddTest().then('it should compute declaredProgramDetailed', () => {
      expect(queryResult.declaredProgramDetailed.value).toEqual(declaredProgramViewDTOFixture)
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().and('the declaredProgramId changes', () => {
      beforeEach(async () => {
        declaredProgramId.value = 'another-declared-program-id'

        await vi.waitFor(() => {
          expect(queryResult.isFetching.value || queryResult.isPending.value || queryResult.isSuccess.value).toBe(true)
        })
      })

      BddTest().then('it should keep a stable computed declaredProgramDetailed ref', () => {
        expect(queryResult.declaredProgramDetailed).toBeDefined()
      })
    })
  })

  BddTest().when('the query is executed with an empty declaredProgramId', () => {
    beforeEach(async () => {
      declaredProgramId.value = '   '
      queryResult = mountQueryComposable(() => useDeclaredProgramDetailedQuery(declaredProgramId))
      await flushPromises()
    })

    BddTest().then('it should not fetch and should have no data', () => {
      expect(queryResult.data.value).toBeUndefined()
      expect(queryResult.declaredProgramDetailed.value).toBeUndefined()
      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.isError.value).toBe(false)
      expect(queryResult.isFetching.value).toBe(false)
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredProgramDetailedQuery(declaredProgramId))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should have undefined declaredProgramDetailed', () => {
      expect(queryResult.declaredProgramDetailed.value).toBeUndefined()
    })
  })
})
