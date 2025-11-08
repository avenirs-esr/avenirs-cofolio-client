import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import {
  StudentTraceCardStub
} from '@/features/student/components/traces/cards/StudentTraceCard/StudentTraceCard.stub'
import TracesSelector from '@/features/student/components/traces/interactions/pickers/TracesSelector/TracesSelector.vue'
import { AvCheckboxStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  StudentTraceCard: StudentTraceCardStub,
  AvCheckbox: AvCheckboxStub
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

    BddTest().then('it should render a checkbox for each trace', () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      expect(checkboxes).toHaveLength(3)
    })

    BddTest().then('it should render checkboxes with empty labels', () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      checkboxes.forEach((checkbox) => {
        expect(checkbox.props('label')).toBe('')
      })
    })

    BddTest().then('it should render checkboxes with correct values', () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      expect(checkboxes[0].props('value')).toBe('trace1')
      expect(checkboxes[1].props('value')).toBe('trace2')
      expect(checkboxes[2].props('value')).toBe('trace3')
    })

    BddTest().then('it should render overlays for each trace', () => {
      const overlays = wrapper.findAll('.student-trace-card-overlay')
      expect(overlays).toHaveLength(3)
    })
  })

  BddTest().when('a trace is selected', () => {
    beforeEach(async () => {
      const firstCheckbox = wrapper.findAllComponents({ name: 'AvCheckbox' })[0]
      const input = firstCheckbox.find('input[type="checkbox"]')
      await input.trigger('change')
    })

    BddTest().then('it should add the selected class to the overlay', () => {
      const firstOverlay = wrapper.findAll('.student-trace-card-overlay')[0]
      expect(firstOverlay.classes()).toContain('student-trace-card-overlay--selected')
    })

    BddTest().then('it should emit update:modelValue event with selected trace IDs', () => {
      const lastEmit = getLastEmittedModelValue()
      expect(lastEmit).toEqual(['trace1'])
    })
  })

  BddTest().when('multiple traces are selected', () => {
    beforeEach(async () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      const input1 = checkboxes[0].find('input[type="checkbox"]')
      const input2 = checkboxes[1].find('input[type="checkbox"]')
      await input1.trigger('change')
      await input2.trigger('change')
    })

    BddTest().then('it should add the selected class to the corresponding overlays', () => {
      const overlays = wrapper.findAll('.student-trace-card-overlay')
      expect(overlays[0].classes()).toContain('student-trace-card-overlay--selected')
      expect(overlays[1].classes()).toContain('student-trace-card-overlay--selected')
      expect(overlays[2].classes()).not.toContain('student-trace-card-overlay--selected')
    })

    BddTest().then('it should emit update:modelValue event with all selected trace IDs', async () => {
      await vi.waitFor(() => {
        const lastEmit = getLastEmittedModelValue()
        expect(lastEmit).toHaveLength(2)
        expect(lastEmit).toContain('trace1')
        expect(lastEmit).toContain('trace2')
      })
    })
  })

  BddTest().when('a trace is unselected', () => {
    beforeEach(async () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      const input1 = checkboxes[0].find('input[type="checkbox"]')
      const input2 = checkboxes[1].find('input[type="checkbox"]')
      await input1.trigger('change')
      await input2.trigger('change')
      await input1.trigger('change')
    })

    BddTest().then('it should remove the selected class from the overlay', () => {
      const firstOverlay = wrapper.findAll('.student-trace-card-overlay')[0]
      expect(firstOverlay.classes()).not.toContain('student-trace-card-overlay--selected')
    })

    BddTest().then('it should emit update:modelValue event with remaining selected trace ID', async () => {
      await vi.waitFor(() => {
        const lastEmit = getLastEmittedModelValue()
        expect(lastEmit).toHaveLength(1)
        expect(lastEmit).toEqual(['trace2'])
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

    BddTest().then('it should not render any checkboxes', () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      expect(checkboxes).toHaveLength(0)
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

    BddTest().then('it should not render overlays', () => {
      const overlays = wrapper.findAll('.student-trace-card-overlay')
      expect(overlays).toHaveLength(0)
    })

    BddTest().then('it should not render checkboxes', () => {
      const checkboxes = wrapper.findAllComponents({ name: 'AvCheckbox' })
      expect(checkboxes).toHaveLength(0)
    })
  })
})
