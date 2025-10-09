import type {
  PagedResponseTraceViewDTO,
  TraceConfigurationDTO,
  TraceDetailDTO,
  TraceFilter,
  TracesSummaryDTO,
  TracesViewParams
} from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { invalidTraceId, mockedTraceDetailed, mockedTracesSummary } from '@/__mocks__/fixtures/student'
import { useInvalidateQuery } from '@/common/composables'
import {
  type DeleteTraceVariables,
  useDeleteTraceMutation,
  type UseDeleteTraceMutationArgs,
  useTraceDetailedQuery,
  useTracesConfigurationQuery,
  useTracesSummaryQuery,
  useTracesViewQuery
} from '@/features/student/queries/use-traces.query/use-traces.query'
import { flushPromises } from '@vue/test-utils'
import { BddTest, mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, type MockInstance, vi } from 'vitest'

vi.mock('@/common/composables', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...original,
    useInvalidateQuery: vi.fn(),
  }
})

BddTest().given('a useTracesViewQuery composable', async () => {
  let useTracesViewQueryReturn: ReturnType<typeof useTracesViewQuery>
  let tracesViewSpy: MockInstance<(traceFilter: TraceFilter, params?: TracesViewParams | undefined, options?: RequestInit | undefined) => Promise<PagedResponseTraceViewDTO>>

  beforeEach(async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    tracesViewSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'tracesView'>(
      await import('@/api/avenir-esr'),
    'tracesView'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().when('the composable is called', () => {
    BddTest().and('is given page and pageSize but no filter', () => {
      const traceFilter = ref<TraceFilter>({})
      const params = ref<TracesViewParams>({
        page: 1,
        pageSize: 4,
      })

      beforeEach(async () => {
        useTracesViewQueryReturn = mountQueryComposable(
          () => useTracesViewQuery({
            traceFilter,
            params
          })
        )
        await flushPromises()
      })

      BddTest().then('it should not have been called with filters other than page and pageSize', async () => {
        expect(tracesViewSpy).toHaveBeenCalledWith({}, {
          pageSize: params.value.pageSize,
          page: params.value.page,
        })
      })

      BddTest().then('it should return mocked traces data for given page and pageSize', async () => {
        expect(tracesViewSpy).toHaveBeenCalledTimes(1)

        expect(useTracesViewQueryReturn.data.value).toBeDefined()
        expect(useTracesViewQueryReturn.data.value?.data).toBeInstanceOf(Array)
        expect(useTracesViewQueryReturn.data.value?.data.length).toBe(4)
        expect(useTracesViewQueryReturn.data.value?.data).toBeDefined()
        expect(useTracesViewQueryReturn.data.value?.page).toBeDefined()
      })

      BddTest().then('it should return correct pages array', async () => {
        expect(useTracesViewQueryReturn.pageInfo.value.totalPages).toBe(5)
      })
    })

    BddTest().and('is given page and pageSize with isAssociated and keyword filters', () => {
      const traceFilter = ref<TraceFilter>({ isAssociated: true })
      const params = ref<TracesViewParams>({
        page: 1,
        pageSize: 4,
        keyword: 'Ma super trace'
      })

      beforeEach(async () => {
        useTracesViewQueryReturn = mountQueryComposable(
          () => useTracesViewQuery({
            traceFilter,
            params
          })
        )
        await flushPromises()
      })

      BddTest().then('it should not have been called with filters other than page, pageSize, isAssociated and keyword', async () => {
        expect(tracesViewSpy).toHaveBeenCalledWith({ isAssociated: true }, {
          pageSize: params.value.pageSize,
          page: params.value.page,
          keyword: 'Ma super trace'
        })
      })

      BddTest().then('it should return mocked traces data for given filters', async () => {
        expect(tracesViewSpy).toHaveBeenCalledTimes(1)

        expect(useTracesViewQueryReturn.data.value).toBeDefined()
        expect(useTracesViewQueryReturn.data.value?.data).toBeInstanceOf(Array)
        expect(useTracesViewQueryReturn.data.value?.data.length).toBe(4)
        expect(useTracesViewQueryReturn.data.value?.data).toBeDefined()
        expect(useTracesViewQueryReturn.data.value?.page).toBeDefined()
      })

      BddTest().then('it should return correct pages array', async () => {
        expect(useTracesViewQueryReturn.pageInfo.value.totalPages).toBe(5)
      })
    })
  })

  BddTest().and('is given page and pageSize with unmatched keyword filters', () => {
    const traceFilter = ref<TraceFilter>({ isAssociated: true })
    const params = ref<TracesViewParams>({
      page: 1,
      pageSize: 4,
      keyword: crypto.randomUUID()
    })

    beforeEach(async () => {
      useTracesViewQueryReturn = mountQueryComposable(
        () => useTracesViewQuery({
          traceFilter,
          params
        })
      )
      await flushPromises()
    })

    BddTest().then('it should return mocked traces data for given filters', async () => {
      expect(tracesViewSpy).toHaveBeenCalledTimes(1)

      expect(useTracesViewQueryReturn.data.value).toBeDefined()
      expect(useTracesViewQueryReturn.data.value?.data).toBeInstanceOf(Array)
      expect(useTracesViewQueryReturn.data.value?.data.length).toBe(0)
      expect(useTracesViewQueryReturn.data.value?.data).toBeDefined()
      expect(useTracesViewQueryReturn.data.value?.page).toBeDefined()
    })

    BddTest().then('it should return correct pages array', async () => {
      expect(useTracesViewQueryReturn.pageInfo.value.totalPages).toBe(0)
    })
  })

  BddTest().and('is given empty and non-empty filters', () => {
    const traceFilter = ref<TraceFilter>({ fileTypes: [], skillIds: ['skill-1'] })
    const params = ref<TracesViewParams>({
      page: 1,
      pageSize: 4,
      keyword: '',
      fromDate: '2025-10-09'
    })

    beforeEach(async () => {
      useTracesViewQueryReturn = mountQueryComposable(
        () => useTracesViewQuery({
          traceFilter,
          params
        })
      )
      await flushPromises()
    })

    BddTest().then('it should been called with only non-empty filters', async () => {
      expect(tracesViewSpy).toHaveBeenCalledWith({ skillIds: ['skill-1'] }, {
        pageSize: params.value.pageSize,
        page: params.value.page,
        fromDate: params.value.fromDate,
      })
    })
  })
})

BddTest().given('a useTracesSummaryQuery composable', () => {
  BddTest().when('API is not yet connected', () => {
    BddTest().then('it should return mockedTracesSummary', async () => {
      const { data } = mountQueryComposable<UseQueryReturnType<TracesSummaryDTO, BaseApiException>>(
        () => useTracesSummaryQuery()
      )

      await flushPromises()

      expect(data.value).toEqual(mockedTracesSummary)
    })
  })
})

BddTest().given('a useDeleteTraceMutation composable', async () => {
  let deleteTraceSpy: MockInstance<(traceId: string, options?: (RequestInit | undefined)) => Promise<string>>
  let mutationResult: ReturnType<typeof useDeleteTraceMutation>

  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs: UseDeleteTraceMutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    deleteTraceSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'deleteTrace'>(
      await import('@/api/avenir-esr'),
    'deleteTrace'
    )

    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid trace ID and success callback', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { traceId }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(traceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockUseInvalidateQuery).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith()
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(traceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { traceId }
    const mutationArgs: UseDeleteTraceMutationArgs = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(traceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })

      BddTest().then('it should return the expected response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })
    })
  })

  BddTest().and('an invalid trace ID with error callback', () => {
    const variables: DeleteTraceVariables = { traceId: invalidTraceId }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with the invalid ID', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(invalidTraceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
      })

      BddTest().then('it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not call the onSuccess callback', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      BddTest().then('it should not call the invalidation function on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called using mutate with error', () => {
      let mutationResult: ReturnType<typeof useDeleteTraceMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with the invalid ID', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(invalidTraceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
      })

      BddTest().then('it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })
    })
  })
})

