import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import { SelectorOverlayStub } from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.stub'
import {
  StudentTraceCardStub
} from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.stub'
import TracesSelector from '@/features/student/traces/components/interactions/pickers/TracesSelector/TracesSelector.vue'
import { AvCheckboxStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvCheckbox: AvCheckboxStub,
  StudentTraceCard: StudentTraceCardStub,
  SelectorOverlay: SelectorOverlayStub
}

BddTest().given('a traces selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof TracesSelector>>

  function getLastEmittedModelValue (): string[] {
    const modelValueEvents = wrapper.emitted('update:modelValue')
    expect(modelValueEvents).toBeDefined()
    expect(modelValueEvents!.length).toBeGreaterThan(0)
    return modelValueEvents![modelValueEvents!.length - 1][0] as string[]
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TracesSelector, {
      props: {
        traces: [...mockedTraceOverview]
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render all traces', () => {
      const traceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(traceCards).toHaveLength(3)
    })

    BddTest().then('it should render trace cards with undefined to prop', () => {
      const traceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      traceCards.forEach((card) => {
        expect(card.props('to')).toBeUndefined()
      })
    })

    BddTest().then('it should render an anchor with button role for each trace', () => {
      const anchors = wrapper.findAll('a[role="button"]')
      expect(anchors).toHaveLength(3)
    })

    BddTest().then('it should render anchors with correct key values', () => {
      const anchors = wrapper.findAll('a[role="button"]')
      expect(anchors[0].text()).toContain(mockedTraceOverview[0].title)
      expect(anchors[1].text()).toContain(mockedTraceOverview[1].title)
      expect(anchors[2].text()).toContain(mockedTraceOverview[2].title)
    })
  })

  BddTest().when('a trace is selected', () => {
    beforeEach(async () => {
      const firstSelectableAnchor = wrapper.findAll('a[role="button"]')[0]
      await firstSelectableAnchor.trigger('click')
    })

    BddTest().then('it should emit update:modelValue event with selected trace IDs', () => {
      const lastEmit = getLastEmittedModelValue()
      expect(lastEmit).toEqual([mockedTraceOverview[0].traceId])
    })
  })

  BddTest().when('multiple traces are selected', () => {
    beforeEach(async () => {
      const anchors = wrapper.findAll('a[role="button"]')
      await anchors[0].trigger('click')
      await anchors[1].trigger('click')
    })

    BddTest().then('it should emit update:modelValue event with all selected trace IDs', async () => {
      await vi.waitFor(() => {
        const lastEmit = getLastEmittedModelValue()
        expect(lastEmit).toHaveLength(2)
        expect(lastEmit).toContain(mockedTraceOverview[0].traceId)
        expect(lastEmit).toContain(mockedTraceOverview[1].traceId)
      })
    })
  })

  BddTest().when('a trace is unselected', () => {
    beforeEach(async () => {
      const anchors = wrapper.findAll('a[role="button"]')
      await anchors[0].trigger('click')
      await anchors[1].trigger('click')
      await anchors[0].trigger('click')
    })

    BddTest().then('it should emit update:modelValue event with remaining selected trace ID', async () => {
      await vi.waitFor(() => {
        const lastEmit = getLastEmittedModelValue()
        expect(lastEmit).toHaveLength(1)
        expect(lastEmit).toEqual([mockedTraceOverview[1].traceId])
      })
    })
  })

  BddTest().when('no traces are provided', () => {
    beforeEach(() => {
      wrapper = mount(TracesSelector, {
        props: {
          traces: []
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render any trace cards', () => {
      const traceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(traceCards).toHaveLength(0)
    })

    BddTest().then('it should not render any selectable anchors', () => {
      const anchors = wrapper.findAll('a[role="button"]')
      expect(anchors).toHaveLength(0)
    })
  })

  BddTest().when('the component is in readonly mode', () => {
    beforeEach(() => {
      wrapper = mount(TracesSelector, {
        props: {
          traces: [...mockedTraceOverview],
          readonly: true
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render trace cards', () => {
      const traceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(traceCards).toHaveLength(3)
    })

    BddTest().then('it should not render anchors', () => {
      const anchors = wrapper.findAll('a[role="button"]')
      expect(anchors).toHaveLength(0)
    })
  })
})
