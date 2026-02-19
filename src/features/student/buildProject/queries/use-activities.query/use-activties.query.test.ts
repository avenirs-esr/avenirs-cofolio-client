import type { ActivityDetailDTO } from '@/api/avenir-esr/generated/types/activityDetailDTO'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import { useInvalidateQuery } from '@/common/composables'
import { type UnsubscribeActivitiesVariables, useActivityDetailQuery, useUnsubscribeActivitiesMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, type MockedFunction, type MockInstance } from 'vitest'

vi.mock('@/common/composables', async () => {
  return {
    useInvalidateQuery: vi.fn()
  }
})

BddTest().given('an useActivityDetailQuery composable', () => {
  let useActivityDetailQueryReturn: ReturnType<typeof useActivityDetailQuery>
  let getActivityDetailSpy: MockInstance<(activityId: string, options?: RequestInit | undefined) => Promise<ActivityDetailDTO>>

  beforeEach(async () => {
    vi.clearAllMocks()

    getActivityDetailSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getActivityDetail'>(
      await import('@/api/avenir-esr'),
    'getActivityDetail'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid activity id', () => {
    const activityId = ref(mockedActivityDetail.id ?? '')

    BddTest().when('the query is executed', () => {
      beforeEach(async () => {
        useActivityDetailQueryReturn = mountQueryComposable(() => useActivityDetailQuery(activityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with activity id', async () => {
        expect(getActivityDetailSpy).toHaveBeenCalledWith(activityId.value)
      })

      BddTest().then('it should return the mocked activity details', () => {
        expect(useActivityDetailQueryReturn.data.value).toBeDefined()
        expect(useActivityDetailQueryReturn.data.value).toMatchObject(mockedActivityDetail)
      })
    })
  })

  BddTest().and('an invalid activity id', () => {
    const activityId = ref('INVALID_ACTIVITY_ID')

    BddTest().when('the query is executed', () => {
      beforeEach(async () => {
        useActivityDetailQueryReturn = mountQueryComposable(() => useActivityDetailQuery(activityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with invalid activity id', async () => {
        expect(getActivityDetailSpy).toHaveBeenCalledWith(activityId.value)
      })

      BddTest().then('it should not fetch data', () => {
        expect(useActivityDetailQueryReturn.data.value).toBeUndefined()
      })
    })
  })
})

BddTest().given('a unsubscribe activities mutation', () => {
  let unsubscribeActivityProgressesSpy: MockInstance<(activityIds: string[], options?: (RequestInit | undefined)) => Promise<string>>
  let mutationResult: ReturnType<typeof useUnsubscribeActivitiesMutation>

  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    unsubscribeActivityProgressesSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'unsubscribeActivityProgresses'>(
      await import('@/api/avenir-esr'),
    'unsubscribeActivityProgresses'
    )

    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('valid element IDs and success callback', () => {
    const elementsIds = ['activity-1-id', 'activity-2-id', 'activity-3-id']
    const variables: UnsubscribeActivitiesVariables = { activitiesIds: elementsIds }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with correct parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
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
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(elementsIds.length)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(mutationResult.data.value as string, variables)
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with correct parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(elementsIds.length)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const elementsIds = ['activity-1-id', 'activity-2-id', 'activity-3-id']
    const variables: UnsubscribeActivitiesVariables = { activitiesIds: elementsIds }
    const mutationArgs = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with correct parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(elementsIds.length)
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

  BddTest().and('an invalid activity id in activitiesIds with error callback', () => {
    const elementsIds: string[] = ['activity-id-1', 'INVALID_ACTIVITY_ID', 'activity-id-3']
    const variables: UnsubscribeActivitiesVariables = { activitiesIds: elementsIds }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
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
      let mutationResult: ReturnType<typeof useUnsubscribeActivitiesMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
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

  BddTest().and('an empty elementsIds with error callback', () => {
    const elementsIds: string[] = []
    const variables: UnsubscribeActivitiesVariables = { activitiesIds: elementsIds }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
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
      let mutationResult: ReturnType<typeof useUnsubscribeActivitiesMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUnsubscribeActivitiesMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the unsubscribeActivityProgresses API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressesSpy).toHaveBeenCalledTimes(1)
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
