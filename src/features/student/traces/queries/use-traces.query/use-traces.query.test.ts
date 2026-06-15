import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { createMockedSearchActivitiesForAssociationResponse, invalidTraceId, mockedSkillSearchResults, mockedTraceActivitySearchResults, mockedTraceDetailed, mockedTracesSummary } from '@/__mocks__/fixtures/student'
import { associateTraceWithDeclaredSkillsErrorHandler, searchSkillsForAssociationErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  ELanguage,
  ETraceAuthorType,
  type GetTraceAssociationsParams,
  type PagedResponseTraceViewDTO,
  type TraceAssociationsDTO,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TraceFilter,
  type TraceOverviewDTO,
  type TracesSummaryDTO,
  type TracesViewParams,
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import {
  type AssociateTraceWithActivitiesVariables,
  type AssociateTraceWithDeclaredSkillsVariables,
  type DeleteTraceAssociationsMutationVariables,
  type DeleteTraceVariables,
  type SearchActivitiesForAssociationQueryParams,
  type UpdateTraceVariables,
  useAssociateTraceWithActivitiesMutation,
  useAssociateTraceWithDeclaredSkillsMutation,
  type UseDeclaredSkillsForAssociationQueryParams,
  useDeleteTraceAssociationsMutation,
  useDeleteTraceMutation,
  useSearchActivitiesForAssociationQuery,
  useSearchDeclaredSkillsForAssociationWithTraceQuery,
  useStudentTracesSummaryQuery,
  useTraceAssociationsQuery,
  useTraceDetailedQuery,
  useTracesConfigurationQuery,
  useTracesSummaryQuery,
  useTracesViewQuery,
  useUpdateTraceMutation,
} from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, type MockInstance, vi } from 'vitest'

