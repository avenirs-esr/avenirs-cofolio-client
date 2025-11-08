import { mockedPagesOverview } from '@/__mocks__/fixtures/student'
import {
  useStudentPagesSummaryQuery
} from '@/features/student/global/queries/use-student-pages.query/use-student-pages.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student pages query with no parameters', () => {
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
