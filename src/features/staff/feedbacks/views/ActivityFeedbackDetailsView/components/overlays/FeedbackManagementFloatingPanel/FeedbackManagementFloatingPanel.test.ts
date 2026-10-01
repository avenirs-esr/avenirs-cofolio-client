import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { HttpHandler } from 'msw'
import { mockedFeedbackDetailsSeen, mockedFeedbackDetailsWithAssociations, mockedFeedbackHistory } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { createGetFeedbackHistoryHandler, getFeedbackHistoryErrorHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { FloatingPanelStub } from '@/common/components/overlay/FloatingPanel/FloatingPanel.stub'
import { ICONS } from '@/common/constants'
import { FeedbacksHistoryTabStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistory.stub'
import { WriteFeedbackTabStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.stub'
import { FeedbackManagementFloatingPanelTabs } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.types'
import FeedbackManagementFloatingPanel, { type FeedbackManagementFloatingPanelProps } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const HISTORY_TITLE = 'Historique des feedbacks ({count})'
const PANEL_TITLE = 'Gestion du feedback'
const WRITE_TAB_TITLE = 'Mon feedback'

const defaultProps: FeedbackManagementFloatingPanelProps = {
  feedback: mockedFeedbackDetailsWithAssociations,
  activityTitle: 'Test Activity',
}

BddTest().given('a FeedbackManagementFloatingPanel', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackManagementFloatingPanel>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    FloatingPanel: FloatingPanelStub,
    WriteFeedbackTab: WriteFeedbackTabStub,
    FeedbacksHistoryTab: FeedbacksHistoryTabStub,
  }

  const mountWith = async (
    props: Partial<FeedbackManagementFloatingPanelProps> = {},
    handler?: HttpHandler
  ) => {
    if (handler) {
      server.use(handler)
    }

    wrapper = mountComponent(FeedbackManagementFloatingPanel, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs,
      },
    })

    await flushPromises()
  }

  const getPanel = () => wrapper.findComponent(FloatingPanelStub)
  const getTabs = () => wrapper.findComponent(AvTabsStub)
  const getWriteFeedbackTab = () => wrapper.findComponent(WriteFeedbackTabStub)
  const getHistoryTab = () => wrapper.findComponent(FeedbacksHistoryTabStub)

  const getTabButton = (tab: FeedbackManagementFloatingPanelTabs) => wrapper.findAllComponents(AvTabStub)[tab]!
  const getWriteFeedbackTabButton = () => getTabButton(FeedbackManagementFloatingPanelTabs.MY_FEEDBACK)
  const getHistoryTabButton = () => getTabButton(FeedbackManagementFloatingPanelTabs.HISTORY)

  const expectSelectedTab = (selectedTab: FeedbackManagementFloatingPanelTabs) => {
    expect(getTabs().props('modelValue')).toBe(selectedTab)
  }

  const expectHistory = (
    feedbacks: FeedbackOverviewDTO[] = mockedFeedbackHistory,
    hasError: boolean = false
  ) => {
    const historyTab = getHistoryTab()
    const expectedTitle = HISTORY_TITLE.replace('{count}', String(feedbacks.length))

    expect(historyTab.props('feedbacks')).toEqual(feedbacks)
    expect(historyTab.props('maxIterations')).toBe(defaultProps.feedback.activity.feedbackAllowedIterations)
    expect(historyTab.props('isLoading')).toBe(false)

    if (hasError) {
      expect(historyTab.props('error')).toBeTruthy()
    }
    else {
      expect(historyTab.props('error')).toBeFalsy()
    }

    expect(getHistoryTabButton().props('title')).toBe(expectedTitle)
  }

  const expectPanelToggledWhenWriteFeedbackEmits = async (
    event: NonNullable<typeof WriteFeedbackTabStub.emits>[number]
  ) => {
    const panel = getPanel()
    const collapsedBefore = panel.attributes('data-collapsed')

    await getWriteFeedbackTab().vm.$emit(event)

    expect(panel.attributes('data-collapsed')).not.toBe(collapsedBefore)
  }

  BddTest().when('the feedback history is loaded', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the floating panel with the correct props', () => {
      const panel = getPanel()
      expect(panel.exists()).toBe(true)
      expect(panel.props('title')).toBe(PANEL_TITLE)
      expect(panel.props('subtitle')).toBe(defaultProps.activityTitle)
      expect(panel.props('icon')).toBe(ICONS.FEEDBACK)
    })

    BddTest().then('it should default to the write feedback tab', () => {
      const writeFeedbackTabButton = getWriteFeedbackTabButton()
      expectSelectedTab(FeedbackManagementFloatingPanelTabs.MY_FEEDBACK)
      expect(writeFeedbackTabButton.props('title')).toBe(WRITE_TAB_TITLE)
      expect(writeFeedbackTabButton.props('disabled')).toBe(false)
    })

    BddTest().then('it should render the write feedback tab with the correct props', () => {
      expect(getWriteFeedbackTab().props('feedback')).toEqual(defaultProps.feedback)
    })

    BddTest().then('it should render the feedback history with the expected data', () => {
      expectHistory()
    })

    BddTest().then('it should toggle the panel when the write feedback tab emits feedback-sent', async () => {
      await expectPanelToggledWhenWriteFeedbackEmits('feedbackSent')
    })

    BddTest().then('it should toggle the panel when the write feedback tab emits cancel', async () => {
      await expectPanelToggledWhenWriteFeedbackEmits('cancel')
    })
  })

  BddTest().when('the feedback history is empty', () => {
    beforeEach(async () => {
      await mountWith({}, createGetFeedbackHistoryHandler([]))
    })

    BddTest().then('it should pass an empty list to the history tab and display the history tab title with a zero count', () => {
      expectHistory([])
    })
  })

  BddTest().when('the feedback history fails to load', () => {
    beforeEach(async () => {
      await mountWith({}, getFeedbackHistoryErrorHandler)
    })

    BddTest().then('it should forward the error to the history tab', () => {
      expectHistory([], true)
    })
  })

  BddTest().when('the feedback becomes seen', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should switch to the history tab automatically', async () => {
      await wrapper.setProps({ feedback: mockedFeedbackDetailsSeen })

      expectSelectedTab(FeedbackManagementFloatingPanelTabs.HISTORY)
    })

    BddTest().then('it should disable the write feedback tab', async () => {
      await wrapper.setProps({ feedback: mockedFeedbackDetailsSeen })

      expect(getWriteFeedbackTabButton().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a seen feedback', () => {
    beforeEach(async () => {
      await mountWith({ feedback: mockedFeedbackDetailsSeen })
    })

    BddTest().then('it should default to the history tab and disable the write feedback tab', () => {
      expectSelectedTab(FeedbackManagementFloatingPanelTabs.HISTORY)
      expect(getWriteFeedbackTabButton().props('disabled')).toBe(true)
    })
  })
})
