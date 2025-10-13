import type { ProfileOverviewDTO, TraceOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import {
  mockedDeliverablesOverview,
  mockedEventsOverview,
  mockedHeaderOverview,
  mockedPagesOverview,
  mockedProfileOverview,
  mockedResumesOverview,
} from '@/__mocks__/fixtures/student'
import {
  useStudentCoursesSummaryQuery,
  useStudentDeliverablesSummaryQuery,
  useStudentEventsSummaryQuery,
  useStudentHeaderSummaryQuery,
  useStudentPagesSummaryQuery,
  useStudentResumesSummaryQuery,
  useStudentSummaryQuery,
  useStudentTracesSummaryQuery
} from '@/features/student/queries'
import { flushPromises } from '@vue/test-utils'
import { BddTest, mountQueryComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

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

BddTest().given('a student courses summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentCoursesSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return an array of student progress summaries', () => {
      expect(Array.isArray(query.data.value)).toBe(true)
    })
  })
})

BddTest().given('a student deliverables summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentDeliverablesSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return the mocked deliverables overview', () => {
      expect(query.data.value).toEqual(mockedDeliverablesOverview)
    })
  })
})

BddTest().given('a student events summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentEventsSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return the mocked events overview', () => {
      expect(query.data.value).toEqual(mockedEventsOverview)
    })
  })
})

BddTest().given('a student header summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentHeaderSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return the mocked header overview', () => {
      expect(query.data.value).toEqual(mockedHeaderOverview)
    })
  })
})

BddTest().given('a student pages summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentPagesSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return the mocked pages overview', () => {
      expect(query.data.value).toEqual(mockedPagesOverview)
    })
  })
})

BddTest().given('a student resumes summary query with no parameters', () => {
  BddTest().when('the query is executed', () => {
    const query = mountQueryComposable(() => useStudentResumesSummaryQuery())

    beforeEach(async () => {
      await flushPromises()
    })

    BddTest().then('it should return the mocked resumes overview', () => {
      expect(query.data.value).toEqual(mockedResumesOverview)
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

    BddTest().then('it should return an array of trace overviews', () => {
      expect(Array.isArray(queryResult.data.value)).toBe(true)
    })
  })
})
