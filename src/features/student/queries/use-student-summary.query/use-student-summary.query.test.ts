import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import {
  mockedDeliverablesOverview,
  mockedEventsOverview,
  mockedHeaderOverview,
  mockedPagesOverview,
  mockedProfileOverview,
  mockedResumesOverview
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
import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

vi.mock('@/common/composables', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...original,
    useInvalidateQuery: vi.fn(),
  }
})

describe('useStudentSummaryQuery', () => {
  describe('given a student summary query with no parameters', () => {
    describe('when the query is executed', () => {
      let queryResult: UseQueryReturnType<ProfileOverviewDTO, BaseApiException>

      beforeEach(async () => {
        queryResult = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
          () => useStudentSummaryQuery()
        )

        await flushPromises()
      })

      it('then it should return a profile object with required properties', () => {
        expect(queryResult.data.value).toEqual(mockedProfileOverview)
      })
    })
  })
})

describe('useStudentCoursesSummaryQuery', () => {
  describe('given a student courses summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentCoursesSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return an array of student progress summaries', () => {
        expect(Array.isArray(query.data.value)).toBe(true)
      })
    })
  })
})

describe('useStudentDeliverablesSummaryQuery', () => {
  describe('given a student deliverables summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentDeliverablesSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return the mocked deliverables overview', () => {
        expect(query.data.value).toEqual(mockedDeliverablesOverview)
      })
    })
  })
})

describe('useStudentEventsSummaryQuery', () => {
  describe('given a student events summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentEventsSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return the mocked events overview', () => {
        expect(query.data.value).toEqual(mockedEventsOverview)
      })
    })
  })
})

describe('useStudentHeaderSummaryQuery', () => {
  describe('given a student header summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentHeaderSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return the mocked header overview', () => {
        expect(query.data.value).toEqual(mockedHeaderOverview)
      })
    })
  })
})

describe('useStudentPagesSummaryQuery', () => {
  describe('given a student pages summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentPagesSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return the mocked pages overview', () => {
        expect(query.data.value).toEqual(mockedPagesOverview)
      })
    })
  })
})

describe('useStudentResumesSummaryQuery', () => {
  describe('given a student resumes summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentResumesSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return the mocked resumes overview', () => {
        expect(query.data.value).toEqual(mockedResumesOverview)
      })
    })
  })
})

describe('useStudentTracesSummaryQuery', () => {
  describe('given a student traces summary query with no parameters', () => {
    describe('when the query is executed', () => {
      const query = mountQueryComposable(() => useStudentTracesSummaryQuery())

      beforeEach(async () => {
        await flushPromises()
      })

      it('then it should return a list of trace summaries with valid structure', () => {
        expect(query.data.value).toHaveLength(4)
        expect(query.data.value[0]).toHaveProperty('name')
        expect(query.data.value[0]).toHaveProperty('type')
        expect(query.data.value[0]).toHaveProperty('filedAt')
      })
    })
  })
})
