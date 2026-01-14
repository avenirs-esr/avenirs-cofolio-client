import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import UpdateDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillAssociations/UpdateDeclaredSkillAssociations.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TracesSelectorStub = {
  name: 'TracesSelector',
  props: ['traces', 'modelValue'],
  emits: ['update:modelValue'],
  template: '<div class="traces-selector-stub" />'
}

const AvCardStub = {
  name: 'AvCard',
  props: ['borderColor'],
  template: '<div class="av-card-stub"><slot name="body" /></div>'
}

const stubs = {
  TracesSelector: TracesSelectorStub,
  AvCard: AvCardStub,
  AvButton: AvButtonStub
}

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    }))
  }
})

BddTest().given('an update declared skill associations component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof UpdateDeclaredSkillAssociations>>
  const traces = mockedTraceOverview
  const declaredSkillId = 'skill-1'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is rendered with a list of traces', () => {
    beforeEach(() => {
      wrapper = mountComponent(UpdateDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          traceAssociations: traces
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should display the localized associated traces count', () => {
      const header = wrapper.find('[data-testid="update-declared-skill-associations__header"]')
      expect(header.exists()).toBe(true)
      expect(header.text()).toBe('Mes traces associées (3)')
    })

    BddTest().then('it should render TracesSelector component', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      expect(tracesSelector.exists()).toBe(true)
    })

    BddTest().then('it should pass traces prop to TracesSelector', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      expect(tracesSelector.props('traces')).toEqual(traces)
    })

    BddTest().then('it should render the remove button', () => {
      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const removeButton = buttons.find(btn => btn.attributes('data-testid') === 'delete-trace-button')
      expect(removeButton).toBeDefined()
      expect(removeButton?.props('variant')).toBe('OUTLINED')
    })

    BddTest().then('it should render the add trace button', () => {
      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const addButton = buttons.find(btn => btn.attributes('data-testid') === 'add-trace-button')
      expect(addButton).toBeDefined()
    })
  })

  BddTest().when('the component is rendered with an empty list', () => {
    beforeEach(() => {
      wrapper = mountComponent(UpdateDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          traceAssociations: []
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should display a count of 0', () => {
      const header = wrapper.find('[data-testid="update-declared-skill-associations__header"]')
      expect(header.exists()).toBe(true)
      expect(header.text()).toBe('Mes traces associées (0)')
    })

    BddTest().then('it should not render TracesSelector when no traces', () => {
      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      expect(tracesSelector.exists()).toBe(false)
    })
  })

  BddTest().when('the remove button is disabled', () => {
    beforeEach(() => {
      wrapper = mountComponent(UpdateDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          traceAssociations: traces
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should be disabled when no traces are selected', () => {
      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const removeButton = buttons.find(btn => btn.attributes('data-testid') === 'delete-trace-button')
      expect(removeButton?.props('disabled')).toBe(true)
    })
  })

  BddTest().when('the TracesSelector emits modelValue update', () => {
    beforeEach(async () => {
      wrapper = mountComponent(UpdateDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          traceAssociations: traces
        },
        global: {
          stubs
        }
      })

      const tracesSelector = wrapper.findComponent({ name: 'TracesSelector' })
      await tracesSelector.vm.$emit('update:modelValue', ['trace-1', 'trace-2'])
      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const removeButton = buttons.find(btn => btn.attributes('data-testid') === 'delete-trace-button')
      await removeButton?.trigger('click')
    })

    BddTest().then('it should display success message when removal succeeds', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith('2 associations supprimées avec succès')
      })
    })

    BddTest().then('it should enable the remove button when traces are selected', async () => {
      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const removeButton = buttons.find(btn => btn.attributes('data-testid') === 'delete-trace-button')

      await vi.waitFor(() => {
        expect(removeButton?.props('disabled')).toBe(true)
      })
    })
  })

  BddTest().when('the remove button is clicked without selected traces', () => {
    beforeEach(async () => {
      wrapper = mountComponent(UpdateDeclaredSkillAssociations, {
        props: {
          declaredSkillId,
          traceAssociations: traces
        },
        global: {
          stubs
        }
      })

      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const removeButton = buttons.find(btn => btn.attributes('data-testid') === 'delete-trace-button')
      await removeButton?.trigger('click')
    })

    BddTest().then('it should not display any message', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })
})
