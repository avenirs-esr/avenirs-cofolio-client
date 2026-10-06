import type { VueWrapper } from '@vue/test-utils'
import { ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID, mockedActivityContent, mockedInactiveStudents } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import InactiveStudentsDetailsCard
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/components/InactiveStudentsDetailsCard/InactiveStudentsDetailsCard.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an InactiveStudentsDetailsCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof InactiveStudentsDetailsCard>>

  const stubs = {
    AvIconText: AvIconTextStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountCard = (activityId: string) => mountComponent(InactiveStudentsDetailsCard, {
    props: { activityId },
    global: { stubs },
  })

  const getItems = () => wrapper.findAll('[data-testid="inactive-student-item"]')
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with an activity having inactive students', () => {
    beforeEach(async () => {
      wrapper = mountCard(mockedActivityContent.id)
      await flushPromises()
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="inactive-students-details-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the title with the number of inactive students', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text'))
        .toBe(`Inscrit(e)s inactif(ve)s depuis plus de 30 jours (${mockedInactiveStudents.length})`)
    })

    BddTest().then('it should render one item per inactive student', () => {
      expect(getItems()).toHaveLength(mockedInactiveStudents.length)
    })

    BddTest().then('it should render the last name and the first name of each student', () => {
      expect(wrapper.findAll('[data-testid="inactive-student-name"]').map(name => name.text()))
        .toEqual(mockedInactiveStudents.map(({ student }) => `${student.lastName} ${student.firstName}`))
    })

    BddTest().then('it should render the enrolment date of each student', () => {
      expect(wrapper.findAll('[data-testid="inactive-student-enrolled-at"]').map(date => date.text()))
        .toEqual(['inscrit(e) le 12/01/2026', 'inscrit(e) le 03/02/2026', 'inscrit(e) le 21/03/2026'])
    })

    BddTest().then('it should render the last activity date of each student', () => {
      expect(wrapper.findAll('[data-testid="inactive-student-last-viewed-at"]').map(date => date.text()))
        .toEqual(['dernière activité le 30/04/2026', 'dernière activité le 18/05/2026', 'aucune activité'])
    })
  })

  BddTest().when('mounted with an activity without inactive student', () => {
    beforeEach(async () => {
      wrapper = mountCard(ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID)
      await flushPromises()
    })

    BddTest().then('it should flag QuerySuspense as empty with the empty state message', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucun(e) inscrit(e) inactif(ve) depuis plus de 30 jours')
    })

    BddTest().then('it should not render any item', () => {
      expect(getItems()).toHaveLength(0)
    })
  })

  BddTest().when('mounted with an invalid activity id', () => {
    beforeEach(async () => {
      wrapper = mountCard('INVALID_ACTIVITY_ID')
      await flushPromises()
    })

    BddTest().then('it should pass the error to QuerySuspense', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspense().props('error')).toBeTruthy()
      })
    })

    BddTest().then('it should not render any item', () => {
      expect(getItems()).toHaveLength(0)
    })
  })
})
