import type { FeedbackAssociatedElement } from '@/features/feedbacks/types/feedback.types'
import type { VueWrapper } from '@vue/test-utils'
import { createMockedDeclaredSkillAssociations } from '@/__mocks__/fixtures/student/declaredSkills.fixtures'
import { mockedTraceDetailedWithFile, mockedTraceDetailedWithLink } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { AssociatedElementTypeBadgeStub } from '@/features/feedbacks/views/FeedbacksView/components/badges/AssociatedElementTypeBadge/AssociatedElementTypeBadge.stub'
import AssociatedElementCard from '@/features/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.vue'
import { FeedbackTraceActionsStub } from '@/features/feedbacks/views/FeedbacksView/components/FeedbackTraceActions/FeedbackTraceActions.stub'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

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
  data: createMockedDeclaredSkillAssociations(1)[0].declaredSkill,
}

const stubs = {
  AvCard: AvCardStub,
  AssociatedElementTypeBadge: AssociatedElementTypeBadgeStub,
  FeedbackTraceActions: FeedbackTraceActionsStub,
}

BddTest().given('an AssociatedElementCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementCard>>

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
  })
})
