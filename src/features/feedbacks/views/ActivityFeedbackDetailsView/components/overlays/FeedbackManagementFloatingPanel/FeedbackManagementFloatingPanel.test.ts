import { mockedFeedbackDetailsWithAssociations, mockedFeedbackHistory } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { createGetFeedbackHistoryHandler, getFeedbackHistoryErrorHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { FeedbacksHistoryTabStub } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistory.stub'
import FeedbackManagementFloatingPanel from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.vue'
import { AvFloatingPanelStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a write feedback floating panel', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackManagementFloatingPanel>>

  const mockFeedback = mockedFeedbackDetailsWithAssociations

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    AvFloatingPanel: AvFloatingPanelStub,
    WriteFeedbackTab: true,
    FeedbacksHistoryTab: FeedbacksHistoryTabStub,
  }

  const mountPanel = async () => {
    const mounted = mountComponent(FeedbackManagementFloatingPanel, {
      props: {
        feedback: mockFeedback,
        activityTitle: 'Test Activity',
      },
      global: { stubs },
    })
    await flushPromises()
    return mounted
  }

  const getHistoryTab = () => wrapper.findComponent(FeedbacksHistoryTabStub)
  const getHistoryTabTitle = () => wrapper.findAllComponents(AvTabStub)[1].props('title')

  BddTest().when('the feedback history is loaded', () => {
    beforeEach(async () => {
      wrapper = await mountPanel()
    })

    BddTest().then('it should render the floating panel', () => {
      expect(wrapper.findComponent(AvFloatingPanelStub).exists()).toBe(true)
    })

    BddTest().then('it should render the tabs', () => {
      expect(wrapper.findComponent(AvTabsStub).exists()).toBe(true)
    })

    BddTest().then('it should render the write feedback tab with the feedback prop', () => {
      const writeFeedbackTab = wrapper.findComponent({ name: 'WriteFeedbackTab' })
      expect(writeFeedbackTab.exists()).toBe(true)
      expect(writeFeedbackTab.props('feedback')).toEqual(mockFeedback)
    })

    BddTest().then('it should pass the feedback history and max iterations to the history tab', () => {
      const historyTab = getHistoryTab()
      expect(historyTab.exists()).toBe(true)
      expect(historyTab.props('feedbacks')).toEqual(mockedFeedbackHistory)
      expect(historyTab.props('maxIterations')).toBe(mockFeedback.activity.feedbackAllowedIterations)
    })

    BddTest().then('it should forward the loaded state to the history tab', () => {
      const historyTab = getHistoryTab()
      expect(historyTab.props('isLoading')).toBe(false)
      expect(historyTab.props('error')).toBe(null)
    })

    BddTest().then('it should display the history count in the tab title', () => {
      expect(getHistoryTabTitle()).toContain(`(${mockedFeedbackHistory.length})`)
    })

    BddTest().then('it should render the floating panel with the updated title', () => {
      expect(wrapper.findComponent(AvFloatingPanelStub).props('title')).toBe('Gestion du feedback')
    })
  })

  BddTest().when('the feedback history is empty', () => {
    beforeEach(async () => {
      server.use(createGetFeedbackHistoryHandler([]))
      wrapper = await mountPanel()
    })

    BddTest().then('it should pass an empty list to the history tab', () => {
      expect(getHistoryTab().props('feedbacks')).toEqual([])
    })

    BddTest().then('it should display a zero count in the tab title', () => {
      expect(getHistoryTabTitle()).toContain('(0)')
    })
  })

  BddTest().when('the feedback history fails to load', () => {
    beforeEach(async () => {
      server.use(getFeedbackHistoryErrorHandler)
      wrapper = await mountPanel()
    })

    BddTest().then('it should forward the error to the history tab', () => {
      expect(getHistoryTab().props('error')).toBeTruthy()
    })
  })
})
