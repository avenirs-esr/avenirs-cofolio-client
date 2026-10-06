import type { VueWrapper } from '@vue/test-utils'
import { ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID, mockedActivityContent, mockedActivityDashboard } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityStatus } from '@/api/avenir-esr'
import ActivityDashboardSection
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/ActivityDashboardSection.vue'
import { InactiveStudentsDetailsCardStub }
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/components/InactiveStudentsDetailsCard/InactiveStudentsDetailsCard.stub'
import { DashboardCardStub } from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.stub'
import { DashboardSectionStub } from '@/features/staff/global/components/sections/DashboardSection/DashboardSection.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an ActivityDashboardSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDashboardSection>>

  const stubs = {
    AvButton: AvButtonStub,
    DashboardSection: DashboardSectionStub,
    DashboardCard: DashboardCardStub,
    InactiveStudentsDetailsCard: InactiveStudentsDetailsCardStub,
  }

  const mountSection = (activityId: string, status = EActivityStatus.PUBLISHED) => mountComponent(ActivityDashboardSection, {
    props: { activityId, status },
    global: { stubs },
  })

  const getDashboardSection = () => wrapper.findComponent(DashboardSectionStub)
  const getDashboardCards = () => wrapper.findAllComponents(DashboardCardStub)
  const getUniqueStudentViewsDashboardCard = () => getDashboardCards()[0]
  const getEnrolledStudentsDashboardCard = () => getDashboardCards()[1]
  const getUnsubscriptionsDashboardCard = () => getDashboardCards()[2]
  const getInactiveStudentsDashboardCard = () => getDashboardCards()[3]
  const getSeeDetailsButton = () => getInactiveStudentsDashboardCard().findComponent(AvButtonStub)
  const getInactiveStudentsDetailsCard = () => wrapper.findComponent(InactiveStudentsDetailsCardStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with a valid activity id', () => {
    beforeEach(async () => {
      wrapper = mountSection(mockedActivityContent.id)
      await flushPromises()
    })

    BddTest().then('it should render DashboardSection with the expected title', () => {
      expect(getDashboardSection().exists()).toBe(true)
      expect(getDashboardSection().props('title')).toBe('Tableau de bord')
    })

    BddTest().then('it should pass correct loading and error states to DashboardSection', () => {
      expect(getDashboardSection().props('isLoading')).toBe(false)
      expect(getDashboardSection().props('error')).toBeNull()
    })

    BddTest().then('it should not flag the section as empty', () => {
      expect(getDashboardSection().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should render four DashboardCard components', () => {
      expect(getDashboardCards()).toHaveLength(4)
    })

    BddTest().then('it should pass the unique student views to the first card', () => {
      const card = getUniqueStudentViewsDashboardCard()
      expect(card.props('value')).toBe(`${mockedActivityDashboard.uniqueStudentViews}`)
      expect(card.props('label')).toBe('étudiant(e)s ayant consulté l\'activité')
    })

    BddTest().then('it should pass the enrolled students to the second card', () => {
      const card = getEnrolledStudentsDashboardCard()
      expect(card.props('value')).toBe(`${mockedActivityDashboard.enrolledStudents}`)
      expect(card.props('label')).toBe('étudiant(e)s inscrit(e)s')
    })

    BddTest().then('it should pass the unsubscriptions of the last 30 days to the third card', () => {
      const card = getUnsubscriptionsDashboardCard()
      expect(card.props('value')).toBe(`${mockedActivityDashboard.unsubscriptionsLast30Days}`)
      expect(card.props('label')).toBe('désinscriptions sur les 30 derniers jours')
    })

    BddTest().then('it should pass the inactive students of the last 30 days to the fourth card', () => {
      const card = getInactiveStudentsDashboardCard()
      expect(card.props('value')).toBe(`${mockedActivityDashboard.inactiveStudentsLast30Days}`)
      expect(card.props('label')).toBe('inscrit(e)s inactif(ve)s depuis plus de 30 jours')
    })
  })

  BddTest().when('the see details button of the inactive students card is clicked', () => {
    beforeEach(async () => {
      wrapper = mountSection(mockedActivityContent.id)
      await flushPromises()
    })

    BddTest().then('it should render the see details button in the footer of the inactive students card only', () => {
      expect(getSeeDetailsButton().exists()).toBe(true)
      expect(getSeeDetailsButton().props('label')).toBe('Voir le détail')
      expect(wrapper.findAllComponents(AvButtonStub)).toHaveLength(1)
    })

    BddTest().then('it should not render the inactive students details card by default', () => {
      expect(getInactiveStudentsDetailsCard().exists()).toBe(false)
    })

    BddTest().then('it should render the inactive students details card on click', async () => {
      await getSeeDetailsButton().trigger('click')

      expect(getInactiveStudentsDetailsCard().exists()).toBe(true)
      expect(getInactiveStudentsDetailsCard().props('activityId')).toBe(mockedActivityContent.id)
    })

    BddTest().then('it should switch the button label once the details are shown', async () => {
      await getSeeDetailsButton().trigger('click')

      expect(getSeeDetailsButton().props('label')).toBe('Cacher le détail')
    })

    BddTest().then('it should hide the inactive students details card on a second click', async () => {
      await getSeeDetailsButton().trigger('click')
      await getSeeDetailsButton().trigger('click')

      expect(getInactiveStudentsDetailsCard().exists()).toBe(false)
      expect(getSeeDetailsButton().props('label')).toBe('Voir le détail')
    })
  })

  BddTest().when('mounted with an activity without enrolled student', () => {
    beforeEach(async () => {
      wrapper = mountSection(ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID)
      await flushPromises()
    })

    BddTest().then('it should render the dashboard values returned by the API', () => {
      expect(getDashboardCards().map(card => card.props('value'))).toEqual(['0', '0', '0', '0'])
    })
  })

  BddTest().when('mounted with a draft activity', () => {
    beforeEach(async () => {
      wrapper = mountSection(mockedActivityContent.id, EActivityStatus.DRAFT)
      await flushPromises()
    })

    BddTest().then('it should flag the section as empty with the not published message', () => {
      expect(getDashboardSection().props('isEmpty')).toBe(true)
      expect(getDashboardSection().props('emptyStateMessage')).toBe('Cette activité est un brouillon. Les chiffres clés ne sont disponibles que depuis des activités publiées.')
    })

    BddTest().then('it should not render dashboard cards', () => {
      expect(getDashboardCards()).toHaveLength(0)
    })

    BddTest().then('it should not be loading nor in error', () => {
      expect(getDashboardSection().props('isLoading')).toBe(false)
      expect(getDashboardSection().props('error')).toBeNull()
    })
  })

  BddTest().when('mounted with an empty activity id', () => {
    beforeEach(async () => {
      wrapper = mountSection('')
      await flushPromises()
    })

    BddTest().then('it should fallback dashboard values to zero', () => {
      expect(getDashboardCards()).toHaveLength(4)
      expect(getDashboardCards().map(card => card.props('value'))).toEqual(['0', '0', '0', '0'])
    })
  })

  BddTest().when('mounted with an invalid activity id', () => {
    beforeEach(async () => {
      wrapper = mountSection('INVALID_ACTIVITY_ID')
      await flushPromises()
    })

    BddTest().then('it should pass an error to DashboardSection', () => {
      expect(getDashboardSection().props('isLoading')).toBe(false)
      expect(getDashboardSection().props('error')).toBeTruthy()
    })

    BddTest().then('it should not render dashboard cards in error state', () => {
      expect(getDashboardCards()).toHaveLength(0)
    })
  })
})
