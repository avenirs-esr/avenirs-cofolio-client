import type { useInvalidateQuery } from '@/common/composables'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import {
  activitiesNavigationMock,
  createMockedDeclaredActivityAssociationsDTO,
  mockedActivityDetail,
  mockedDeclaredActivity,
  mockedDeclaredActivityAssociations
} from '@/__mocks__/fixtures/student/activities.fixtures'
import {
  activityNavigationQuery,
  activityNavigationQueryError,
  associateActivityWithTracesErrorHandler,
  deleteDeclaredActivityAssociationsErrorHandler,
  libraryActivitiesErrorHandler,
  updateActivityPeriodHandler,
} from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  type ActivityDetailDTO,
  type ActivityNavigationDTO,
  type AssociationsCreationRequest,
  type DeclaredActivity,
  type DeclaredActivityAssociationsDTO,
  type DeclaredActivityDetailsDTO,
  type DeclaredActivityPeriodRequest,
  EActivityThematic,
  type getDeclaredActivitiesView,
  type SubscribeDeclaredActivityRequest,
  type UpdateReflectionRequest,
} from '@/api/avenir-esr'
import {
  type AssociateActivityWithTracesVariables,
  type FinishDeclaredActivityVariables,
  type SubscribeActivityVariables,
  type UnsubscribeActivitiesVariables,
  type UpdateActivityPeriodVariables,
  type UpdateActivityReflectionVariables,
  useActivitiesNavigationQuery,
  useActivityDetailQuery,
  useAssociateActivityWithTracesMutation,
  useCountLibraryActivities,
  useDeclaredActivitiesDetailedQuery,
  useDeleteDeclaredActivityAssociationsMutation,
  useFinishDeclaredActivityMutation,
  useGetDeclaredActivityAssociationsQuery,
  useLibraryActivitiesQuery,
  useSubscribeActivityMutation,
  useUnsubscribeActivitiesMutation,
  useUpdateActivityPeriodMutation,
  useUpdateActivityReflectionMutation,
} from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, type MockInstance, vi } from 'vitest'

BddTest().given('the useActivitiesNavigationQuery composable', () => {
  BddTest().when('the query is executed', () => {
    let queryResult: UseQueryReturnType<ActivityNavigationDTO[], BaseApiException> & {
      activities: Ref<ActivityNavigationDTO[] | undefined>
    }

    beforeEach(async () => {
      server.use(activityNavigationQuery)

      queryResult = mountQueryComposable(() => useActivitiesNavigationQuery())
      await flushPromises()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    BddTest().then('it should return the activities navigation array', () => {
      expect(queryResult.data.value).toEqual(activitiesNavigationMock)
    })

    BddTest().then('it should expose computed activities as query.data', () => {
      expect(queryResult.activities.value).toEqual(activitiesNavigationMock)

      const futurePlansMenu = queryResult.activities.value?.find(m => m.title === EActivityThematic.FUTURE_PLANS)
      expect(futurePlansMenu).toBeDefined()
      expect(futurePlansMenu?.items).toHaveLength(4)
    })

    BddTest().then('it should have query state flags', () => {
      expect(queryResult.isError).toBeDefined()
      expect(queryResult.isPending).toBeDefined()
      expect(queryResult.isSuccess).toBeDefined()
    })
  })

  BddTest().when('the API call fails', () => {
    let queryResult: UseQueryReturnType<ActivityNavigationDTO[], BaseApiException> & {
      activities: Ref<ActivityNavigationDTO[] | undefined>
    }

    beforeEach(async () => {
      server.use(activityNavigationQueryError)

      queryResult = mountQueryComposable(() => useActivitiesNavigationQuery())
      await flushPromises()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    BddTest().then('it should be in error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })
      expect(queryResult.data.value).toBeUndefined()
    })
  })
})

BddTest().given('the useActivityDetailQuery composable', () => {
  let getActivityDetailSpy: MockInstance<
    (activityId: string, options?: RequestInit | undefined) => Promise<ActivityDetailDTO>
  >

  beforeEach(async () => {
    vi.clearAllMocks()
    getActivityDetailSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getActivityDetail'>(
      await import('@/api/avenir-esr'),
    'getActivityDetail',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid activity id', () => {
    const activityId = ref(mockedActivityDetail.id ?? '')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useActivityDetailQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useActivityDetailQuery(activityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with activity id', () => {
        expect(getActivityDetailSpy).toHaveBeenCalledWith(activityId.value)
      })

      BddTest().then('it should return the mocked activity details', () => {
        expect(queryResult.data.value).toBeDefined()
        expect(queryResult.data.value).toMatchObject(mockedActivityDetail)
      })
    })
  })

  BddTest().and('an invalid activity id', () => {
    const activityId = ref('INVALID_ACTIVITY_ID')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useActivityDetailQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useActivityDetailQuery(activityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with invalid activity id', () => {
        expect(getActivityDetailSpy).toHaveBeenCalledWith(activityId.value)
      })

      BddTest().then('it should not fetch data', () => {
        expect(queryResult.data.value).toBeUndefined()
      })
    })
  })
})

