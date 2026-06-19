import { mockedFeedbackDetailsWithAssociations, mockedFeedbackDetailsWithoutAssociations } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { getFeedbackDetailsWithAssociationsHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { AssociatedElementCardStub } from '@/features/staff/activities/views/FeedbacksView/components/AssociatedElementCard/AssociatedElementCard.stub'
import FeedbackAssociatedElementsCard from '@/features/staff/activities/views/FeedbacksView/components/FeedbackAssociatedElementsCard/FeedbackAssociatedElementsCard.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvCard: AvCardStub,
  AssociatedElementCard: AssociatedElementCardStub,
  QuerySuspense: QuerySuspenseStub,
}

BddTest().given('a FeedbackAssociatedElementsCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackAssociatedElementsCard>>

  beforeEach(() => {
    vi.clearAllMocks()
    server.use(getFeedbackDetailsWithAssociationsHandler)
  })

  BddTest().when('feedback has associated traces and skills', () => {
    beforeEach(async () => {
      wrapper = mountComponent(FeedbackAssociatedElementsCard, {
        props: { feedbackId: mockedFeedbackDetailsWithAssociations.id },
        global: { stubs },
      })
      await flushPromises()
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="feedback-associated-elements-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the correct number of AssociatedElementCard', () => {
      const cards = wrapper.findAllComponents(AssociatedElementCardStub)
      expect(cards).toHaveLength(2)
    })

    BddTest().then('it should render a TRACE element first', () => {
      const cards = wrapper.findAllComponents(AssociatedElementCardStub)
      expect(cards[0].props('feedbackAssociatedElement').type).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should render a DECLARED_SKILL element second', () => {
      const cards = wrapper.findAllComponents(AssociatedElementCardStub)
      expect(cards[1].props('feedbackAssociatedElement').type).toBe(EAssociationContextType.DECLARED_SKILL)
    })
  })

  BddTest().when('feedback has no associations', () => {
    beforeEach(async () => {
      wrapper = mountComponent(FeedbackAssociatedElementsCard, {
        props: { feedbackId: mockedFeedbackDetailsWithoutAssociations.id },
        global: { stubs },
      })
      await flushPromises()
    })

    BddTest().then('it should render no AssociatedElementCard', () => {
      expect(wrapper.findAllComponents(AssociatedElementCardStub)).toHaveLength(0)
    })
  })
})
