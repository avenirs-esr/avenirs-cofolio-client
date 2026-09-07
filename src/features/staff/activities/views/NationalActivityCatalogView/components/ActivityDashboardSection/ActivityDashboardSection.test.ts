import type { VueWrapper } from '@vue/test-utils'
import { ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID, mockedActivityContent, mockedActivityDashboard } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getActivityDashboardErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import ActivityDashboardSection
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/ActivityDashboardSection.vue'
import { DashboardCardStub } from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.stub'
import { DashboardSectionStub } from '@/features/staff/global/components/sections/DashboardSection/DashboardSection.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an ActivityDashboardSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDashboardSection>>

  const stubs = {
    DashboardSection: DashboardSectionStub,
    DashboardCard: DashboardCardStub,
  }

  const mountSection = (activityId: string) => mountComponent(ActivityDashboardSection, {
    props: { activityId },
    global: { stubs },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with a valid activity id', () => {
    beforeEach(async () => {
      wrapper = mountSection(mockedActivityContent.id)
      await flushPromises()
    })

    BddTest().then('it should render DashboardSection with the expected title', () => {
      const section = wrapper.findComponent(DashboardSectionStub)
      expect(section.exists()).toBe(true)
      expect(section.props('title')).toBe('Tableau de bord')
    })

    BddTest().then('it should pass loading and error state to DashboardSection', () => {
      const section = wrapper.findComponent(DashboardSectionStub)
      expect(section.props('isLoading')).toBe(false)
      expect(section.props('error')).toBeNull()
    })

    BddTest().then('it should render three DashboardCard components', () => {
      expect(wrapper.findAllComponents(DashboardCardStub)).toHaveLength(3)
    })

    BddTest().then('it should pass the unique student views to the first card', () => {
      const card = wrapper.findAllComponents(DashboardCardStub)[0]
      expect(card.props('value')).toBe(`${mockedActivityDashboard.uniqueStudentViews}`)
      expect(card.props('label')).toBe('étudiants ayant consulté l\'activité')
    })

    BddTest().then('it should pass the enrolled students to the second card', () => {
      const card = wrapper.findAllComponents(DashboardCardStub)[1]
      expect(card.props('value')).toBe(`${mockedActivityDashboard.enrolledStudents}`)
      expect(card.props('label')).toBe('étudiants inscrits')
    })

    BddTest().then('it should pass the unsubscriptions of the last 30 days to the third card', () => {
      const card = wrapper.findAllComponents(DashboardCardStub)[2]
      expect(card.props('value')).toBe(`${mockedActivityDashboard.unsubscriptionsLast30Days}`)
      expect(card.props('label')).toBe('désinscriptions sur les 30 derniers jours')
    })
  })

  BddTest().when('mounted with an activity without enrolled student', () => {
    beforeEach(async () => {
      wrapper = mountSection(ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID)
      await flushPromises()
    })

    BddTest().then('it should render the dashboard values returned by the API', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards.map(card => card.props('value'))).toEqual(['0', '0', '0'])
    })
  })

  BddTest().when('mounted with an empty activity id', () => {
    beforeEach(async () => {
      wrapper = mountSection('')
      await flushPromises()
    })

    BddTest().then('it should fallback dashboard values to zero', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards).toHaveLength(3)
      expect(cards.map(card => card.props('value'))).toEqual(['0', '0', '0'])
    })
  })

  BddTest().when('the dashboard request fails', () => {
    beforeEach(async () => {
      server.use(getActivityDashboardErrorHandler)
      wrapper = mountSection(mockedActivityContent.id)
      await flushPromises()
    })

    BddTest().then('it should pass an error to DashboardSection', () => {
      const section = wrapper.findComponent(DashboardSectionStub)
      expect(section.props('isLoading')).toBe(false)
      expect(section.props('error')).toBeTruthy()
    })

    BddTest().then('it should not render dashboard cards in error state', () => {
      expect(wrapper.findAllComponents(DashboardCardStub)).toHaveLength(0)
    })
  })
})
