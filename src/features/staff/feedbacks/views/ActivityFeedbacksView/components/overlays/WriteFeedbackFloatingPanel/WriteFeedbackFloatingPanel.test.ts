import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import WriteFeedbackFloatingPanel from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.vue'
import { AvFloatingPanelStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a write feedback floating panel', () => {
  let wrapper: VueWrapper<InstanceType<typeof WriteFeedbackFloatingPanel>>

  const mockFeedback: FeedbackDetailsDTO = {
    id: 'feedback-1',
    feedback: 'Test feedback',
    declaredActivityId: 'activity-1',
  } as FeedbackDetailsDTO

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    AvFloatingPanel: AvFloatingPanelStub,
    WriteFeedbackTab: true,
    FeedbacksHistoryTab: true,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(WriteFeedbackFloatingPanel, {
        props: {
          feedback: mockFeedback,
          activityTitle: 'Test Activity'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the floating panel', () => {
      expect(wrapper.findComponent(AvFloatingPanelStub).exists()).toBe(true)
    })

    BddTest().then('it should render the tabs', () => {
      expect(wrapper.findComponent(AvTabsStub).exists()).toBe(true)
    })

    BddTest().then('it should render the write feedback tab with feedback prop', () => {
      const writeFeedbackTab = wrapper.findComponent({ name: 'WriteFeedbackTab' })
      expect(writeFeedbackTab.exists()).toBe(true)
      expect(writeFeedbackTab.props('feedback')).toEqual(mockFeedback)
    })
  })
})