BddTest().given('the useGetDeclaredActivityAssociationsQuery composable', () => {
  let getDeclaredActivityAssociationsSpy: MockInstance<
    (declaredActivityId: string, options?: RequestInit | undefined) => Promise<DeclaredActivityAssociationsDTO>
  >

  beforeEach(async () => {
    vi.clearAllMocks()
    getDeclaredActivityAssociationsSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getDeclaredActivityAssociations'>(
      await import('@/api/avenir-esr'),
    'getDeclaredActivityAssociations',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid declared activity id', () => {
    const declaredActivityId = ref(mockedDeclaredActivity.id ?? '')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useGetDeclaredActivityAssociationsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useGetDeclaredActivityAssociationsQuery(declaredActivityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with declared activity id', () => {
        expect(getDeclaredActivityAssociationsSpy).toHaveBeenCalledWith(declaredActivityId.value)
      })

      BddTest().then('it should return the mocked declared activity associations', () => {
        expect(queryResult.data.value).toBeDefined()
        expect(queryResult.data.value).toMatchObject(mockedDeclaredActivityAssociations)
      })
    })
  })

  BddTest().and('an invalid declared activity id', () => {
    const declaredActivityId = ref('INVALID_DECLARED_ACTIVITY_ID')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useGetDeclaredActivityAssociationsQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useGetDeclaredActivityAssociationsQuery(declaredActivityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with invalid declared activity id', () => {
        expect(getDeclaredActivityAssociationsSpy).toHaveBeenCalledWith(declaredActivityId.value)
      })

      BddTest().then('it should not fetch data', () => {
        expect(queryResult.data.value).toBeUndefined()
      })
    })
  })
})

