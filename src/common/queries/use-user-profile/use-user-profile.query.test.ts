import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { getStaffProfileErrorHandler } from '@/__mocks__/msw/handlers/staffs/user.handlers'
import { getProfileErrorHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory } from '@/api/avenir-esr'
import { useUserSummaryQuery } from '@/common/queries/use-user-profile/use-user-profile.query'
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

BddTest().given('a user summary query', () => {
  BddTest().when('the query is executed for STUDENT category', () => {
    let queryResult: UseQueryReturnType<ProfileOverviewDTO, BaseApiException>

    beforeEach(async () => {
      queryResult = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
        () => useUserSummaryQuery(EUserCategory.STUDENT)
      )

      await flushPromises()
    })

    BddTest().then('it should return a student profile object with required properties', () => {
      expect(queryResult.data.value).toEqual(mockedProfileOverview)
    })
  })

  BddTest().when('the query fails for STUDENT category', () => {
    let queryResult: UseQueryReturnType<ProfileOverviewDTO, BaseApiException>

    beforeEach(async () => {
      server.use(getProfileErrorHandler)
      queryResult = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
        () => useUserSummaryQuery(EUserCategory.STUDENT)
      )

      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })
  })

  BddTest().when('the query is executed for STAFF category', () => {
    let queryResult: UseQueryReturnType<ProfileOverviewDTO, BaseApiException>

    beforeEach(async () => {
      queryResult = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
        () => useUserSummaryQuery(EUserCategory.STAFF)
      )

      await flushPromises()
    })

    BddTest().then('it should return a staff profile object with required properties', () => {
      expect(queryResult.data.value).toEqual(mockedStaffProfileOverview)
    })
  })

  BddTest().when('the query fails for STAFF category', () => {
    let queryResult: UseQueryReturnType<ProfileOverviewDTO, BaseApiException>

    beforeEach(async () => {
      server.use(getStaffProfileErrorHandler)
      queryResult = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
        () => useUserSummaryQuery(EUserCategory.STAFF)
      )

      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })
  })
})
