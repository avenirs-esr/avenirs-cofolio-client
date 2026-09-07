import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContentWithEnrolledStudent1 } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getMockedFeedbackDashboard } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { getFeedbackDashboardErrorHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { DashboardCardStub } from '@/common/components/cards/DashboardCard/DashboardCard.stub'
import { DashboardSectionStub } from '@/common/components/DashboardSection/DashboardSection.stub'
import FeedbacksDashboardSection from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/FeedbacksDashboardSection/FeedbacksDashboardSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a FeedbacksDashboardSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksDashboardSection>>

  const stubs = {
    DashboardSection: DashboardSectionStub,
    DashboardCard: DashboardCardStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with a valid activity id', () => {
    const dashboard = getMockedFeedbackDashboard({ activityId: mockedActivityContentWithEnrolledStudent1.id })

    beforeEach(async () => {
      wrapper = mountComponent(FeedbacksDashboardSection, {
        props: { activityId: mockedActivityContentWithEnrolledStudent1.id },
        global: { stubs },
      })
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

    BddTest().then('it should pass the new feedback value to the first card', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards[0].props('value')).toBe(`${dashboard.newFeedbacks}`)
    })

    BddTest().then('it should pass the pending feedback value to the second card', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards[1].props('value')).toBe(`${dashboard.pendingFeedbacks}`)
    })

    BddTest().then('it should pass processed over total value to the third card', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards[2].props('value')).toBe(`${dashboard.processedFeedbacks}/${dashboard.totalFeedbacks}`)
    })
  })

  BddTest().when('mounted with an empty activity id', () => {
    beforeEach(async () => {
      wrapper = mountComponent(FeedbacksDashboardSection, {
        props: { activityId: '' },
        global: { stubs },
      })
      await flushPromises()
    })

    BddTest().then('it should fallback dashboard values to zero', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards).toHaveLength(3)
      expect(cards[0].props('value')).toBe('0')
      expect(cards[1].props('value')).toBe('0')
      expect(cards[2].props('value')).toBe('0/0')
    })
  })

  BddTest().when('the dashboard request fails', () => {
    beforeEach(async () => {
      server.use(getFeedbackDashboardErrorHandler)
      wrapper = mountComponent(FeedbacksDashboardSection, {
        props: { activityId: 'activity-1' },
        global: { stubs },
      })
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