BddTest().given('the useSubscribeActivityMutation composable', () => {
  let subscribeActivitySpy: MockInstance<
    (activityId: string, params: SubscribeDeclaredActivityRequest, options?: RequestInit | undefined) => Promise<DeclaredActivity>
  >
  let useInvalidateQuerySpy: MockInstance<typeof useInvalidateQuery>
  let mutationResult: ReturnType<typeof useSubscribeActivityMutation>

  const mockInvalidateFunction = vi.fn()

  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    subscribeActivitySpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'subscribeActivity'>(
      await import('@/api/avenir-esr'),
    'subscribeActivity',
    )

    useInvalidateQuerySpy = vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('valid activity ID and success callback', () => {
    const activityId = 'activity-1-id'
    const variables: SubscribeActivityVariables = { activityId, subscribeDeclaredActivityRequest: {} }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useSubscribeActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the subscribeActivity API with correct parameters', () => {
        expect(subscribeActivitySpy).toHaveBeenCalledWith(activityId, expect.anything())
        expect(subscribeActivitySpy).toHaveBeenCalledTimes(1)
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
        expect(useInvalidateQuerySpy).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(mutationResult.data.value, variables)
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useSubscribeActivityMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the subscribeActivity API with correct parameters', () => {
        expect(subscribeActivitySpy).toHaveBeenCalledWith(activityId, expect.anything())
        expect(subscribeActivitySpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('valid activity ID with a period (startDate and endDate)', () => {
    const activityId = 'activity-1-id'
    const period = { startDate: '2026-03-11', endDate: '2026-03-20' }
    const variables: SubscribeActivityVariables = {
      activityId,
      subscribeDeclaredActivityRequest: { period }
    }

    BddTest().when('the mutation is called with period variables', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useSubscribeActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the subscribeActivity API with the period data', () => {
        expect(subscribeActivitySpy).toHaveBeenCalledWith(activityId, { period })
        expect(subscribeActivitySpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const activityId = 'activity-1-id'
    const variables: SubscribeActivityVariables = { activityId, subscribeDeclaredActivityRequest: {} }
    const mutationArgs = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useSubscribeActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the subscribeActivity API with correct parameters', () => {
        expect(subscribeActivitySpy).toHaveBeenCalledWith(activityId, expect.anything())
        expect(subscribeActivitySpy).toHaveBeenCalledTimes(1)
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

  BddTest().and('an invalid activity id with error callback', () => {
    const activityId = 'INVALID_ACTIVITY_ID'
    const variables: SubscribeActivityVariables = { activityId, subscribeDeclaredActivityRequest: {} }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useSubscribeActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the subscribeActivity API with the invalid parameters', () => {
        expect(subscribeActivitySpy).toHaveBeenCalledWith(activityId, expect.anything())
        expect(subscribeActivitySpy).toHaveBeenCalledTimes(1)
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
      let mutationResult: ReturnType<typeof useSubscribeActivityMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useSubscribeActivityMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the subscribeActivity API with the invalid parameters', () => {
        expect(subscribeActivitySpy).toHaveBeenCalledWith(activityId, expect.anything())
        expect(subscribeActivitySpy).toHaveBeenCalledTimes(1)
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

BddTest().given('the useUnsubscribeActivitiesMutation composable', () => {
  let unsubscribeActivityProgressSpy: MockInstance<
    (activityIds: string[], options?: RequestInit | undefined) => Promise<string>
  >
  let useInvalidateQuerySpy: MockInstance<typeof useInvalidateQuery>
  let mutationResult: ReturnType<typeof useUnsubscribeActivitiesMutation>

  const mockInvalidateFunction = vi.fn()

  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    unsubscribeActivityProgressSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'unsubscribeActivitiesProgresses'>(
      await import('@/api/avenir-esr'),
    'unsubscribeActivitiesProgresses',
    )

    useInvalidateQuerySpy = vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with correct parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
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
        expect(useInvalidateQuerySpy).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(elementsIds.length + 1)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with correct parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(elementsIds.length + 1)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with correct parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(elementsIds.length + 1)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
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

      BddTest().then('it should call the unsubscribeActivityProgress API with the invalid parameters', () => {
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledWith(elementsIds)
        expect(unsubscribeActivityProgressSpy).toHaveBeenCalledTimes(1)
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

BddTest().given('a useLibraryActivitiesQuery composable', () => {
  let queryResult: ReturnType<typeof useLibraryActivitiesQuery>
  let getDeclaredActivitiesViewSpy: MockInstance<typeof getDeclaredActivitiesView>

  beforeEach(async () => {
    vi.clearAllMocks()
    getDeclaredActivitiesViewSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getDeclaredActivitiesView'>(
      await import('@/api/avenir-esr'),
    'getDeclaredActivitiesView'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().when('the query is executed without params', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useLibraryActivitiesQuery())
      await flushPromises()
    })

    BddTest().then('it should call getDeclaredActivitiesView with undefined params', () => {
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledWith(undefined)
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should return a successful response', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().then('it should return libraryActivities', () => {
      expect(queryResult.libraryActivities.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should return pageInfo', () => {
      expect(queryResult.pageInfo.value).toBeDefined()
      expect(queryResult.pageInfo.value?.page).toBe(0)
    })

    BddTest().then('it should return totalElements', () => {
      expect(queryResult.totalElements.value).toBeGreaterThan(0)
    })
  })

  BddTest().when('the query is executed with pagination params', () => {
    const params = ref({ page: 0, pageSize: 2 })

    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useLibraryActivitiesQuery(params))
      await flushPromises()
    })

    BddTest().then('it should call getDeclaredActivitiesView with pagination params', () => {
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledWith({ page: 0, pageSize: 2 })
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should return paginated data matching pageSize', () => {
      expect(queryResult.libraryActivities.value).toHaveLength(2)
      expect(queryResult.pageInfo.value?.pageSize).toBe(2)
      expect(queryResult.pageInfo.value?.page).toBe(0)
    })

    BddTest().and('the page param changes', () => {
      beforeEach(async () => {
        params.value = { page: 1, pageSize: 2 }
        await flushPromises()
      })

      BddTest().then('it should call getDeclaredActivitiesView with updated page params', () => {
        expect(getDeclaredActivitiesViewSpy).toHaveBeenLastCalledWith({ page: 1, pageSize: 2 })
      })

      BddTest().then('it should fetch the next page', () => {
        expect(queryResult.pageInfo.value?.page).toBe(1)
      })
    })
  })

  BddTest().when('the query fails with a server error', () => {
    beforeEach(async () => {
      server.use(libraryActivitiesErrorHandler)
      queryResult = mountQueryComposable(() => useLibraryActivitiesQuery())
      await flushPromises()
    })

    BddTest().then('it should have called getDeclaredActivitiesView', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledWith(undefined)
    })

    BddTest().then('it should set the error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })
      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return an empty libraryActivities array', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })
      expect(queryResult.libraryActivities.value).toHaveLength(0)
    })

    BddTest().then('it should return undefined pageInfo', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })
      expect(queryResult.pageInfo.value).toBeUndefined()
    })

    BddTest().then('it should return 0 totalElements', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })
      expect(queryResult.totalElements.value).toBe(0)
    })
  })
})

BddTest().given('a useCountLibraryActivities composable', () => {
  let queryResult: ReturnType<typeof useCountLibraryActivities>
  let getDeclaredActivitiesViewSpy: MockInstance<typeof getDeclaredActivitiesView>

  beforeEach(async () => {
    vi.clearAllMocks()
    getDeclaredActivitiesViewSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getDeclaredActivitiesView'>(
      await import('@/api/avenir-esr'),
    'getDeclaredActivitiesView'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().when('the query is executed without params', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useCountLibraryActivities())
      await flushPromises()
    })

    BddTest().then('it should call getDeclaredActivitiesView with undefined params', () => {
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledWith(undefined)
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should return the total elements count', () => {
      expect(queryResult.data.value).toBe(6)
    })

    BddTest().then('it should return a successful response', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })
  })

  BddTest().when('the query is executed with pagination params', () => {
    const params = ref({ page: 0, pageSize: 2 })

    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useCountLibraryActivities(params))
      await flushPromises()
    })

    BddTest().then('it should call getDeclaredActivitiesView with pagination params', () => {
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledWith({ page: 0, pageSize: 2 })
      expect(getDeclaredActivitiesViewSpy).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should return the total elements count', () => {
      expect(queryResult.data.value).toBe(6)
    })

    BddTest().and('the page param changes', () => {
      beforeEach(async () => {
        params.value = { page: 1, pageSize: 2 }
        await flushPromises()
      })

      BddTest().then('it should call getDeclaredActivitiesView with updated page params', () => {
        expect(getDeclaredActivitiesViewSpy).toHaveBeenLastCalledWith({ page: 1, pageSize: 2 })
      })

      BddTest().then('it should still return the total elements count', () => {
        expect(queryResult.data.value).toBe(6)
      })
    })
  })
})

