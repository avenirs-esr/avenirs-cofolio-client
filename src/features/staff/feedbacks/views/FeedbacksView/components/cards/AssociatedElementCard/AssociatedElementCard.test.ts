import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import type { VueWrapper } from '@vue/test-utils'
import { createMockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/declaredSkills.fixtures'
import { mockedTraceDetailedWithFile, mockedTraceDetailedWithLink } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { AssociatedElementTypeBadgeStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/badges/AssociatedElementTypeBadge/AssociatedElementTypeBadge.stub'
import AssociatedElementCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.vue'
import { FeedbackTraceActionsStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbackTraceActions/FeedbackTraceActions.stub'
import { AvButtonStub, AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNavigateToStudentToolsTrace = vi.fn()
const mockNavigateToStudentProjectSkill = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentToolsTrace: mockNavigateToStudentToolsTrace,
      navigateToStudentProjectSkill: mockNavigateToStudentProjectSkill,
    }),
  }
})

const mockedFeedbackTraceWithFile: FeedbackAssociatedElement = {
  type: EAssociationContextType.TRACE,
  data: mockedTraceDetailedWithFile,
}
const mockedFeedbackTraceWithLink: FeedbackAssociatedElement = {
  type: EAssociationContextType.TRACE,
  data: mockedTraceDetailedWithLink,
}

const mockedFeedbackDeclaredSkill: FeedbackAssociatedElement = {
  type: EAssociationContextType.DECLARED_SKILL,
  data: createMockedDeclaredActivityAssociations(1)[0].declaredSkill,
}

const stubs = {
  AvCard: AvCardStub,
  AvButton: AvButtonStub,
  AssociatedElementTypeBadge: AssociatedElementTypeBadgeStub,
  FeedbackTraceActions: FeedbackTraceActionsStub,
}

BddTest().given('an AssociatedElementCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementCard>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the element is a TRACE with a file attachment', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociatedElementCard, {
        props: { feedbackAssociatedElement: mockedFeedbackTraceWithFile },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the badge with correct type', () => {
      const badge = wrapper.findComponent(AssociatedElementTypeBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('associatedElementType')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.text()).toContain(mockedFeedbackTraceWithFile.data.title)
    })

    BddTest().then('it should render FeedbackTraceActions', () => {
      expect(wrapper.findComponent(FeedbackTraceActionsStub).exists()).toBe(true)
    })

    BddTest().then('it should render the detail button', () => {
      expect(wrapper.find('[data-testid="associated-element-card-detail-button"]').exists()).toBe(true)
    })

    BddTest().then('it should navigate to trace detail when detail button is clicked', async () => {
      await wrapper.find('[data-testid="associated-element-card-detail-button"]').trigger('click')
      expect(mockNavigateToStudentToolsTrace).toHaveBeenCalledWith({ id: mockedFeedbackTraceWithFile.data.id })
    })
  })

  BddTest().when('the element is a TRACE with a link', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociatedElementCard, {
        props: { feedbackAssociatedElement: mockedFeedbackTraceWithLink },
        global: { stubs },
      })
    })

    BddTest().then('it should render FeedbackTraceActions', () => {
      expect(wrapper.findComponent(FeedbackTraceActionsStub).exists()).toBe(true)
    })

    BddTest().then('it should navigate to trace detail when detail button is clicked', async () => {
      await wrapper.find('[data-testid="associated-element-card-detail-button"]').trigger('click')
      expect(mockNavigateToStudentToolsTrace).toHaveBeenCalledWith({ id: mockedFeedbackTraceWithLink.data.id })
    })
  })

  BddTest().when('the element is a DECLARED_SKILL', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssociatedElementCard, {
        props: { feedbackAssociatedElement: mockedFeedbackDeclaredSkill },
        global: { stubs },
      })
    })

    BddTest().then('it should render the badge with correct type', () => {
      const badge = wrapper.findComponent(AssociatedElementTypeBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('associatedElementType')).toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().then('it should not render FeedbackTraceActions', () => {
      expect(wrapper.findComponent(FeedbackTraceActionsStub).exists()).toBe(false)
    })

    BddTest().then('it should navigate to skill detail when detail button is clicked', async () => {
      await wrapper.find('[data-testid="associated-element-card-detail-button"]').trigger('click')
      expect(mockNavigateToStudentProjectSkill).toHaveBeenCalledWith({ id: mockedFeedbackDeclaredSkill.data.id })
    })
  })
})