vi.mock('@/common/composables', async () => {
  return {
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
  let deleteTracesSpy: MockInstance<(traceId: string[], options?: (RequestInit | undefined)) => Promise<string>>
  let mutationResult: ReturnType<typeof useDeleteTraceMutation>

  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs: MutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    deleteTracesSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'deleteTraces'>(
      await import('@/api/avenir-esr'),
    'deleteTraces'
    )

    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid trace ID and success callback', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { tracesIds: [traceId] }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTracesSpy).toHaveBeenCalledWith([traceId])
        expect(deleteTracesSpy).toHaveBeenCalledTimes(1)
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
        expect(mockUseInvalidateQuery).toHaveBeenCalledTimes(3)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(3)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(
          expect.any(String),
          variables
        )
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
        expect(deleteTracesSpy).toHaveBeenCalledWith([traceId])
        expect(deleteTracesSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(3)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { tracesIds: [traceId] }
    const mutationArgs: MutationArgs = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTracesSpy).toHaveBeenCalledWith([traceId])
        expect(deleteTracesSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(3)
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
    const variables: DeleteTraceVariables = { tracesIds: [invalidTraceId] }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the deleteTrace API with the invalid ID', () => {
        expect(deleteTracesSpy).toHaveBeenCalledWith([invalidTraceId])
        expect(deleteTracesSpy).toHaveBeenCalledTimes(1)
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
        expect(deleteTracesSpy).toHaveBeenCalledWith([invalidTraceId])
        expect(deleteTracesSpy).toHaveBeenCalledTimes(1)
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
        expect(data.value).toHaveProperty('authorType')
        expect(data.value).toHaveProperty('personalNote')
        expect(data.value).toHaveProperty('attachment')
        expect(data.value).toHaveProperty('traceAssociations')
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
          expect(typeof config.authorType).toBe('string')
          expect(typeof config.personalNote).toBe('string')
          expect(typeof config.attachment).toBe('object')
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

BddTest().given('a useUpdateTraceMutation composable', async () => {
  let updateTraceSpy: MockInstance<typeof import('@/api/avenir-esr')['updateTrace']>
  let mutationResult: ReturnType<typeof useUpdateTraceMutation>

  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateTraceDetailFunction = vi.fn()
  const mockInvalidateTracesViewFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()

    updateTraceSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'updateTrace'>(
      await import('@/api/avenir-esr'),
    'updateTrace'
    )

    mockUseInvalidateQuery
      .mockReturnValueOnce(mockInvalidateTraceDetailFunction)
      .mockReturnValueOnce(mockInvalidateTracesViewFunction)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().and('a valid trace update with success callback', () => {
    const traceId = 'trace1'
    const mutationArgs: MutationArgs = {
      onSuccess: mockOnSuccess,
      onError: mockOnError
    }
    const variables: UpdateTraceVariables = {
      traceId,
      updateTraceDTO: {
        title: 'Updated Title',
        personalNote: 'Updated note',
        authorType: ETraceAuthorType.COLLECTIVE,
        iaJustification: 'AI justification',
        language: ELanguage.FRENCH
      }
    }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateTrace API with correct parameters', () => {
        expect(updateTraceSpy).toHaveBeenCalledWith(traceId, variables.updateTraceDTO)
        expect(updateTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should execute the updateTrace mutation successfully', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.data.value).toBeDefined()
      })

      BddTest().then('it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
        expect(mutationResult.data.value).toHaveProperty('id')
        expect(mutationResult.data.value).toHaveProperty('title')
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should call both invalidation functions', () => {
        expect(mockUseInvalidateQuery).toHaveBeenCalledTimes(2)
        expect(mockInvalidateTraceDetailFunction).toHaveBeenCalledTimes(1)
        expect(mockInvalidateTracesViewFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            id: traceId,
            title: 'Updated Title'
          }),
          variables
        )
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateTrace API with correct parameters', () => {
        expect(updateTraceSpy).toHaveBeenCalledWith(traceId, variables.updateTraceDTO)
        expect(updateTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should execute the updateTrace mutation successfully', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.data.value).toBeDefined()
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call both invalidation functions', () => {
        expect(mockInvalidateTraceDetailFunction).toHaveBeenCalledTimes(1)
        expect(mockInvalidateTracesViewFunction).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const traceId = 'trace1'
    const mutationArgs: MutationArgs = {}
    const variables: UpdateTraceVariables = {
      traceId,
      updateTraceDTO: {
        title: 'Updated Title',
        personalNote: 'Updated note',
        authorType: ETraceAuthorType.COLLECTIVE,
        iaJustification: 'AI justification',
        language: ELanguage.FRENCH
      }
    }

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateTrace API with correct parameters', () => {
        expect(updateTraceSpy).toHaveBeenCalledWith(traceId, variables.updateTraceDTO)
        expect(updateTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should execute the updateTrace mutation successfully', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.data.value).toBeDefined()
      })

      BddTest().then('it should still call both invalidation functions', () => {
        expect(mockInvalidateTraceDetailFunction).toHaveBeenCalledTimes(1)
        expect(mockInvalidateTracesViewFunction).toHaveBeenCalledTimes(1)
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
    const traceId = invalidTraceId
    const mutationArgs: MutationArgs = {
      onSuccess: mockOnSuccess,
      onError: mockOnError
    }
    const variables: UpdateTraceVariables = {
      traceId,
      updateTraceDTO: {
        title: 'Updated Title',
        personalNote: 'Updated note',
        authorType: ETraceAuthorType.PERSONAL,
        language: ELanguage.FRENCH
      }
    }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the updateTrace API with the invalid ID', () => {
        expect(updateTraceSpy).toHaveBeenCalledWith(traceId, variables.updateTraceDTO)
        expect(updateTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should attempt to update the trace with invalid ID', () => {
        expect(mutationResult.isError.value).toBe(true)
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

      BddTest().then('it should not call the invalidation functions on error', () => {
        expect(mockInvalidateTraceDetailFunction).not.toHaveBeenCalled()
        expect(mockInvalidateTracesViewFunction).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called using mutate with error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateTrace API with the invalid ID', () => {
        expect(updateTraceSpy).toHaveBeenCalledWith(traceId, variables.updateTraceDTO)
        expect(updateTraceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should attempt to update the trace with invalid ID', () => {
        expect(mutationResult.isError.value).toBe(true)
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

BddTest().given('a student traces summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    let queryResult: UseQueryReturnType<TraceOverviewDTO[], BaseApiException>

    beforeEach(async () => {
      queryResult = mountQueryComposable<UseQueryReturnType<TraceOverviewDTO[], BaseApiException>>(
        () => useStudentTracesSummaryQuery()
      )

      await flushPromises()
    })

    BddTest().then('it should return an array of trace overviews', async () => {
      await vi.waitFor(() => {
        expect(Array.isArray(queryResult.data.value)).toBe(true)
      })
    })
  })
})

BddTest().given('a useTraceAssociationsQuery composable', async () => {
  let getTraceAssociationsSpy: MockInstance<
    (traceId: string, params?: GetTraceAssociationsParams, options?: RequestInit) => Promise<TraceAssociationsDTO>
  >

  beforeEach(async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    getTraceAssociationsSpy = vi.spyOn<
      typeof import('@/api/avenir-esr'),
      'getTraceAssociations'
    >(
        await import('@/api/avenir-esr'),
        'getTraceAssociations'
        )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a trace associations query', () => {
    const traceId = ref('trace-1')

    BddTest().when('the query is executed successfully', () => {
      BddTest().then('it should call getTraceAssociations API and return associations', async () => {
        const { data } = mountQueryComposable<
          UseQueryReturnType<TraceAssociationsDTO, BaseApiException>
        >(() => useTraceAssociationsQuery(traceId))

        await flushPromises()

        expect(getTraceAssociationsSpy).toHaveBeenCalledTimes(1)
        expect(getTraceAssociationsSpy).toHaveBeenCalledWith('trace-1')

        expect(data.value).toBeDefined()
      })

      BddTest().then('it should expose traceAssociations computed', async () => {
        const queryReturn = mountQueryComposable(() =>
          useTraceAssociationsQuery(traceId)
        )

        await flushPromises()

        expect(queryReturn.traceAssociations.value).toBeDefined()
      })

      BddTest().then('it should mark the query as successful', async () => {
        const queryReturn = mountQueryComposable(() =>
          useTraceAssociationsQuery(traceId)
        )

        await flushPromises()

        expect(queryReturn.isSuccess.value).toBe(true)
        expect(queryReturn.isError.value).toBe(false)
        expect(queryReturn.isLoading.value).toBe(false)
      })
    })

    BddTest().when('traceId is empty', () => {
      const emptyTraceId = ref('')

      BddTest().then('it should not call the API', async () => {
        mountQueryComposable(() =>
          useTraceAssociationsQuery(emptyTraceId)
        )

        await flushPromises()

        expect(getTraceAssociationsSpy).not.toHaveBeenCalled()
      })

      BddTest().then('query should stay disabled', async () => {
        const queryReturn = mountQueryComposable(() =>
          useTraceAssociationsQuery(emptyTraceId)
        )

        await flushPromises()

        expect(queryReturn.isSuccess.value).toBe(false)
      })
    })

    BddTest().when('the query is called multiple times', () => {
      BddTest().then('it should use TanStack Query caching', async () => {
        function useMultipleCalls () {
          useTraceAssociationsQuery(traceId)
          return useTraceAssociationsQuery(traceId)
        }

        mountQueryComposable(() => useMultipleCalls())

        await flushPromises()
        await flushPromises()

        expect(getTraceAssociationsSpy).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().when('the query encounters an error', () => {
      BddTest().then('it should handle error state correctly', async () => {
        const queryReturn = mountQueryComposable(() =>
          useTraceAssociationsQuery('INVALID_TRACE_ID')
        )
        await flushPromises()
        expect(queryReturn.error.value).toBeDefined()
        expect(queryReturn.isSuccess.value).toBe(false)
      })
    })
  })
})

BddTest().given('a useDeleteTraceAssociationsMutation composable', async () => {
  let deleteTraceAssociationsSpy: MockInstance<(traceId: string, deleteTraceAssociationsBody: string[], options?: RequestInit | undefined) => Promise<string>>
  let mutationResult: ReturnType<typeof useDeleteTraceAssociationsMutation>

  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs: MutationArgs<string, DeleteTraceAssociationsMutationVariables> = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    deleteTraceAssociationsSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'deleteTraceAssociations'>(
      await import('@/api/avenir-esr'),
    'deleteTraceAssociations'
    )

    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid trace ID and association IDs with success callback', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const associationIds = ['assoc-1', 'assoc-2']
    const variables: DeleteTraceAssociationsMutationVariables = { traceId, associationIds }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceAssociationsMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTraceAssociations API with correct parameters', () => {
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledWith(traceId, associationIds)
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should call the invalidation function once for both queries', () => {
        expect(mockUseInvalidateQuery).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(2)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(
          expect.any(String),
          variables
        )
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceAssociationsMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTraceAssociations API with correct parameters', () => {
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledWith(traceId, associationIds)
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function for both queries', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(2)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const associationIds = ['assoc-1']
    const variables: DeleteTraceAssociationsMutationVariables = { traceId, associationIds }
    const emptyMutationArgs: MutationArgs<string, DeleteTraceAssociationsMutationVariables> = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceAssociationsMutation(emptyMutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTraceAssociations API with correct parameters', () => {
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledWith(traceId, associationIds)
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function for both queries', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(2)
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
    const variables: DeleteTraceAssociationsMutationVariables = {
      traceId: invalidTraceId,
      associationIds: ['assoc-1']
    }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceAssociationsMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the deleteTraceAssociations API with the invalid ID', () => {
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledWith(invalidTraceId, variables.associationIds)
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledTimes(1)
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
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceAssociationsMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the deleteTraceAssociations API with the invalid ID', () => {
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledWith(invalidTraceId, variables.associationIds)
        expect(deleteTraceAssociationsSpy).toHaveBeenCalledTimes(1)
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

BddTest().given('a useSearchActivitiesForAssociationQuery composable', () => {
  let searchActivitiesForAssociationSpy: MockInstance

  beforeEach(async () => {
    searchActivitiesForAssociationSpy = vi.spyOn(
      await import('@/api/avenir-esr'),
      'searchDeclaredActivityForAssociation'
    )
  })

  BddTest().and('a valid trace ID', () => {
    const traceId = ref('trace-123')
    const params: SearchActivitiesForAssociationQueryParams['params'] = ref({ page: 0, pageSize: 10, search: 'activity' })

    BddTest().when('the query is mounted', () => {
      let queryResult: ReturnType<typeof useSearchActivitiesForAssociationQuery>

      beforeEach(async () => {
        searchActivitiesForAssociationSpy.mockResolvedValue(createMockedSearchActivitiesForAssociationResponse())
        queryResult = mountQueryComposable(() => useSearchActivitiesForAssociationQuery({ traceId, params }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredActivityForAssociation API', () => {
        expect(searchActivitiesForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
      })

      BddTest().then('it should return activities from data', () => {
        expect(queryResult.activities.value).toEqual(mockedTraceActivitySearchResults)
      })

      BddTest().then('it should return page info from data', () => {
        expect(queryResult.pageInfo.value).toMatchObject({
          page: 0,
          pageSize: 100,
          totalElements: mockedTraceActivitySearchResults.length,
          totalPages: 1
        })
      })

      BddTest().then('it should mark the query as successful', () => {
        expect(queryResult.isSuccess.value).toBe(true)
        expect(queryResult.isError.value).toBe(false)
      })
    })

    BddTest().when('the query fails', () => {
      let queryResult: ReturnType<typeof useSearchActivitiesForAssociationQuery>

      beforeEach(async () => {
        searchActivitiesForAssociationSpy.mockRejectedValue(new Error('Network error'))
        queryResult = mountQueryComposable(() => useSearchActivitiesForAssociationQuery({ traceId, params }))
        await flushPromises()
      })

      BddTest().then('it should return empty activities on error', () => {
        expect(queryResult.activities.value).toEqual([])
      })

      BddTest().then('it should return default page info on error', () => {
        expect(queryResult.pageInfo.value).toEqual({
          page: 0,
          pageSize: 0,
          totalElements: 0,
          totalPages: 0
        })
      })
    })

    BddTest().when('enabled is explicitly false', () => {
      beforeEach(async () => {
        searchActivitiesForAssociationSpy.mockResolvedValue(createMockedSearchActivitiesForAssociationResponse())
        mountQueryComposable(() => useSearchActivitiesForAssociationQuery({
          traceId,
          params,
          enabled: ref(false)
        }))
        await flushPromises()
      })

      BddTest().then('it should not call the searchDeclaredActivityForAssociation API', () => {
        expect(searchActivitiesForAssociationSpy).not.toHaveBeenCalled()
      })
    })

    BddTest().when('enabled is explicitly true', () => {
      let queryResult: ReturnType<typeof useSearchActivitiesForAssociationQuery>

      beforeEach(async () => {
        searchActivitiesForAssociationSpy.mockResolvedValue(createMockedSearchActivitiesForAssociationResponse())
        queryResult = mountQueryComposable(() => useSearchActivitiesForAssociationQuery({
          traceId,
          params,
          enabled: ref(true)
        }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredActivityForAssociation API', () => {
        expect(searchActivitiesForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
      })

      BddTest().then('it should mark the query as successful', () => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().when('enabled switches from false to true', () => {
      let enabled: Ref<boolean>
      let queryResult: ReturnType<typeof useSearchActivitiesForAssociationQuery>

      beforeEach(async () => {
        searchActivitiesForAssociationSpy.mockResolvedValue(createMockedSearchActivitiesForAssociationResponse())
        enabled = ref(false)
        queryResult = mountQueryComposable(() => useSearchActivitiesForAssociationQuery({
          traceId,
          params,
          enabled
        }))
        await flushPromises()
      })

      BddTest().then('it should not call the searchDeclaredActivityForAssociation API while disabled', () => {
        expect(searchActivitiesForAssociationSpy).not.toHaveBeenCalled()
      })

      BddTest().then('it should call the searchDeclaredActivityForAssociation API once enabled', async () => {
        enabled.value = true
        await flushPromises()
        expect(searchActivitiesForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().when('enabled switches from true to false', () => {
      let enabled: Ref<boolean>

      beforeEach(async () => {
        enabled = ref(true)
        mountQueryComposable(() => useSearchActivitiesForAssociationQuery({
          traceId,
          params,
          enabled
        }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredActivityForAssociation API while enabled', () => {
        expect(searchActivitiesForAssociationSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not re-call the searchDeclaredActivityForAssociation API after being disabled even if params change', async () => {
        enabled.value = false
        await flushPromises()
        expect(searchActivitiesForAssociationSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('an empty trace ID with enabled true', () => {
    const traceId = ref('')
    const params: SearchActivitiesForAssociationQueryParams['params'] = ref({ page: 0, pageSize: 10, search: '' })

    BddTest().when('the query is mounted with enabled true but empty traceId', () => {
      beforeEach(async () => {
        searchActivitiesForAssociationSpy.mockResolvedValue(createMockedSearchActivitiesForAssociationResponse())
        mountQueryComposable(() => useSearchActivitiesForAssociationQuery({
          traceId,
          params,
          enabled: ref(true)
        }))
        await flushPromises()
      })

      BddTest().then('it should not call the searchDeclaredActivityForAssociation API', () => {
        expect(searchActivitiesForAssociationSpy).not.toHaveBeenCalled()
      })
    })
  })
})

BddTest().given('a useAssociateTraceWithActivitiesMutation composable', () => {
  let associateTraceWithActivitiesSpy: MockInstance
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()

  const mutationArgs: MutationArgs<TraceAssociationsDTO, AssociateTraceWithActivitiesVariables> = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
    associateTraceWithActivitiesSpy = vi.spyOn(
      await import('@/api/avenir-esr'),
      'associateTraceWithActivities'
    )
    mockOnSuccess.mockReset()
    mockOnError.mockReset()
    mockInvalidateFunction.mockReset().mockResolvedValue(undefined)
  })

  BddTest().and('a valid trace ID', () => {
    const variables: AssociateTraceWithActivitiesVariables = {
      traceId: 'trace-123',
      associationsCreationRequest: {
        idsToAssociate: ['activity-1', 'activity-2']
      }
    }

    BddTest().when('the mutation is called successfully', () => {
      let mutationResult: ReturnType<typeof useAssociateTraceWithActivitiesMutation>

      beforeEach(async () => {
        const mockedResponse: TraceAssociationsDTO = { declaredActivityAssociations: [], declaredSkillAssociations: [] }
        associateTraceWithActivitiesSpy.mockResolvedValue(mockedResponse)
        mutationResult = mountQueryComposable(() => useAssociateTraceWithActivitiesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the associateTraceWithActivities API', () => {
        expect(associateTraceWithActivitiesSpy).toHaveBeenCalledWith(
          variables.traceId,
          variables.associationsCreationRequest
        )
      })

      BddTest().then('it should invalidate the trace associations query', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })
    })

    BddTest().when('the mutation fails', () => {
      let mutationResult: ReturnType<typeof useAssociateTraceWithActivitiesMutation>

      beforeEach(async () => {
        associateTraceWithActivitiesSpy.mockRejectedValue(new Error('Network error'))
        mutationResult = mountQueryComposable(() => useAssociateTraceWithActivitiesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
      })

      BddTest().then('it should call the onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not call the onSuccess callback', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      BddTest().then('it should not invalidate the query on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })
    })
  })
})

BddTest().given('a useSearchDeclaredSkillsForAssociationWithTraceQuery composable', () => {
  let searchDeclaredSkillForAssociationSpy: MockInstance

  beforeEach(async () => {
    vi.clearAllMocks()
    searchDeclaredSkillForAssociationSpy = vi.spyOn(
      await import('@/api/avenir-esr'),
      'searchDeclaredSkillForAssociation'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid trace ID', () => {
    const traceId = ref('trace-123')
    const params: UseDeclaredSkillsForAssociationQueryParams['params'] = ref({ page: 0, pageSize: 10 })

    BddTest().when('the query is mounted', () => {
      let queryResult: ReturnType<typeof useSearchDeclaredSkillsForAssociationWithTraceQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({ traceId, params }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredSkillForAssociation API', () => {
        expect(searchDeclaredSkillForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
      })

      BddTest().then('it should return skills from data', () => {
        expect(queryResult.skills.value).toEqual(mockedSkillSearchResults)
      })

      BddTest().then('it should return page info from data', () => {
        expect(queryResult.pageInfo.value).toMatchObject({
          page: 0,
          pageSize: 10,
          totalElements: mockedSkillSearchResults.length,
          totalPages: 1
        })
      })

      BddTest().then('it should mark the query as successful', () => {
        expect(queryResult.isSuccess.value).toBe(true)
        expect(queryResult.isError.value).toBe(false)
      })
    })

    BddTest().when('the query fails with a server error', () => {
      let queryResult: ReturnType<typeof useSearchDeclaredSkillsForAssociationWithTraceQuery>

      beforeEach(async () => {
        server.use(searchSkillsForAssociationErrorHandler)
        queryResult = mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({ traceId, params }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredSkillForAssociation API', () => {
        expect(searchDeclaredSkillForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
      })

      BddTest().then('it should be in error state', async () => {
        await vi.waitFor(() => {
          expect(queryResult.isError.value).toBe(true)
        })
        expect(queryResult.isSuccess.value).toBe(false)
      })

      BddTest().then('it should return empty skills on error', () => {
        expect(queryResult.skills.value).toEqual([])
      })

      BddTest().then('it should return default page info on error', () => {
        expect(queryResult.pageInfo.value).toEqual({
          page: 0,
          pageSize: 0,
          totalElements: 0,
          totalPages: 0
        })
      })
    })

    BddTest().when('enabled is explicitly false', () => {
      beforeEach(async () => {
        mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({
          traceId,
          params,
          enabled: ref(false)
        }))
        await flushPromises()
      })

      BddTest().then('it should not call the searchDeclaredSkillForAssociation API', () => {
        expect(searchDeclaredSkillForAssociationSpy).not.toHaveBeenCalled()
      })
    })

    BddTest().when('enabled is explicitly true', () => {
      let queryResult: ReturnType<typeof useSearchDeclaredSkillsForAssociationWithTraceQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({
          traceId,
          params,
          enabled: ref(true)
        }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredSkillForAssociation API', () => {
        expect(searchDeclaredSkillForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
      })

      BddTest().then('it should mark the query as successful', () => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().when('enabled switches from false to true', () => {
      let enabled: Ref<boolean>
      let queryResult: ReturnType<typeof useSearchDeclaredSkillsForAssociationWithTraceQuery>

      beforeEach(async () => {
        enabled = ref(false)
        queryResult = mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({
          traceId,
          params,
          enabled
        }))
        await flushPromises()
      })

      BddTest().then('it should not call the searchDeclaredSkillForAssociation API while disabled', () => {
        expect(searchDeclaredSkillForAssociationSpy).not.toHaveBeenCalled()
      })

      BddTest().then('it should call the searchDeclaredSkillForAssociation API once enabled', async () => {
        enabled.value = true
        await flushPromises()
        expect(searchDeclaredSkillForAssociationSpy).toHaveBeenCalledWith(traceId.value, params.value)
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().when('enabled switches from true to false', () => {
      let enabled: Ref<boolean>

      beforeEach(async () => {
        enabled = ref(true)
        mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({
          traceId,
          params,
          enabled
        }))
        await flushPromises()
      })

      BddTest().then('it should call the searchDeclaredSkillForAssociation API while enabled', () => {
        expect(searchDeclaredSkillForAssociationSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not re-call the searchDeclaredSkillForAssociation API after being disabled even if params change', async () => {
        enabled.value = false
        await flushPromises()
        expect(searchDeclaredSkillForAssociationSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('an empty trace ID with enabled true', () => {
    const traceId = ref('')
    const params: UseDeclaredSkillsForAssociationQueryParams['params'] = ref({ page: 0, pageSize: 10 })

    BddTest().when('the query is mounted with enabled true but empty traceId', () => {
      beforeEach(async () => {
        mountQueryComposable(() => useSearchDeclaredSkillsForAssociationWithTraceQuery({
          traceId,
          params,
          enabled: ref(true)
        }))
        await flushPromises()
      })

      BddTest().then('it should not call the searchDeclaredSkillForAssociation API', () => {
        expect(searchDeclaredSkillForAssociationSpy).not.toHaveBeenCalled()
      })
    })
  })
})

BddTest().given('a useAssociateTraceWithDeclaredSkillsMutation composable', () => {
  let associateTraceWithDeclaredSkillSpy: MockInstance
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()

  const mutationArgs: MutationArgs<TraceAssociationsDTO, AssociateTraceWithDeclaredSkillsVariables> = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
    associateTraceWithDeclaredSkillSpy = vi.spyOn(
      await import('@/api/avenir-esr'),
      'associateTraceWithDeclaredSkill'
    )
    mockOnSuccess.mockReset()
    mockOnError.mockReset()
    mockInvalidateFunction.mockReset().mockResolvedValue(undefined)
  })

  BddTest().and('a valid trace ID', () => {
    const variables: AssociateTraceWithDeclaredSkillsVariables = {
      traceId: 'trace-123',
      associationsCreationRequest: {
        idsToAssociate: ['skill-1', 'skill-2']
      }
    }

    BddTest().when('the mutation is called successfully', () => {
      let mutationResult: ReturnType<typeof useAssociateTraceWithDeclaredSkillsMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useAssociateTraceWithDeclaredSkillsMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the associateTraceWithDeclaredSkill API', () => {
        expect(associateTraceWithDeclaredSkillSpy).toHaveBeenCalledWith(
          variables.traceId,
          variables.associationsCreationRequest
        )
      })

      BddTest().then('it should invalidate the trace associations query', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })
    })

    BddTest().when('the mutation fails with a server error', () => {
      let mutationResult: ReturnType<typeof useAssociateTraceWithDeclaredSkillsMutation>

      beforeEach(async () => {
        server.use(associateTraceWithDeclaredSkillsErrorHandler)
        mutationResult = mountQueryComposable(() => useAssociateTraceWithDeclaredSkillsMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the associateTraceWithDeclaredSkill API', () => {
        expect(associateTraceWithDeclaredSkillSpy).toHaveBeenCalledWith(
          variables.traceId,
          variables.associationsCreationRequest
        )
      })

      BddTest().then('it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
      })

      BddTest().then('it should call the onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not call the onSuccess callback', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      BddTest().then('it should not invalidate the query on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })
    })
  })
})
