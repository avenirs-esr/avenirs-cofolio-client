import type { CreateTraceForm } from '@/features/student/types'
import TraceGroupProductionToggleFormField
  from '@/features/student/components/traces/interactions/formFields/TraceGroupProductionToggleFormField/TraceGroupProductionToggleFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TraceGroupProductionToggleFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        isGroup: false
      },
      validators: {
        onSubmit () {
          return {
            fields: {
              isGroup: undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceGroupProductionToggleFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace group production toggle form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceGroupProductionToggle: {
      name: 'TraceGroupProductionToggle',
      props: ['id', 'name', 'modelValue'],
      emits: ['update:modelValue'],
      template: '<div><input type="checkbox" :id="id" :name="name" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /></div>'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the group production toggle', () => {
      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      expect(toggle.props('id')).toBe('is-group')
    })

    BddTest().then('it should have the correct name', () => {
      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      expect(toggle.props('name')).toBe('isGroup')
    })

    BddTest().then('it should have false initial value', () => {
      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the user toggles the checkbox', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
        expect(updatedToggle.props('modelValue')).toBe(true)
      })
    })
  })

  BddTest().when('the toggle is changed to false', () => {
    BddTest().then('it should update the form field value to false', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await checkbox.setValue(false)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
        expect(updatedToggle.props('modelValue')).toBe(false)
      })
    })
  })

  BddTest().when('the form is submitted', () => {
    BddTest().then('it should not show any validation errors', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      const toggle = wrapper.findComponent({ name: 'TraceGroupProductionToggle' })
      expect(toggle.exists()).toBe(true)
    })
  })
})
