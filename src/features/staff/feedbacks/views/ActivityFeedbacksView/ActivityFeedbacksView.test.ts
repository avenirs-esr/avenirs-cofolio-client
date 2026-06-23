import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import ActivityFeedbacksView from '@/features/staff/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'
import { WriteFeedbackFloatingPanelStub } from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity feedbacks view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbacksView>>

  const stubs = {
    PageTitle: PageTitleStub,
    WriteFeedbackFloatingPanel: WriteFeedbackFloatingPanelStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityFeedbacksView, {
        props: { activityId: 'activity-1', feedbackId: 'feedback-1' },
        global: { stubs }
      })

      await flushPromises()
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render the write feedback floating panel', () => {
      expect(wrapper.findComponent(WriteFeedbackFloatingPanelStub).exists()).toBe(true)
    })
  })
})
