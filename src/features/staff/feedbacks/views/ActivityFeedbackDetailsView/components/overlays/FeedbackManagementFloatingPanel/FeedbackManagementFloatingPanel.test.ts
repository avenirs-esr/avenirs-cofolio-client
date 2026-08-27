import { mockedFeedbackDetailsWithAssociations, mockedFeedbackHistory } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { createGetFeedbackHistoryHandler, getFeedbackHistoryErrorHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { FeedbacksHistoryTabStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistory.stub'
import { WriteFeedbackTabStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.stub'
import FeedbackManagementFloatingPanel from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.vue'
import { AvFloatingPanelStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const MY_FEEDBACK_TAB_INDEX = 0
const HISTORY_TAB_INDEX = 1

const PANEL_TITLE = 'Gestion du feedback'
const WRITE_TAB_TITLE = 'Mon feedback'
const historyTabTitle = (count: number) => `Historique des feedbacks (${count})`

const ACTIVITY_TITLE = 'Test Activity'

const stubs = {
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  AvFloatingPanel: AvFloatingPanelStub,
  WriteFeedbackTab: WriteFeedbackTabStub,
  FeedbacksHistoryTab: FeedbacksHistoryTabStub,
}

function mountPanel (feedback = mockedFeedbackDetailsWithAssociations) {
  return mountComponent(FeedbackManagementFloatingPanel, {
    props: {
      feedback,
      activityTitle: ACTIVITY_TITLE,
    },
    global: { stubs },
  })
}

BddTest().given('a write feedback floating panel with a draft feedback', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackManagementFloatingPanel>>

  const mockFeedback = mockedFeedbackDetailsWithAssociations

  const getHistoryTab = () => wrapper.findComponent(FeedbacksHistoryTabStub)
  const getWriteFeedbackTab = () => wrapper.findComponent(WriteFeedbackTabStub)
  const getMyFeedbackTabButton = () => wrapper.findAllComponents(AvTabStub)[MY_FEEDBACK_TAB_INDEX]
  const getHistoryTabButton = () => wrapper.findAllComponents(AvTabStub)[HISTORY_TAB_INDEX]

  BddTest().when('the feedback history is loaded', () => {
    beforeEach(async () => {
      wrapper = mountPanel(mockFeedback)
      await flushPromises()
    })

    BddTest().then('it should render the floating panel', () => {
      expect(wrapper.findComponent(AvFloatingPanelStub).exists()).toBe(true)
    })

    BddTest().then('it should render the floating panel with the expected title, subtitle and icon', () => {
      const panel = wrapper.findComponent(AvFloatingPanelStub)
      expect(panel.props('title')).toBe(PANEL_TITLE)
      expect(panel.props('subtitle')).toBe(ACTIVITY_TITLE)
      expect(panel.props('icon')).toBe(ICONS.FEEDBACK)
    })

    BddTest().then('it should render the write feedback tab with the feedback prop', () => {
      expect(getWriteFeedbackTab().exists()).toBe(true)
      expect(getWriteFeedbackTab().props('feedback')).toEqual(mockFeedback)
    })

    BddTest().then('it should render the write feedback tab with the expected title', () => {
      expect(getMyFeedbackTabButton().props('title')).toBe(WRITE_TAB_TITLE)
    })

    BddTest().then('it should keep the write feedback tab enabled', () => {
      expect(getMyFeedbackTabButton().props('disabled')).toBe(false)
    })

    BddTest().then('it should default to the write feedback tab', () => {
      expect(wrapper.findComponent(AvTabsStub).props('modelValue')).toBe(MY_FEEDBACK_TAB_INDEX)
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

    BddTest().then('it should display the exact history tab title with the count', () => {
      expect(getHistoryTabButton().props('title')).toBe(historyTabTitle(mockedFeedbackHistory.length))
    })

    BddTest().then('it should toggle the panel when the write feedback tab emits feedback-sent', async () => {
      const panel = wrapper.findComponent(AvFloatingPanelStub)
      const collapsedBefore = panel.attributes('data-collapsed')

      await getWriteFeedbackTab().vm.$emit('feedbackSent')

      expect(panel.attributes('data-collapsed')).not.toBe(collapsedBefore)
    })

    BddTest().then('it should toggle the panel when the write feedback tab emits cancel', async () => {
      const panel = wrapper.findComponent(AvFloatingPanelStub)
      const collapsedBefore = panel.attributes('data-collapsed')

      await getWriteFeedbackTab().vm.$emit('cancel')

      expect(panel.attributes('data-collapsed')).not.toBe(collapsedBefore)
    })
  })

  BddTest().when('the feedback becomes seen', () => {
    beforeEach(async () => {
      wrapper = mountPanel(mockFeedback)
      await flushPromises()
    })

    BddTest().then('it should switch to the history tab automatically', async () => {
      await wrapper.setProps({ feedback: { ...mockFeedback, status: EFeedbackStatus.SEEN } })

      expect(wrapper.findComponent(AvTabsStub).props('modelValue')).toBe(HISTORY_TAB_INDEX)
    })

    BddTest().then('it should disable the write feedback tab', async () => {
      await wrapper.setProps({ feedback: { ...mockFeedback, status: EFeedbackStatus.SEEN } })

      expect(getMyFeedbackTabButton().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the feedback history is empty', () => {
    beforeEach(async () => {
      server.use(createGetFeedbackHistoryHandler([]))
      wrapper = mountPanel(mockFeedback)
      await flushPromises()
    })

    BddTest().then('it should pass an empty list to the history tab', () => {
      expect(getHistoryTab().props('feedbacks')).toEqual([])
    })

    BddTest().then('it should display the exact history tab title with a zero count', () => {
      expect(getHistoryTabButton().props('title')).toBe(historyTabTitle(0))
    })
  })

  BddTest().when('the feedback history fails to load', () => {
    beforeEach(async () => {
      server.use(getFeedbackHistoryErrorHandler)
      wrapper = mountPanel(mockFeedback)
      await flushPromises()
    })

    BddTest().then('it should forward the error to the history tab', () => {
      expect(getHistoryTab().props('error')).toBeTruthy()
    })
  })
})

BddTest().given('a write feedback floating panel with a seen feedback', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackManagementFloatingPanel>>

  const seenFeedback = {
    ...mockedFeedbackDetailsWithAssociations,
    status: EFeedbackStatus.SEEN,
  }

  const getMyFeedbackTabButton = () => wrapper.findAllComponents(AvTabStub)[MY_FEEDBACK_TAB_INDEX]

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = mountPanel(seenFeedback)
      await flushPromises()
    })

    BddTest().then('it should default to the history tab', () => {
      expect(wrapper.findComponent(AvTabsStub).props('modelValue')).toBe(HISTORY_TAB_INDEX)
    })

    BddTest().then('it should disable the write feedback tab', () => {
      expect(getMyFeedbackTabButton().props('disabled')).toBe(true)
    })
  })
})
