import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TracesSelectorStub = {
  name: 'TracesSelector',
  props: ['traces', 'readonly'],
  template: '<div class="traces-selector-stub" />'
}

const stubs = {
  TracesSelector: TracesSelectorStub
}

BddTest().given('a student declared skill associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeclaredSkillAssociations>>
  const traces = mockedTraceOverview

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is rendered with a list of traces', () => {
    beforeEach(() => {
      wrapper = mount(StudentDeclaredSkillAssociations, {
        props: { traceAssociations: traces },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should display the localized associated traces count', () => {
      const label = wrapper.find('.associated-trace-count')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Mes traces associées (3)')
    })

    BddTest().then('it should render TracesSelector component', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      expect(tracesSelector.exists()).toBe(true)
    })

    BddTest().then('it should pass traces prop to TracesSelector', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      expect(tracesSelector.props('traces')).toEqual(traces)
    })

    BddTest().then('it should render TracesSelector in readonly mode', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      const readonlyProp = tracesSelector.props('readonly')
      expect(readonlyProp !== undefined && readonlyProp !== false).toBe(true)
    })
  })

  BddTest().when('the component is rendered with an empty list', () => {
    beforeEach(() => {
      wrapper = mount(StudentDeclaredSkillAssociations, {
        props: { traceAssociations: [] },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should display a count of 0', () => {
      const label = wrapper.find('.associated-trace-count')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Mes traces associées (0)')
    })

    BddTest().then('it should render TracesSelector with empty traces array', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      expect(tracesSelector.exists()).toBe(true)
      expect(tracesSelector.props('traces')).toEqual([])
    })
  })
})
