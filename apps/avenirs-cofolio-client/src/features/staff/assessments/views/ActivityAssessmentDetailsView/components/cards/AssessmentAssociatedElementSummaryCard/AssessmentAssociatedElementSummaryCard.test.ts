import type { VueWrapper } from '@vue/test-utils'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { mockedAssessmentDetailsWithAssociations } from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import AssessmentAssociatedElementSummaryCard
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/cards/AssessmentAssociatedElementSummaryCard/AssessmentAssociatedElementSummaryCard.vue'
import { AssociatedElementCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.stub'
import { AssociatedElementDetailsDrawerStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/drawers/AssociatedElementDetailsDrawer/AssociatedElementDetailsDrawer.stub'

const TITLE = 'Récapitulatif des éléments associés ({count})'

const CONTEXT_ORDER = [
  EAssociationContextType.TRACE,
  EAssociationContextType.DECLARED_SKILL,
  EAssociationContextType.DECLARED_EXPERIENCE,
]

BddTest().given('an AssessmentAssociatedElementSummaryCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentAssociatedElementSummaryCard>>

  const stubs = {
    AvIconText: AvIconTextStub,
    Card: CardStub,
    AssociatedElementCard: AssociatedElementCardStub,
    AssociatedElementDetailsDrawer: AssociatedElementDetailsDrawerStub,
  }

  const { associations } = mockedAssessmentDetailsWithAssociations

  const getCard = () => wrapper.findComponent(CardStub)
  const getAssociatedElementCards = () => wrapper.findAllComponents(AssociatedElementCardStub)
  const getAssociatedElementDetailsDrawer = () => wrapper.findComponent(AssociatedElementDetailsDrawerStub)
  const getTitle = () => wrapper.findComponent(AvIconTextStub)

  BddTest().when('the card is mounted with associations', () => {
    beforeEach(() => {
      wrapper = mountComponent(AssessmentAssociatedElementSummaryCard, {
        props: { associations },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(getCard().exists()).toBe(true)
    })

    BddTest().then('it should render the correct title and number of AssociatedElementCard', () => {
      const expectedAssociationsCount = Object.values(associations).reduce((sum, array) => sum + array.length, 0)
      expect(getTitle().props('text')).toContain(TITLE.replace('{count}', String(expectedAssociationsCount)))
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
})
