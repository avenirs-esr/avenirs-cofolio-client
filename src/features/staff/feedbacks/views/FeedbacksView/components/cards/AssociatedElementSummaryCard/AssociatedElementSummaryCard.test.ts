import { mockedFeedbackDetailsWithAssociations, mockedFeedbackDetailsWithoutAssociations } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { getFeedbackDetailsWithAssociationsHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { AssociatedElementCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.stub'
import AssociatedElementSummaryCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementSummaryCard/AssociatedElementSummaryCard.vue'
import { AssociatedElementDetailsDrawerStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/drawers/AssociatedElementDetailsDrawer/AssociatedElementDetailsDrawer.stub'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvCard: AvCardStub,
  AssociatedElementCard: AssociatedElementCardStub,
  AssociatedElementDetailsDrawer: AssociatedElementDetailsDrawerStub,
  QuerySuspense: QuerySuspenseStub,
}

BddTest().given('a AssociatedElementSummaryCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementSummaryCard>>

  beforeEach(() => {
    vi.clearAllMocks()
    server.use(getFeedbackDetailsWithAssociationsHandler)
  })

  BddTest().when('feedback has associated traces and skills', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociatedElementSummaryCard, {
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

    BddTest().then('it should open the drawer for the selected trace', async () => {
      const traceCard = wrapper.findAllComponents(AssociatedElementCardStub)[0]
      traceCard.vm.$emit('show-details', traceCard.props('feedbackAssociatedElement'))
      await vi.waitFor(() => wrapper.findComponent(AssociatedElementDetailsDrawerStub).exists())

      const drawer = wrapper.findComponent(AssociatedElementDetailsDrawerStub)
      expect(drawer.exists()).toBe(true)
      expect(drawer.props('feedbackAssociatedElement')).toEqual(traceCard.props('feedbackAssociatedElement'))
    })

    BddTest().then('it should close the drawer when it emits close', async () => {
      const traceCard = wrapper.findAllComponents(AssociatedElementCardStub)[0]
      traceCard.vm.$emit('show-details', traceCard.props('feedbackAssociatedElement'))
      await vi.waitFor(() => wrapper.findComponent(AssociatedElementDetailsDrawerStub).exists())
      const drawer = wrapper.findComponent(AssociatedElementDetailsDrawerStub)

      drawer.vm.$emit('close')

      await vi.waitFor(() => expect(wrapper.findComponent(AssociatedElementDetailsDrawerStub).exists()).toBe(false))
    })

    BddTest().then('it should open the drawer for a declared skill', async () => {
      const skillCard = wrapper.findAllComponents(AssociatedElementCardStub)[1]
      skillCard.vm.$emit('show-details', skillCard.props('feedbackAssociatedElement'))
      await vi.waitFor(() => wrapper.findComponent(AssociatedElementDetailsDrawerStub).exists())

      const drawer = wrapper.findComponent(AssociatedElementDetailsDrawerStub)
      expect(drawer.exists()).toBe(true)
      expect(drawer.props('feedbackAssociatedElement')).toEqual(skillCard.props('feedbackAssociatedElement'))
    })
  })

  BddTest().when('feedback has no associations', () => {
    beforeEach(async () => {
      wrapper = mountComponent(AssociatedElementSummaryCard, {
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
