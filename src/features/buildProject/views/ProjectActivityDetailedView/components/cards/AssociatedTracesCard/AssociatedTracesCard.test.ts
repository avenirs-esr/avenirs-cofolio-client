import { createMockedTraceAssociations } from '@/__mocks__/fixtures/student/activities.fixtures'
import AssociatedTracesCard, { type AssociatedTracesCardProps } from '@/features/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import { AssociatedTraceCardStub } from '@/features/global/components/cards/AssociatedTraceCard/AssociatedTraceCard.stub'
import { AssociationsCardStub } from '@/features/global/components/cards/AssociationsCard/AssociationsCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated traces card', () => {
  let wrapper: VueWrapper

  const stubs = {
    AssociationsCard: AssociationsCardStub,
    AssociatedTraceCard: AssociatedTraceCardStub,
  }

  BddTest().when('the component is mounted with associated traces', () => {
    const props: AssociatedTracesCardProps = {
      associatedTraces: createMockedTraceAssociations(3),
      traceAllowedAssociations: 7,
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedTracesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render a card for each associated trace', () => {
      const traceCards = wrapper.findAllComponents(AssociatedTraceCardStub)
      expect(traceCards).toHaveLength(props.associatedTraces.length)
    })

    BddTest().then('it should pass the plural title with count', () => {
      expect(wrapper.findComponent(AssociationsCardStub).props('title')).toBe(`Mes traces associées (${props.associatedTraces.length}/7)`)
    })
  })

  BddTest().when('the component is mounted with no associated traces', () => {
    const props: AssociatedTracesCardProps = {
      associatedTraces: []
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedTracesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render nothing', () => {
      expect(wrapper.findComponent(AssociationsCardStub).exists()).toBe(false)
    })
  })
})