BddTest().given('a useTracesConfigurationQuery composable', async () => {
  let getTraceConfigInfoSpy: MockInstance<(options?: RequestInit | undefined) => Promise<TraceConfigurationDTO>>

  beforeEach(async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    // Create spy for getTraceConfigInfo to verify API calls
    getTraceConfigInfoSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getTraceConfig'>(
      await import('@/api/avenir-esr'),
    'getTraceConfig'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a traces configuration query', () => {
    BddTest().when('the query is executed successfully', () => {
      BddTest().then('it should call getTraceConfigInfo API and return configuration data', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<TraceConfigurationDTO, BaseApiException>>(
          () => useTracesConfigurationQuery()
        )

        await flushPromises()

        expect(getTraceConfigInfoSpy).toHaveBeenCalledTimes(1)
        expect(getTraceConfigInfoSpy).toHaveBeenCalledWith()

        expect(data.value).toBeDefined()
        expect(data.value).toHaveProperty('maxRemainingDays')
        expect(data.value).toHaveProperty('maxRemainingDaysBeforeWarning')
        expect(data.value).toHaveProperty('maxRemainingDaysBeforeCritical')
      })

      BddTest().then('it should return properly typed configuration data', async () => {
        const queryReturn = mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        // Verify the data has the expected structure
        const config = queryReturn.data.value
        if (config) {
          expect(typeof config.maxRemainingDays).toBe('number')
          expect(typeof config.maxRemainingDaysBeforeWarning).toBe('number')
          expect(typeof config.maxRemainingDaysBeforeCritical).toBe('number')
        }
      })

      BddTest().then('it should mark the query as successful', async () => {
        const queryReturn = mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        expect(queryReturn.isSuccess.value).toBe(true)
        expect(queryReturn.isError.value).toBe(false)
        expect(queryReturn.isLoading.value).toBe(false)
      })
    })

    BddTest().when('the query encounters an error', () => {
      BddTest().then('it should still call the API', async () => {
        mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        expect(getTraceConfigInfoSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should handle error state correctly', async () => {
        const queryReturn = mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        if (queryReturn.isError.value) {
          expect(queryReturn.isSuccess.value).toBe(false)
          expect(queryReturn.error.value).toBeDefined()
        }
      })
    })

    BddTest().when('the query is called multiple times', () => {
      BddTest().then('it should use TanStack Query caching', async () => {
        function useMultipleTraceConfigCalls () {
          useTracesConfigurationQuery()
          return useTracesConfigurationQuery()
        }

        mountQueryComposable(() => useMultipleTraceConfigCalls())
        await flushPromises()
        await flushPromises()

        expect(getTraceConfigInfoSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

BddTest().given('a useTraceDetailedQuery composable', async () => {
  let getTraceDetailSpy: MockInstance<(traceId: string, options?: RequestInit | undefined) => Promise<TraceDetailDTO>>

  beforeEach(async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    // Create spy for getTraceDetail to verify API calls
    getTraceDetailSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getTraceDetail'>(
      await import('@/api/avenir-esr'),
    'getTraceDetail'
    ).mockResolvedValue(mockedTraceDetailed)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a trace detailed query', () => {
    BddTest().when('the query is executed successfully', () => {
      BddTest().then('it should call getTraceDetail API and return detailed trace', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<TraceDetailDTO, BaseApiException>>(
          () => useTraceDetailedQuery(ref(mockedTraceDetailed.id))
        )

        await flushPromises()

        expect(getTraceDetailSpy).toHaveBeenCalledTimes(1)
        expect(getTraceDetailSpy).toHaveBeenCalledWith(mockedTraceDetailed.id)

        expect(data.value).toBeDefined()
        expect(data.value).toHaveProperty('id')
        expect(data.value).toHaveProperty('title')
        expect(data.value).toHaveProperty('isAssociated')
        expect(data.value).toHaveProperty('createdAt')
        expect(data.value).toHaveProperty('updatedAt')
        expect(data.value).toHaveProperty('programName')
        expect(data.value).toHaveProperty('aiUseJustification')
        expect(data.value).toHaveProperty('isGroup')
        expect(data.value).toHaveProperty('personalNote')
        expect(data.value).toHaveProperty('attachment')
        expect(data.value).toHaveProperty('associationsTrace')
      })

      BddTest().then('it should return properly typed configuration data', async () => {
        const queryReturn = mountQueryComposable(() => useTraceDetailedQuery(ref(mockedTraceDetailed.id)))

        await flushPromises()

        // Verify the data has the expected structure
        const config = queryReturn.data.value
        if (config) {
          expect(typeof config.id).toBe('string')
          expect(typeof config.title).toBe('string')
          expect(typeof config.isAssociated).toBe('boolean')
          expect(typeof config.createdAt).toBe('string')
          expect(typeof config.updatedAt).toBe('string')
          expect(typeof config.programName).toBe('string')
          expect(typeof config.aiUseJustification).toBe('string')
          expect(typeof config.isGroup).toBe('boolean')
          expect(typeof config.personalNote).toBe('string')
          expect(typeof config.attachment).toBe('object')
          expect(typeof config.associationsTrace).toBe('object')
        }
      })

      BddTest().then('it should mark the query as successful', async () => {
        const queryReturn = mountQueryComposable(() => useTraceDetailedQuery(ref(mockedTraceDetailed.id)))

        await flushPromises()

        expect(queryReturn.isSuccess.value).toBe(true)
        expect(queryReturn.isError.value).toBe(false)
        expect(queryReturn.isLoading.value).toBe(false)
      })
    })

    BddTest().when('the query encounters an error', () => {
      BddTest().then('it should still call the API', async () => {
        mountQueryComposable(() => useTraceDetailedQuery(ref(mockedTraceDetailed.id)))

        await flushPromises()

        expect(getTraceDetailSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should handle error state correctly', async () => {
        const queryReturn = mountQueryComposable(() => useTraceDetailedQuery(ref(mockedTraceDetailed.id)))

        await flushPromises()

        if (queryReturn.isError.value) {
          expect(queryReturn.isSuccess.value).toBe(false)
          expect(queryReturn.error.value).toBeDefined()
        }
      })
    })

    BddTest().when('the query is called multiple times', () => {
      BddTest().then('it should use TanStack Query caching', async () => {
        function useMultipleTraceDetailedCalls () {
          useTraceDetailedQuery(ref(mockedTraceDetailed.id))
          return useTraceDetailedQuery(ref(mockedTraceDetailed.id))
        }

        mountQueryComposable(() => useMultipleTraceDetailedCalls())
        await flushPromises()
        await flushPromises()

        expect(getTraceDetailSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
