import { mockedEventsOverview } from '@/__mocks__/fixtures/student'
import {
  useStudentEventsSummaryQuery
} from '@/features/student/global/queries/use-student-events.query/use-student-events.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student events query with no parameters', () => {
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
