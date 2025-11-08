import { mockedDeliverablesOverview } from '@/__mocks__/fixtures/student'
import {
  useStudentDeliverablesSummaryQuery
} from '@/features/student/global/queries/use-student-deliverables.query/use-student-deliverables.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

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
