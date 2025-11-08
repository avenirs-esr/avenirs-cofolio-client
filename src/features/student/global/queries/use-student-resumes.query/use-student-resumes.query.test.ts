import { mockedResumesOverview } from '@/__mocks__/fixtures/student'
import {
  useStudentResumesSummaryQuery
} from '@/features/student/global/queries/use-student-resumes.query/use-student-resumes.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student resumes query with no parameters', () => {
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
