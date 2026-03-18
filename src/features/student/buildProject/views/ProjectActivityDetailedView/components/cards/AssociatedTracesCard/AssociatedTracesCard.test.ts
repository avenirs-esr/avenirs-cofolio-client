import { createMockedTraceAssociations } from '@/__mocks__/fixtures/student/activities.fixtures'
import AssociatedTracesCard, { type AssociatedTracesCardProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import { AssociatedTraceCardStub } from '@/features/student/global/components/cards/AssociatedTraceCard/AssociatedTraceCard.stub'
import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated traces card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedTracesCard>>

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    AssociatedTraceCard: AssociatedTraceCardStub,
  }

  BddTest().when('the component is mounted with associated traces', () => {
    const props: AssociatedTracesCardProps = {
      associatedTraces: createMockedTraceAssociations(3)
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedTracesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the av card', () => {
      const card = wrapper.findComponent(AvCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render a card for each associated trace', () => {
      const traceCards = wrapper.findAllComponents(AssociatedTraceCardStub)
      expect(traceCards).toHaveLength(props.associatedTraces.length)
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
      const card = wrapper.findComponent(AvCardStub)
      expect(card.exists()).toBe(false)
    })
  })
})