BddTest().given('the useDeclaredActivitiesDetailedQuery composable', () => {
  let getDeclaredActivityDetailsSpy: MockInstance<
    (declaredActivityId: string, options?: RequestInit | undefined) => Promise<DeclaredActivityDetailsDTO>
  >

  const mockedDeclaredActivityDetails: DeclaredActivityDetailsDTO = {
    id: 'declared-activity-1',
    activity: mockedActivityDetail as any, // adapte si ActivityDetailDTO != shape de activity dans DeclaredActivityDetailsDTO
  } as DeclaredActivityDetailsDTO

  beforeEach(async () => {
    vi.clearAllMocks()
    getDeclaredActivityDetailsSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'getDeclaredActivityDetails'>(
      await import('@/api/avenir-esr'),
    'getDeclaredActivityDetails',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid declared activity id', () => {
    const declaredActivityId = ref('declared-activity-1')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useDeclaredActivitiesDetailedQuery>

      beforeEach(async () => {
        // on force un retour stable sans dépendre des handlers MSW
        getDeclaredActivityDetailsSpy.mockResolvedValueOnce(mockedDeclaredActivityDetails)

        queryResult = mountQueryComposable(() => useDeclaredActivitiesDetailedQuery(declaredActivityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with declared activity id', () => {
        expect(getDeclaredActivityDetailsSpy).toHaveBeenCalledWith(declaredActivityId.value)
      })

      BddTest().then('it should expose declaredActivityDetail computed from query.data', () => {
        expect(queryResult.data.value).toBeDefined()
        expect(queryResult.declaredActivityDetail.value).toBeDefined()
        expect(queryResult.declaredActivityDetail.value).toMatchObject(mockedDeclaredActivityDetails)
      })
    })
  })

  BddTest().and('an invalid declared activity id', () => {
    const declaredActivityId = ref('INVALID_DECLARED_ACTIVITY_ID')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useDeclaredActivitiesDetailedQuery>

      beforeEach(async () => {
        // on simule une erreur API
        getDeclaredActivityDetailsSpy.mockRejectedValueOnce(new Error('Not Found'))

        queryResult = mountQueryComposable(() => useDeclaredActivitiesDetailedQuery(declaredActivityId))
        await flushPromises()
      })

      BddTest().then('it should have been called with invalid declared activity id', () => {
        expect(getDeclaredActivityDetailsSpy).toHaveBeenCalledWith(declaredActivityId.value)
      })

      BddTest().then('it should not fetch data and should be in error state', async () => {
        await vi.waitFor(() => {
          expect(queryResult.isError.value).toBe(true)
        })
        expect(queryResult.data.value).toBeUndefined()
        expect(queryResult.declaredActivityDetail.value).toBeUndefined()
      })
    })
  })

  BddTest().and('an empty declared activity id', () => {
    const declaredActivityId = ref('')

    BddTest().when('the query is executed', () => {
      let queryResult: ReturnType<typeof useDeclaredActivitiesDetailedQuery>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useDeclaredActivitiesDetailedQuery(declaredActivityId))
        await flushPromises()
      })

      BddTest().then('it should not call the API because query is disabled', () => {
        expect(getDeclaredActivityDetailsSpy).not.toHaveBeenCalled()
        expect(queryResult.data.value).toBeUndefined()
        expect(queryResult.declaredActivityDetail.value).toBeUndefined()
      })
    })
  })
})

