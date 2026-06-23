import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import ActivityFeedbackDetailsView from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'
import { WriteFeedbackFloatingPanelStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.stub'
import { ActivityFeedbackStudentSelectStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity feedback details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbackDetailsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ActivityFeedbackStudentSelect: ActivityFeedbackStudentSelectStub,
    WriteFeedbackFloatingPanel: WriteFeedbackFloatingPanelStub,
  }

  BddTest().when('the component is mounted with a feedback id', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityFeedbackDetailsView, {
        props: { feedbackId: 'feedback-1' },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render the student select', () => {
      expect(wrapper.findComponent(ActivityFeedbackStudentSelectStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the feedbacks to the student select', () => {
      const studentSelect = wrapper.findComponent(ActivityFeedbackStudentSelectStub)

      expect(studentSelect.props('feedbacks')).toBeDefined()
    })

    BddTest().then('it should render the write feedback floating panel', () => {
      expect(wrapper.findComponent(WriteFeedbackFloatingPanelStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted without a feedback id', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityFeedbackDetailsView, {
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render the student select with empty feedbacks', () => {
      const studentSelect = wrapper.findComponent(ActivityFeedbackStudentSelectStub)

      expect(studentSelect.exists()).toBe(true)
      expect(studentSelect.props('feedbacks')).toEqual([])
    })

    BddTest().then('it should not render the write feedback floating panel', () => {
      expect(wrapper.findComponent(WriteFeedbackFloatingPanelStub).exists()).toBe(false)
    })
  })
})
