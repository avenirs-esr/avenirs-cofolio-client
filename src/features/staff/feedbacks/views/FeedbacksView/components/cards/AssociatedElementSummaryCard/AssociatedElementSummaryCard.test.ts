import { mockedFeedbackDetailsWithAssociations, mockedFeedbackDetailsWithoutAssociations } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { AssociatedElementCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.stub'
import AssociatedElementSummaryCard, { type AssociatedElementSummaryCardProps } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementSummaryCard/AssociatedElementSummaryCard.vue'
import { AssociatedElementDetailsDrawerStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/drawers/AssociatedElementDetailsDrawer/AssociatedElementDetailsDrawer.stub'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TITLE = 'Récapitulatif des éléments associés ({count})'
const EMPTY_MESSAGE = 'Aucun élément associé à ce feedback trouvé'

const CONTEXT_ORDER = [
  EAssociationContextType.TRACE,
  EAssociationContextType.DECLARED_SKILL,
  EAssociationContextType.DECLARED_EXPERIENCE,
]

BddTest().given('a AssociatedElementSummaryCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementSummaryCard>>

  const stubs = {
    AvIconText: AvIconTextStub,
    Card: CardStub,
    AssociatedElementCard: AssociatedElementCardStub,
    AssociatedElementDetailsDrawer: AssociatedElementDetailsDrawerStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountWith = async (props: Partial<AssociatedElementSummaryCardProps> = {}) => {
    wrapper = mountComponent(AssociatedElementSummaryCard, {
      props: {
        feedbackId: mockedFeedbackDetailsWithAssociations.id,
        ...props
      },
      global: { stubs },
    })
    await flushPromises()
  }

  const getCard = () => wrapper.findComponent(CardStub)
  const getAssociatedElementCards = () => wrapper.findAllComponents(AssociatedElementCardStub)
  const getAssociatedElementDetailsDrawer = () => wrapper.findComponent(AssociatedElementDetailsDrawerStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getTitle = () => wrapper.findComponent(AvIconTextStub)

  const expectTitle = (count: number) => {
    const expectedTitle = TITLE.replace('{count}', String(count))
    expect(getTitle().props('text')).toContain(expectedTitle)
  }

  BddTest().when('feedback has associations', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the card', () => {
      expect(getCard().exists()).toBe(true)
    })

    BddTest().then('it should render the correct title and number of AssociatedElementCard', () => {
      const expectedAssociationsCount = Object.values(mockedFeedbackDetailsWithAssociations.associations).reduce((sum, array) => sum + array.length, 0)
      expectTitle(expectedAssociationsCount)
      expect(getAssociatedElementCards()).toHaveLength(expectedAssociationsCount)
    })

    BddTest().then('it should render associated elements in the correct order', () => {
      const types = new Set(getAssociatedElementCards().map(card => card.props('feedbackAssociatedElement').type))
      const renderedOrder = [...types].map(type => CONTEXT_ORDER.indexOf(type))
      expect(renderedOrder).toEqual([...renderedOrder].sort((a, b) => a - b))
    })

    BddTest().then('it should open then close the drawer for each associated element type', async () => {
      for (const card of getAssociatedElementCards()) {
        const element = card.props('feedbackAssociatedElement')

        card.vm.$emit('show-details', element)
        await vi.waitFor(() => expect(getAssociatedElementDetailsDrawer().exists()).toBe(true))

        const drawer = getAssociatedElementDetailsDrawer()

        expect(drawer.props('feedbackAssociatedElement')).toEqual(element)

        drawer.vm.$emit('close')
        await vi.waitFor(() => expect(drawer.exists()).toBe(false))
      }
    })
  })

  BddTest().when('feedback has no associations', () => {
    beforeEach(async () => {
      await mountWith({ feedbackId: mockedFeedbackDetailsWithoutAssociations.id })
    })

    BddTest().then('it should render the correct title and no AssociatedElementCard', () => {
      expectTitle(0)
      expect(getAssociatedElementCards()).toHaveLength(0)
    })

    BddTest().then('it should render empty message', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe(EMPTY_MESSAGE)
    })
  })
})
