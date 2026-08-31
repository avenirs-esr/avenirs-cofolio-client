import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants/route-names'
import { StudentPerspectiveCardStub } from '@/features/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.stub'
import ActivityFeedbackDetailsView from '@/features/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'
import { FeedbackManagementFloatingPanelStub } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.stub'
import { ActivityFeedbackStudentSelectStub } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/selects/ActivityFeedbackStudentSelect/ActivityFeedbackStudentSelect.stub'
import {
  AssociatedElementSummaryCardStub
} from '@/features/feedbacks/views/FeedbacksView/components/cards/AssociatedElementSummaryCard/AssociatedElementSummaryCard.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

BddTest().given('an activity feedback details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbackDetailsView>>

  const stubs = {
    AvButton: AvButtonStub,
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityFeedbackStudentSelect: ActivityFeedbackStudentSelectStub,
    FeedbackManagementFloatingPanel: FeedbackManagementFloatingPanelStub,
    StudentPerspectiveCard: StudentPerspectiveCardStub,
    AssociatedElementSummaryCard: AssociatedElementSummaryCardStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a feedback id corresponding to non submitted feedback', () => {
    beforeEach(async () => {
      vi.mocked(useRoute).mockReturnValue({
        path: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.path.replace(':feedbackId', 'feedback-1'),
      } as RouteLocationNormalizedLoadedGeneric)

      wrapper = mountComponent(ActivityFeedbackDetailsView, {
        props: { feedbackId: 'feedback-1' },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render the page sub title', () => {
      expect(wrapper.find('[data-testid="page-sub-title"]').exists()).toBe(true)
    })

    BddTest().then('it should render the see activity button', () => {
      expect(wrapper.find('[data-testid="see-activity"]').exists()).toBe(true)
    })

    BddTest().then('it should render query suspense wrappers', () => {
      expect(wrapper.findAllComponents(QuerySuspenseStub)).toHaveLength(3)
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
      expect(wrapper.findComponent(FeedbackManagementFloatingPanelStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a feedback id corresponding to submitted feedback', () => {
    beforeEach(async () => {
      vi.mocked(useRoute).mockReturnValue({
        path: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.path.replace(':feedbackId', 'feedback-submitted'),
      } as RouteLocationNormalizedLoadedGeneric)

      wrapper = mountComponent(ActivityFeedbackDetailsView, {
        props: { feedbackId: 'feedback-submitted' },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the write feedback floating panel', () => {
      expect(wrapper.findComponent(FeedbackManagementFloatingPanelStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted without a feedback id', () => {
    beforeEach(async () => {
      vi.mocked(useRoute).mockReturnValue({
        path: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.path.replace(':feedbackId', ''),
      } as RouteLocationNormalizedLoadedGeneric)

      wrapper = mountComponent(ActivityFeedbackDetailsView, {
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render query suspense wrappers', () => {
      expect(wrapper.findAllComponents(QuerySuspenseStub)).toHaveLength(3)
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
      expect(wrapper.findComponent(FeedbackManagementFloatingPanelStub).exists()).toBe(false)
    })
  })
})
