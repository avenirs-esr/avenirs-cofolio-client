import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { useStudentSummaryQuery } from '@/features/student/user/queries/use-student-profile/use-student-profile.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'

vi.mock('@/common/composables', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...original,
    useInvalidateQuery: vi.fn(),
  }
})

BddTest().given('a student summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    let queryResult: UseQueryReturnType<ProfileOverviewDTO, BaseApiException>

    beforeEach(async () => {
      queryResult = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
        () => useStudentSummaryQuery()
      )

      await flushPromises()
    })

    BddTest().then('it should return a profile object with required properties', () => {
      expect(queryResult.data.value).toEqual(mockedProfileOverview)
    })
  })
})
