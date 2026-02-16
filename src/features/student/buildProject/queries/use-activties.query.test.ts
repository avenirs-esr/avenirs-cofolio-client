import type { ActivityDetailDTO } from '@/api/avenir-esr/generated/types/activityDetailDTO'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/project-activities.fixtures'
import { useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'

BddTest().given('an useActivityDetailQuery composable', () => {
  BddTest().and('a valid activity id', () => {
    const activityId = ref(mockedActivityDetail.id ?? '')

    BddTest().when('the query is executed', () => {
      let queryResult: UseQueryReturnType<ActivityDetailDTO, BaseApiException>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useActivityDetailQuery(activityId))
        await flushPromises()
      })

      BddTest().then('it should return the activity details', () => {
        expect(queryResult.data.value).toBeDefined()
        expect(queryResult.data.value).toMatchObject(mockedActivityDetail)
      })
    })
  })

  BddTest().and('an invalid activity id', () => {
    const activityId = ref('INVALID_ACTIVITY_ID')

    BddTest().when('the query is executed', () => {
      let queryResult: UseQueryReturnType<ActivityDetailDTO, BaseApiException>

      beforeEach(async () => {
        queryResult = mountQueryComposable(() => useActivityDetailQuery(activityId))
        await flushPromises()
      })

      BddTest().then('it should not fetch data', () => {
        expect(queryResult.data.value).toBeUndefined()
      })
    })
  })
})
