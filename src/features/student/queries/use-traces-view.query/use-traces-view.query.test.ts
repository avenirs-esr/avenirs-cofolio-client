import type { UseQueryReturnType } from '@tanstack/vue-query'
import { deleteTrace, type TracesViewResponse, type UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { BaseApiException } from '@/common/exceptions'
import { createDeletedTraceIdMock, createMockedTracesViewResponse, mockedUnassignedTracesSummary } from '@/features/student/queries/fixtures'

import { type DeleteTraceVariables, useDeleteTraceMutation, type UseDeleteTraceMutationArgs, useUnassignedTracesSummaryQuery, useUnassignedTracesViewQuery } from '@/features/student/queries/use-traces-view.query/use-traces-view.query'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'

import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...original,
    deleteTrace: vi.fn(),
  }
})

vi.mock('@/common/composables', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...original,
    useInvalidateQuery: vi.fn(),
  }
})

// TODO: Remove this mock when the API is implemented
vi.mock('@/features/student/queries/fixtures', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/features/student/queries/fixtures')>()
  return {
    ...original,
    createDeletedTraceIdMock: vi.fn(),
  }
})

describe('useTracesViewQuery', async () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return mocked traces data for given page and pageSize', async () => {
    const mockedData = createMockedTracesViewResponse(4, 20, 1)

    const { data } = mountQueryComposable<UseQueryReturnType<TracesViewResponse, BaseApiException>>(
      () => useUnassignedTracesViewQuery(ref(1), ref(4))
    )

    await flushPromises()

    expect(data.value).toEqual(mockedData)
    expect(data.value?.data.traces).toHaveLength(4)
    expect(data.value?.page.number).toBe(1)
    expect(data.value?.page.totalElements).toBe(20)
    expect(data.value?.page.totalPages).toBe(5)
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

describe('useDeleteTraceMutation', () => {
  const mockDeleteTrace = deleteTrace as MockedFunction<typeof deleteTrace>
  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  // TODO: Remove this mock when the API is implemented
  const mockCreateDeletedTraceIdMock = createDeletedTraceIdMock as MockedFunction<typeof createDeletedTraceIdMock>
  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs: UseDeleteTraceMutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
  })

  describe('given a valid trace ID and success callback', () => {
    const traceId = '123e4567-e89b-12d3-a456-426614174000'
    const variables: DeleteTraceVariables = { traceId }

    beforeEach(() => {
      mockDeleteTrace.mockResolvedValue(traceId)
      // TODO: Remove this mock when the API is implemented
      mockCreateDeletedTraceIdMock.mockReturnValue(traceId)
    })

    describe('when the mutation is called with mutateAsync', () => {
      let mutationResult: ReturnType<typeof useDeleteTraceMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      // TODO: enable this test when the deleteTrace API is implemented
      it.skip('then it should call the deleteTrace API with correct parameters', () => {
        expect(mockDeleteTrace).toHaveBeenCalledWith(traceId)
        expect(mockDeleteTrace).toHaveBeenCalledTimes(1)
      })

      it('then it should return the expected success response', () => {
        expect(mutationResult.data.value).toBe(traceId)
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
      let mutationResult: ReturnType<typeof useDeleteTraceMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      // TODO: enable this test when the deleteTrace API is implemented
      it.skip('then it should call the deleteTrace API with correct parameters', () => {
        expect(mockDeleteTrace).toHaveBeenCalledWith(traceId)
        expect(mockDeleteTrace).toHaveBeenCalledTimes(1)
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

    beforeEach(() => {
      vi.clearAllMocks()
      mockDeleteTrace.mockResolvedValue(traceId)
      // TODO: Remove this mock when the API is implemented
      mockCreateDeletedTraceIdMock.mockReturnValue(traceId)
    })

    describe('when the mutation is called without callbacks', () => {
      let mutationResult: ReturnType<typeof useDeleteTraceMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      it('then it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      it('then it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })

      it('then it should return the expected response', () => {
        expect(mutationResult.data.value).toBe(traceId)
      })
    })
  })

  describe('given an invalid trace ID with error callback', () => {
    const invalidTraceId = 'invalid-trace-id'
    const variables: DeleteTraceVariables = { traceId: invalidTraceId }
    const expectedError = new BaseApiException(
      'Trace not found',
      404,
    )

    beforeEach(() => {
      mockDeleteTrace.mockRejectedValue(expectedError)
      mockCreateDeletedTraceIdMock.mockRejectedValue(expectedError)
    })

    describe('when the mutation encounters an error', () => {
      let mutationResult: ReturnType<typeof useDeleteTraceMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useDeleteTraceMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      it.skip('then it should call the deleteTrace API with the invalid ID', () => {
        expect(mockDeleteTrace).toHaveBeenCalledWith(invalidTraceId)
        expect(mockDeleteTrace).toHaveBeenCalledTimes(1)
      })

      it('then it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      it('then it should contain the error information', () => {
        expect(mutationResult.error.value).toEqual(expectedError)
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

      it('then it should contain the error information', () => {
        expect(mutationResult.error.value).toEqual(expectedError)
        expect(mutationResult.isError.value).toBe(true)
      })

      it('then it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })
    })
  })
})
