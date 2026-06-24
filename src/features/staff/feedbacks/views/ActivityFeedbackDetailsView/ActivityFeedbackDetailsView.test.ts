import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { StudentPerspectiveCardStub } from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.stub'
import ActivityFeedbackDetailsView from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'
import { WriteFeedbackFloatingPanelStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/WriteFeedbackFloatingPanel/WriteFeedbackFloatingPanel.stub'
import { ActivityFeedbackStudentSelectStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.stub'
import {
  AssociatedElementSummaryCardStub
} from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementSummaryCard/AssociatedElementSummaryCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity feedback details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbackDetailsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityFeedbackStudentSelect: ActivityFeedbackStudentSelectStub,
    WriteFeedbackFloatingPanel: WriteFeedbackFloatingPanelStub,
    StudentPerspectiveCard: StudentPerspectiveCardStub,
    AssociatedElementSummaryCard: AssociatedElementSummaryCardStub,
  }

  BddTest().when('the component is mounted with a feedback id corresponding to non submitted feedback', () => {
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

    BddTest().then('it should render query suspense wrappers', () => {
      expect(wrapper.findAllComponents(QuerySuspenseStub)).toHaveLength(2)
    })

    BddTest().then('it should render the student select', () => {
      expect(wrapper.findComponent(ActivityFeedbackStudentSelectStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the feedbacks to the student select', () => {
      const studentSelect = wrapper.findComponent(ActivityFeedbackStudentSelectStub)

      expect(studentSelect.props('feedbacks')).toBeDefined()
    })

    BddTest().then('it should render the student perspective card', () => {
      expect(wrapper.findComponent(StudentPerspectiveCardStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the student perspective to the student perspective card', () => {
      const studentPerspectiveCard = wrapper.findComponent(StudentPerspectiveCardStub)

      expect(studentPerspectiveCard.props('perspective')).toBeDefined()
    })

    BddTest().then('it should render the associated element summary card', () => {
      expect(wrapper.findComponent(AssociatedElementSummaryCardStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the selected feedback id to the associated element summary card', () => {
      const associatedElementSummaryCard = wrapper.findComponent(AssociatedElementSummaryCardStub)

      expect(associatedElementSummaryCard.props('feedbackId')).toBe('feedback-1')
    })

    BddTest().then('it should render the write feedback floating panel', () => {
      expect(wrapper.findComponent(WriteFeedbackFloatingPanelStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a feedback id corresponding to submitted feedback', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivityFeedbackDetailsView, {
        props: { feedbackId: 'feedback-submitted' },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should not render the write feedback floating panel', () => {
      expect(wrapper.findComponent(WriteFeedbackFloatingPanelStub).exists()).toBe(false)
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

    BddTest().then('it should render query suspense wrappers', () => {
      expect(wrapper.findAllComponents(QuerySuspenseStub)).toHaveLength(2)
    })

    BddTest().then('it should render the student select with empty feedbacks', () => {
      const studentSelect = wrapper.findComponent(ActivityFeedbackStudentSelectStub)

      expect(studentSelect.exists()).toBe(true)
      expect(studentSelect.props('feedbacks')).toEqual([])
    })

    BddTest().then('it should not render the student perspective card', () => {
      expect(wrapper.findComponent(StudentPerspectiveCardStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the associated element summary card', () => {
      expect(wrapper.findComponent(AssociatedElementSummaryCardStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the write feedback floating panel', () => {
      expect(wrapper.findComponent(WriteFeedbackFloatingPanelStub).exists()).toBe(false)
    })
  })
})