BddTest().given('the useFinishDeclaredActivityMutation composable', () => {
  let finishSpy: MockInstance<
    (declaredActivityId: string, options?: RequestInit | undefined) => Promise<DeclaredActivityDetailsDTO>
  >
  let useInvalidateQuerySpy: MockInstance<typeof useInvalidateQuery>
  let mutationResult: ReturnType<typeof useFinishDeclaredActivityMutation>

  const mockInvalidateFunction = vi.fn()

  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    finishSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'finish'>(
      await import('@/api/avenir-esr'),
    'finish',
    )

    useInvalidateQuerySpy = vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid declared activity id with success callback', () => {
    const declaredActivityId = 'declared-activity-1-id'
    const variables: FinishDeclaredActivityVariables = { declaredActivityId }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useFinishDeclaredActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the finish API with correct parameters', () => {
        expect(finishSpy).toHaveBeenCalledWith(declaredActivityId)
        expect(finishSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should call the invalidation function twice', () => {
        expect(useInvalidateQuerySpy).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(mutationResult.data.value, variables)
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useFinishDeclaredActivityMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the finish API with correct parameters', () => {
        expect(finishSpy).toHaveBeenCalledWith(declaredActivityId)
        expect(finishSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function twice', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const declaredActivityId = 'declared-activity-1-id'
    const variables: FinishDeclaredActivityVariables = { declaredActivityId }
    const mutationArgs = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useFinishDeclaredActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the finish API with correct parameters', () => {
        expect(finishSpy).toHaveBeenCalledWith(declaredActivityId)
        expect(finishSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function twice', () => {
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

  BddTest().and('an invalid declared activity id with error callback', () => {
    const declaredActivityId = 'INVALID_DECLARED_ACTIVITY_ID'
    const variables: FinishDeclaredActivityVariables = { declaredActivityId }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useFinishDeclaredActivityMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the finish API with the invalid parameters', () => {
        expect(finishSpy).toHaveBeenCalledWith(declaredActivityId)
        expect(finishSpy).toHaveBeenCalledTimes(1)
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
      let mutationResult: ReturnType<typeof useFinishDeclaredActivityMutation>

      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useFinishDeclaredActivityMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the finish API with the invalid parameters', () => {
        expect(finishSpy).toHaveBeenCalledWith(declaredActivityId)
        expect(finishSpy).toHaveBeenCalledTimes(1)
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

BddTest().given('the useUpdateActivityPeriodMutation composable', () => {
  let updatePeriodSpy: MockInstance<
    (declaredActivityId: string, declaredActivityPeriodRequest: DeclaredActivityPeriodRequest, options?: RequestInit | undefined) => Promise<string>
  >
  let mutationResult: ReturnType<typeof useUpdateActivityPeriodMutation>

  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  }

  const declaredActivityId = 'declared-activity-1'
  const declaredActivityPeriodRequest: DeclaredActivityPeriodRequest = {
    period: { startDate: '2024-01-01', endDate: '2024-06-30' },
  }
  const variables: UpdateActivityPeriodVariables = { declaredActivityId, declaredActivityPeriodRequest }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    updatePeriodSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'updatePeriod'>(
      await import('@/api/avenir-esr'),
    'updatePeriod',
    )

    vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid declared activity id with success callbacks', () => {
    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityPeriodMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updatePeriod API with correct parameters', () => {
        expect(updatePeriodSpy).toHaveBeenCalledWith(declaredActivityId, declaredActivityPeriodRequest)
        expect(updatePeriodSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityPeriodMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updatePeriod API with correct parameters', () => {
        expect(updatePeriodSpy).toHaveBeenCalledWith(declaredActivityId, declaredActivityPeriodRequest)
        expect(updatePeriodSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no callbacks are provided', () => {
    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityPeriodMutation())
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updatePeriod API', () => {
        expect(updatePeriodSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not throw', () => {
        expect(mutationResult.isError.value).toBe(false)
      })
    })
  })

  BddTest().and('an invalid declared activity id with error handler', () => {
    const invalidVariables: UpdateActivityPeriodVariables = {
      declaredActivityId: 'INVALID_DECLARED_ACTIVITY_ID',
      declaredActivityPeriodRequest,
    }

    beforeEach(() => {
      server.use(updateActivityPeriodHandler)
    })

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityPeriodMutation(mutationArgs))
        try {
          await mutationResult.mutateAsync(invalidVariables)
        }
        catch {}

        await flushPromises()
      })

      BddTest().then('it should call the updatePeriod API with the invalid parameters', () => {
        expect(updatePeriodSpy).toHaveBeenCalledWith('INVALID_DECLARED_ACTIVITY_ID', declaredActivityPeriodRequest)
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
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
  })
})

BddTest().given('the useUpdateActivityReflection composable', () => {
  let updateReflectionSpy: MockInstance<
    (activityId: string, updateReflectionRequest: UpdateReflectionRequest, options?: RequestInit | undefined) => Promise<string>
  >
  let mutationResult: ReturnType<typeof useUpdateActivityReflectionMutation>

  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  }

  const activityId = 'activity-1'
  const reflection = 'This is a reflection update'
  const variables: UpdateActivityReflectionVariables = { activityId, reflection }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    updateReflectionSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'updateReflection'>(
      await import('@/api/avenir-esr'),
    'updateReflection',
    )

    vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid activity id with success callbacks', () => {
    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityReflectionMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateReflection API with correct parameters', () => {
        expect(updateReflectionSpy).toHaveBeenCalledWith(activityId, { reflection })
        expect(updateReflectionSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityReflectionMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateReflection API with correct parameters', () => {
        expect(updateReflectionSpy).toHaveBeenCalledWith(activityId, { reflection })
        expect(updateReflectionSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no callbacks are provided', () => {
    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityReflectionMutation())
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the updateReflection API', () => {
        expect(updateReflectionSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not throw', () => {
        expect(mutationResult.isError.value).toBe(false)
      })
    })
  })

  BddTest().and('an invalid activity id with error handler', () => {
    const invalidVariables: UpdateActivityReflectionVariables = {
      activityId: 'INVALID_ACTIVITY_ID',
      reflection,
    }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityReflectionMutation(mutationArgs))
        try {
          await mutationResult.mutateAsync(invalidVariables)
        }
        catch {}

        await flushPromises()
      })

      BddTest().then('it should call the updateReflection API with the invalid parameters', () => {
        expect(updateReflectionSpy).toHaveBeenCalledWith('INVALID_ACTIVITY_ID', { reflection })
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
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
  })

  BddTest().and('an empty reflection with error handler', () => {
    const invalidVariables: UpdateActivityReflectionVariables = {
      activityId: 'activity-1',
      reflection: '',
    }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityReflectionMutation(mutationArgs))
        try {
          await mutationResult.mutateAsync(invalidVariables)
        }
        catch {}

        await flushPromises()
      })

      BddTest().then('it should call the updateReflection API with the invalid parameters', () => {
        expect(updateReflectionSpy).toHaveBeenCalledWith('activity-1', { reflection: '' })
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
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
  })

  BddTest().and('a too long reflection with error handler', () => {
    const invalidVariables: UpdateActivityReflectionVariables = {
      activityId: 'activity-1',
      reflection: 'a'.repeat(4001),
    }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useUpdateActivityReflectionMutation(mutationArgs))
        try {
          await mutationResult.mutateAsync(invalidVariables)
        }
        catch {}

        await flushPromises()
      })

      BddTest().then('it should call the updateReflection API with the invalid parameters', () => {
        expect(updateReflectionSpy).toHaveBeenCalledWith('activity-1', { reflection: 'a'.repeat(4001) })
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
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
  })
})

