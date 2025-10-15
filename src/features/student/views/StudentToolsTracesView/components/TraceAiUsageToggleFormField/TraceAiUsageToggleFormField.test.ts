import type { CreateTraceForm } from '@/features/student/types'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import TraceAiUsageToggleFormField from './TraceAiUsageToggleFormField.vue'

const TestWrapper = {
  components: {
    TraceAiUsageToggleFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        useIA: false
      },
      validators: {
        onSubmit () {
          return {
            fields: {
              useIA: undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceAiUsageToggleFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace AI usage toggle form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceAiUsageToggle: {
      name: 'TraceAiUsageToggle',
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
    BddTest().then('it should render the AI usage toggle', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      expect(toggle.props('id')).toBe('useIA')
    })

    BddTest().then('it should have the correct name', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      expect(toggle.props('name')).toBe('useIA')
    })

    BddTest().then('it should have false initial value', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the user toggles the checkbox', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
        expect(updatedToggle.props('modelValue')).toBe(true)
      })
    })

    BddTest().then('it should emit change event', async () => {
      const formField = wrapper.findComponent({ name: 'TraceAiUsageToggleFormField' })
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const emitted = formField.emitted('change')
        expect(emitted).toBeTruthy()
        expect(emitted?.[0]).toEqual([true])
      })
    })
  })

  BddTest().when('the toggle is changed to false', () => {
    BddTest().then('it should emit change event with false', async () => {
      const formField = wrapper.findComponent({ name: 'TraceAiUsageToggleFormField' })
      const toggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await checkbox.setValue(false)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const emitted = formField.emitted('change')
        expect(emitted).toBeTruthy()
        expect(emitted?.[emitted.length - 1]).toEqual([false])
      })
    })
  })
})
