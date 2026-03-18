import type { VueWrapper } from '@vue/test-utils'
import { TraceCompactCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceCompactCard/TraceCompactCard.stub'
import SelectedAssociateTracesContainer, {
  type SelectedAssociateTracesContainerProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/SelectedAssociateTracesContainer/SelectedAssociateTracesContainer.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a selected associate traces container', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelectedAssociateTracesContainer>>

  const stubs = {
    AvCard: AvCardStub,
    TraceCompactCard: TraceCompactCardStub
  }

  const props: SelectedAssociateTracesContainerProps = {
    traces: [
      { id: 'trace-1', title: 'Trace 1' },
      { id: 'trace-2', title: 'Trace 2' }
    ]
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelectedAssociateTracesContainer, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the title with the count', () => {
      expect(wrapper.text()).toContain('Mes éléments sélectionnés (2)')
    })

    BddTest().then('it should render the card container', () => {
      const card = wrapper.findComponent(AvCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render one trace compact card per trace', () => {
      const cards = wrapper.findAllComponents(TraceCompactCardStub)
      expect(cards).toHaveLength(2)
    })

    BddTest().then('it should pass each trace to a trace compact card', () => {
      const cards = wrapper.findAllComponents(TraceCompactCardStub)

      expect(cards[0].props('trace')).toEqual(props.traces[0])
      expect(cards[1].props('trace')).toEqual(props.traces[1])
    })
  })
})
