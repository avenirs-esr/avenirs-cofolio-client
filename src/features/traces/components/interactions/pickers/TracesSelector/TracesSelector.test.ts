import type { TraceViewDTO } from '@/api/avenir-esr'
import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import { ETraceAuthorType } from '@/api/avenir-esr'
import { SelectorOverlayStub } from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.stub'
import {
  StudentTraceCardStub
} from '@/features/traces/components/cards/StudentTraceCard/StudentTraceCard.stub'
import TracesSelector from '@/features/traces/components/interactions/pickers/TracesSelector/TracesSelector.vue'
import {
  StudentTraceViewCompactCardStub
} from '@/features/traces/views/StudentToolsTracesView/components/StudentTraceViewCompactCard/StudentTraceViewCompactCard.stub'
import { AvCheckboxStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvCheckbox: AvCheckboxStub,
  StudentTraceCard: StudentTraceCardStub,
  StudentTraceViewCompactCard: StudentTraceViewCompactCardStub,
  SelectorOverlay: SelectorOverlayStub
}

BddTest().given('a traces selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof TracesSelector>>

  const traceViewDTOs: TraceViewDTO[] = [
    {
      id: 'trace-view-1',
      title: 'Trace view 1',
      isAssociated: false,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z',
      authorType: ETraceAuthorType.PERSONAL
    },
    {
      id: 'trace-view-2',
      title: 'Trace view 2',
      isAssociated: true,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z',
      willBeDeletedAt: '2026-06-16T10:00:00.000Z',
      authorType: ETraceAuthorType.PERSONAL
    }
  ]

  function getLastEmittedModelValue (): string[] {
    const modelValueEvents = wrapper.emitted('update:modelValue')
    expect(modelValueEvents).toBeDefined()
    expect(modelValueEvents!.length).toBeGreaterThan(0)
    return modelValueEvents![modelValueEvents!.length - 1][0] as string[]
  }

  function mountComponent (props = {}) {
    wrapper = mount(TracesSelector, {
      props: {
        traces: [...mockedTraceOverview],
        ...props
      },
      global: {
        stubs
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mountComponent()
  })

  BddTest().when('the component is mounted with trace overview DTOs', () => {
    BddTest().then('it should render all trace cards', () => {
      const traceCards = wrapper.findAllComponents(StudentTraceCardStub)

      expect(traceCards).toHaveLength(3)
    })

    BddTest().then('it should not render compact trace cards', () => {
      const compactCards = wrapper.findAllComponents(StudentTraceViewCompactCardStub)

      expect(compactCards).toHaveLength(0)
    })

    BddTest().then('it should provide selectable traces to selector overlay', () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      expect(selectorOverlay.props('selectableElements')).toEqual(
        mockedTraceOverview.map(trace => ({
          label: trace.title,
          value: trace.id,
          baseElement: trace
        }))
      )
    })
  })

  BddTest().when('a trace is selected', () => {
    beforeEach(async () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      await selectorOverlay.vm.$emit('update:selectedElements', [mockedTraceOverview[0].id])
    })

    BddTest().then('it should emit update:modelValue event with selected trace IDs', () => {
      const lastEmit = getLastEmittedModelValue()

      expect(lastEmit).toEqual([mockedTraceOverview[0].id])
    })
  })

  BddTest().when('multiple traces are selected', () => {
    beforeEach(async () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      await selectorOverlay.vm.$emit('update:selectedElements', [
        mockedTraceOverview[0].id,
        mockedTraceOverview[1].id
      ])
    })

    BddTest().then('it should emit update:modelValue event with all selected trace IDs', () => {
      const lastEmit = getLastEmittedModelValue()

      expect(lastEmit).toEqual([
        mockedTraceOverview[0].id,
        mockedTraceOverview[1].id
      ])
    })
  })

  BddTest().when('a trace is unselected', () => {
    beforeEach(async () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      await selectorOverlay.vm.$emit('update:selectedElements', [mockedTraceOverview[1].id])
    })

    BddTest().then('it should emit update:modelValue event with remaining selected trace ID', () => {
      const lastEmit = getLastEmittedModelValue()

      expect(lastEmit).toEqual([mockedTraceOverview[1].id])
    })
  })

  BddTest().when('the component is mounted with trace view DTOs', () => {
    beforeEach(() => {
      mountComponent({
        traces: traceViewDTOs
      })
    })

    BddTest().then('it should render compact trace cards', () => {
      const compactCards = wrapper.findAllComponents(StudentTraceViewCompactCardStub)

      expect(compactCards).toHaveLength(2)
    })

    BddTest().then('it should not render overview trace cards', () => {
      const traceCards = wrapper.findAllComponents(StudentTraceCardStub)

      expect(traceCards).toHaveLength(0)
    })

    BddTest().then('it should disable non deletable trace view DTOs', () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      expect(selectorOverlay.props('selectableElements')).toEqual([
        {
          label: 'Trace view 1',
          value: 'trace-view-1',
          baseElement: traceViewDTOs[0]
        },
        {
          label: 'Trace view 2',
          value: 'trace-view-2',
          baseElement: traceViewDTOs[1]
        }
      ])
    })
  })

  BddTest().when('no traces are provided', () => {
    beforeEach(() => {
      mountComponent({
        traces: []
      })
    })

    BddTest().then('it should not render any trace cards', () => {
      const traceCards = wrapper.findAllComponents(StudentTraceCardStub)
      const compactCards = wrapper.findAllComponents(StudentTraceViewCompactCardStub)

      expect(traceCards).toHaveLength(0)
      expect(compactCards).toHaveLength(0)
    })

    BddTest().then('it should provide empty selectable elements to selector overlay', () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      expect(selectorOverlay.props('selectableElements')).toEqual([])
    })
  })

  BddTest().when('the component is in readonly mode', () => {
    beforeEach(() => {
      mountComponent({
        readonly: true
      })
    })

    BddTest().then('it should pass readonly to selector overlay', () => {
      const selectorOverlay = wrapper.findComponent(SelectorOverlayStub)

      expect(selectorOverlay.props('readonly')).toBe(true)
    })

    BddTest().then('it should still render trace cards', () => {
      const traceCards = wrapper.findAllComponents(StudentTraceCardStub)

      expect(traceCards).toHaveLength(3)
    })
  })
})
