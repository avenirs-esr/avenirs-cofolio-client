import { FeedbacksHistoryTabStub } from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistory.stub'
import { WriteFeedbackTabStub } from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.stub'
import WriteFeedbackFloatingPanel from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.vue'
import { AvFloatingPanelStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a write feedback floating panel', () => {
  let wrapper: VueWrapper<InstanceType<typeof WriteFeedbackFloatingPanel>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    AvFloatingPanel: AvFloatingPanelStub,
    WriteFeedbackTab: WriteFeedbackTabStub,
    FeedbacksHistoryTab: FeedbacksHistoryTabStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(WriteFeedbackFloatingPanel, {
        props: { activityTitle: 'Test Activity' },
        global: { stubs }
      })
    })

    BddTest().then('it should render the floating panel', () => {
      expect(wrapper.findComponent(AvFloatingPanelStub).exists()).toBe(true)
    })

    BddTest().then('it should render the tabs', () => {
      expect(wrapper.findComponent(AvTabsStub).exists()).toBe(true)
    })

    BddTest().then('it should render the write feedback tab', () => {
      expect(wrapper.findComponent(WriteFeedbackTabStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the feedback history tab', () => {
      expect(wrapper.findComponent(FeedbacksHistoryTabStub).exists()).toBe(false)
    })
  })
})