BddTest().given('the useAssociateActivityWithTracesMutation composable', () => {
  let associateActivityWithTracesSpy: MockInstance<
    (
      declaredActivityId: string,
      associationsCreationRequest: AssociationsCreationRequest,
      options?: RequestInit | undefined
    ) => Promise<DeclaredActivityAssociationsDTO>
  >
  let useInvalidateQuerySpy: MockInstance<typeof useInvalidateQuery>
  let mutationResult: ReturnType<typeof useAssociateActivityWithTracesMutation>

  const mockInvalidateFunction = vi.fn()

  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    associateActivityWithTracesSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'associateActivityWithTraces'>(
      await import('@/api/avenir-esr'),
    'associateActivityWithTraces',
    )

    useInvalidateQuerySpy = vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid declared activity id with valid trace ids and success callback', () => {
    const declaredActivityId = 'declared-activity-1'
    const associationsCreationRequest: AssociationsCreationRequest = {
      idsToAssociate: ['trace-1', 'trace-2', 'trace-3']
    }
    const variables: AssociateActivityWithTracesVariables = {
      declaredActivityId,
      associationsCreationRequest
    }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useAssociateActivityWithTracesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the associateActivityWithTraces API with correct parameters', () => {
        expect(associateActivityWithTracesSpy).toHaveBeenCalledWith(declaredActivityId, associationsCreationRequest)
        expect(associateActivityWithTracesSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
        expect(mutationResult.data.value).toEqual(
          createMockedDeclaredActivityAssociationsDTO(['trace-1', 'trace-2', 'trace-3'])
        )
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should call the invalidation function for associations query', () => {
        expect(useInvalidateQuerySpy).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledWith(
          expect.arrayContaining([
            'activities',
            'associations',
            declaredActivityId
          ])
        )
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(mutationResult.data.value, variables)
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useAssociateActivityWithTracesMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the associateActivityWithTraces API with correct parameters', () => {
        expect(associateActivityWithTracesSpy).toHaveBeenCalledWith(declaredActivityId, associationsCreationRequest)
        expect(associateActivityWithTracesSpy).toHaveBeenCalledTimes(1)
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
    const declaredActivityId = 'declared-activity-1'
    const associationsCreationRequest: AssociationsCreationRequest = {
      idsToAssociate: ['trace-1', 'trace-2']
    }
    const variables: AssociateActivityWithTracesVariables = {
      declaredActivityId,
      associationsCreationRequest
    }

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useAssociateActivityWithTracesMutation())
        await mutationResult.mutateAsync(variables)
        await flushPromises()
      })

      BddTest().then('it should call the associateActivityWithTraces API with correct parameters', () => {
        expect(associateActivityWithTracesSpy).toHaveBeenCalledWith(declaredActivityId, associationsCreationRequest)
        expect(associateActivityWithTracesSpy).toHaveBeenCalledTimes(1)
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

  BddTest().and('an invalid declared activity id with error callback', () => {
    const declaredActivityId = 'INVALID_DECLARED_ACTIVITY_ID'
    const associationsCreationRequest: AssociationsCreationRequest = {
      idsToAssociate: ['trace-1', 'trace-2']
    }
    const variables: AssociateActivityWithTracesVariables = {
      declaredActivityId,
      associationsCreationRequest
    }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useAssociateActivityWithTracesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the associateActivityWithTraces API with the invalid parameters', () => {
        expect(associateActivityWithTracesSpy).toHaveBeenCalledWith(declaredActivityId, associationsCreationRequest)
        expect(associateActivityWithTracesSpy).toHaveBeenCalledTimes(1)
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
        mutationResult = mountQueryComposable(() => useAssociateActivityWithTracesMutation(mutationArgs))
        mutationResult.mutate(variables)
        await flushPromises()
      })

      BddTest().then('it should call the associateActivityWithTraces API with the invalid parameters', () => {
        expect(associateActivityWithTracesSpy).toHaveBeenCalledWith(declaredActivityId, associationsCreationRequest)
        expect(associateActivityWithTracesSpy).toHaveBeenCalledTimes(1)
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

  BddTest().and('a server error with error callback', () => {
    const declaredActivityId = 'declared-activity-1'
    const associationsCreationRequest: AssociationsCreationRequest = {
      idsToAssociate: ['trace-1', 'trace-2']
    }
    const variables: AssociateActivityWithTracesVariables = {
      declaredActivityId,
      associationsCreationRequest
    }

    beforeEach(() => {
      server.use(associateActivityWithTracesErrorHandler)
    })

    BddTest().when('the mutation encounters a server error', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useAssociateActivityWithTracesMutation(mutationArgs))
        await mutationResult.mutateAsync(variables).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the associateActivityWithTraces API with the correct parameters', () => {
        expect(associateActivityWithTracesSpy).toHaveBeenCalledWith(declaredActivityId, associationsCreationRequest)
        expect(associateActivityWithTracesSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
      })

      BddTest().then('it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not call the invalidation function on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })
    })
  })
})

