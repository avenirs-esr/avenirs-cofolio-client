import type { ActivityDetailDTO } from '@/api/avenir-esr/generated/types/activityDetailDTO'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import { useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, type MockInstance } from 'vitest'

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
