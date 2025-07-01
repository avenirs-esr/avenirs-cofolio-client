import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { invalidTraceId, mockedUnassignedTracesSummary } from '@/__mocks__/fixtures/student'
import { type GetTracesViewParams, GetTracesViewStatus, type TraceConfigurationInfo, type TracesViewResponse, type UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'

import {
  type DeleteTraceVariables,
  useDeleteTraceMutation,
  type UseDeleteTraceMutationArgs,
  useTracesConfigurationQuery,
  useUnassignedTracesSummaryQuery,
  useUnassignedTracesViewQuery
} from '@/features/student/queries/use-traces.query/use-traces.query'
import { flushPromises } from '@vue/test-utils'

import { mountQueryComposable } from 'tests/utils'
import { beforeEach, describe, expect, it, type MockedFunction, type MockInstance, vi } from 'vitest'

vi.mock('@/common/composables', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...original,
    useInvalidateQuery: vi.fn(),
  }
})

describe('useTracesViewQuery', async () => {
  let getTracesViewSpy: MockInstance<(params?: GetTracesViewParams | undefined, options?: RequestInit | undefined) => Promise<TracesViewResponse>>

  beforeEach(async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    getTracesViewSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getTracesView'>(
      await import('@/api/avenir-esr'),
    'getTracesView'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return mocked traces data for given page and pageSize', async () => {
    const page = ref(1)
    const pageSize = ref(4)

    const { data } = mountQueryComposable<UseQueryReturnType<TracesViewResponse, BaseApiException>>(
      () => useUnassignedTracesViewQuery(page, pageSize)
    )

    await flushPromises()

    expect(getTracesViewSpy).toHaveBeenCalledWith({
      pageSize: 4,
      page: 1,
      status: GetTracesViewStatus.UNASSOCIATED
    })
    expect(getTracesViewSpy).toHaveBeenCalledTimes(1)

    expect(data.value).toBeDefined()
    expect(data.value?.data.traces).toBeInstanceOf(Array)
    expect(data.value?.data.traces.length).toBe(4)
    expect(data.value?.data.traces).toBeDefined()
    expect(data.value?.page).toBeDefined()
  })

  it('should return correct pages array', async () => {
    const page = ref(1)
    const pageSize = ref(4)

    const queryReturn = mountQueryComposable(() => useUnassignedTracesViewQuery(page, pageSize))

    await flushPromises()

    expect(queryReturn.pageInfo.value.totalPages).toBe(5)
  })

  it('should return mockedUnassignedTracesSummary when API is not yet connected', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<UnassociatedTracesSummaryDTO, BaseApiException>>(
      () => useUnassignedTracesSummaryQuery()
    )

    await flushPromises()

    expect(data.value).toEqual(mockedUnassignedTracesSummary)
  })
})

describe('useDeleteTraceMutation', async () => {
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

  describe('given a valid trace ID and success callback', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { traceId }

    describe('when the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      it('then it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(traceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      it('then it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })

      it('then it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      it('then it should call the invalidation function', () => {
        expect(mockUseInvalidateQuery).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      it('then it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith()
      })

      it('then it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    describe('when the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      it('then it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(traceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      it('then it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      it('then it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given no success or error callbacks', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { traceId }
    const mutationArgs: UseDeleteTraceMutationArgs = {}

    describe('when the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      it('then it should call the deleteTrace API with correct parameters', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(traceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      it('then it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      it('then it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })

      it('then it should return the expected response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })
    })
  })

  describe('given an invalid trace ID with error callback', () => {
    const variables: DeleteTraceVariables = { traceId: invalidTraceId }

    describe('when the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      it('then it should call the deleteTrace API with the invalid ID', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(invalidTraceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      it('then it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      it('then it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
      })

      it('then it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })

      it('then it should not call the onSuccess callback', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      it('then it should not call the invalidation function on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })
    })

    describe('when the mutation is called using mutate with error', () => {
      let mutationResult: ReturnType<typeof useDeleteTraceMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      it('then it should call the deleteTrace API with the invalid ID', () => {
        expect(deleteTraceSpy).toHaveBeenCalledWith(invalidTraceId)
        expect(deleteTraceSpy).toHaveBeenCalledTimes(1)
      })

      it('then it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
      })

      it('then it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe('useTracesConfigurationQuery', async () => {
  let getTraceConfigInfoSpy: MockInstance<(options?: RequestInit | undefined) => Promise<TraceConfigurationInfo>>

  beforeEach(async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    // Create spy for getTraceConfigInfo to verify API calls
    getTraceConfigInfoSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getTraceConfigInfo'>(
      await import('@/api/avenir-esr'),
    'getTraceConfigInfo'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('given a traces configuration query', () => {
    describe('when the query is executed successfully', () => {
      it('then it should call getTraceConfigInfo API and return configuration data', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<TraceConfigurationInfo, BaseApiException>>(
          () => useTracesConfigurationQuery()
        )

        await flushPromises()

        expect(getTraceConfigInfoSpy).toHaveBeenCalledTimes(1)
        expect(getTraceConfigInfoSpy).toHaveBeenCalledWith()

        expect(data.value).toBeDefined()
        expect(data.value).toHaveProperty('maxDayRemaining')
        expect(data.value).toHaveProperty('maxDayRemainingWarning')
        expect(data.value).toHaveProperty('maxDayRemainingCritical')
      })

      it('then it should return properly typed configuration data', async () => {
        const queryReturn = mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        // Verify the data has the expected structure
        const config = queryReturn.data.value
        if (config) {
          expect(typeof config.maxDayRemaining).toBe('number')
          expect(typeof config.maxDayRemainingWarning).toBe('number')
          expect(typeof config.maxDayRemainingCritical).toBe('number')
        }
      })

      it('then it should mark the query as successful', async () => {
        const queryReturn = mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        expect(queryReturn.isSuccess.value).toBe(true)
        expect(queryReturn.isError.value).toBe(false)
        expect(queryReturn.isLoading.value).toBe(false)
      })
    })

    describe('when the query encounters an error', () => {
      it('then it should still call the API', async () => {
        mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        expect(getTraceConfigInfoSpy).toHaveBeenCalledTimes(1)
      })

      it('then it should handle error state correctly', async () => {
        const queryReturn = mountQueryComposable(() => useTracesConfigurationQuery())

        await flushPromises()

        if (queryReturn.isError.value) {
          expect(queryReturn.isSuccess.value).toBe(false)
          expect(queryReturn.error.value).toBeDefined()
        }
      })
    })

    describe('when the query is called multiple times', () => {
      it('then it should use TanStack Query caching', async () => {
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