BddTest().given('the useDeleteDeclaredActivityAssociationsMutation composable', () => {
  let mutationResult: ReturnType<typeof useDeleteDeclaredActivityAssociationsMutation>
  let useInvalidateQuerySpy: MockInstance<typeof useInvalidateQuery>

  const declaredActivityId = 'declared-activity-1'
  const associationsDeleteRequest = {
    idsToDelete: ['association-1', 'association-2']
  }

  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mockInvalidateFunction = vi.fn()

  const mutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    useInvalidateQuerySpy = vi.spyOn<typeof import('@/common/composables'), 'useInvalidateQuery'>(
      await import('@/common/composables'),
    'useInvalidateQuery',
    ).mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().when('the mutation is called successfully', () => {
    beforeEach(async () => {
      mutationResult = mountQueryComposable(() => useDeleteDeclaredActivityAssociationsMutation(mutationArgs))
      await mutationResult.mutateAsync({
        declaredActivityId,
        associationsDeleteRequest
      })
      await flushPromises()
    })

    BddTest().then('it should call the API with correct variables', () => {
      expect(mutationResult.variables.value).toEqual({
        declaredActivityId,
        associationsDeleteRequest
      })
    })

    BddTest().then('it should call the success callback', () => {
      expect(mockOnSuccess).toHaveBeenCalledWith(
        'Associations deleted successfully',
        {
          declaredActivityId,
          associationsDeleteRequest
        }
      )
    })

    BddTest().then('it should invalidate the associations query', () => {
      expect(useInvalidateQuerySpy).toHaveBeenCalledTimes(1)
      expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      expect(mockInvalidateFunction).toHaveBeenCalledWith(
        expect.arrayContaining([
          'activities',
          'associations',
          declaredActivityId
        ])
      )
    })

    BddTest().then('it should not call the error callback', () => {
      expect(mockOnError).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the mutation fails', () => {
    beforeEach(async () => {
      server.use(deleteDeclaredActivityAssociationsErrorHandler)

      mutationResult = mountQueryComposable(() => useDeleteDeclaredActivityAssociationsMutation(mutationArgs))

      await mutationResult.mutateAsync({
        declaredActivityId,
        associationsDeleteRequest
      }).catch(() => {})

      await flushPromises()
    })

    BddTest().then('it should call the error callback', async () => {
      await vi.waitFor(() => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().then('it should not call the success callback', () => {
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    BddTest().then('it should not invalidate queries', () => {
      expect(mockInvalidateFunction).not.toHaveBeenCalled()
    })
  })
})
