import type { TraceFilter } from '@/features/student/types'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import StudentTraceFilters from './StudentTraceFilters.vue'

const AvInputStub = {
  name: 'AvInput',
  template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  props: ['modelValue', 'label', 'placeholder']
}

const AvButtonStub = {
  name: 'AvButton',
  template: '<button @click="onClick">{{ label }}</button>',
  props: ['label', 'variant', 'onClick', 'leadingIcon']
}

const stubs = {
  AvInput: AvInputStub,
  AvButton: AvButtonStub
}

BddTest().given('a student trace filters component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceFilters>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentTraceFilters, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the search input', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.exists()).toBe(true)
      expect(input.props('label')).toBe('Rechercher une trace')
    })

    BddTest().then('it should render the reset button', () => {
      const button = wrapper.findComponent({ name: 'AvButton' })

      expect(button.exists()).toBe(true)
      expect(button.props('label')).toBe('Réinitialiser les filtres')
      expect(button.props('variant')).toBe('OUTLINED')
    })

    BddTest().then('it should initialize with empty keyword', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the component is mounted with initial search criteria', () => {
    beforeEach(() => {
      const initialTraceFilter: TraceFilter = {
        keyword: 'test keyword'
      }

      wrapper = mount(StudentTraceFilters, {
        props: {
          initialTraceFilter
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should initialize with the provided keyword', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('modelValue')).toBe('test keyword')
    })
  })

  BddTest().when('the user types in the search input', () => {
    beforeEach(async () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'new search term')
    })

    BddTest().then('it should emit changeTraceFilter event with the keyword after debounce', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('changeTraceFilter')).toBeTruthy()
      }, { timeout: 1000 })

      expect(wrapper.emitted('changeTraceFilter')?.[0]).toEqual([
        { keyword: 'new search term' }
      ])
    })

    BddTest().then('it should update the keyword value immediately', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('modelValue')).toBe('new search term')
    })
  })

  BddTest().when('the component is mounted with custom search label', () => {
    beforeEach(() => {
      wrapper = mount(StudentTraceFilters, {
        props: {
          searchLabel: 'Custom Search Label'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should use the custom search label', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('label')).toBe('Custom Search Label')
    })
  })

  BddTest().when('the user clicks the reset button', () => {
    beforeEach(async () => {
      const input = wrapper.findComponent({ name: 'AvInput' })
      await input.vm.$emit('update:modelValue', 'some keyword')

      const button = wrapper.findComponent({ name: 'AvButton' })
      await button.props('onClick')?.()
    })

    BddTest().then('it should reset the keyword to empty string', () => {
      const input = wrapper.findComponent({ name: 'AvInput' })

      expect(input.props('modelValue')).toBe('')
    })

    BddTest().then('it should emit changeTraceFilter event with empty keyword', () => {
      const emitted = wrapper.emitted('changeTraceFilter')

      expect(emitted?.[emitted.length - 1]).toEqual([{ keyword: '' }])
    })
  })
})
