import type { UpdateTraceForm } from '@/features/student/traces'
import TraceValorizationToggleFormField from '@/features/student/traces/components/interactions/formFields/TraceValorizationToggleFormField/TraceValorizationToggleFormField.vue'
import { TraceValorizationToggleStub } from '@/features/student/traces/components/interactions/toggles/TraceValorizationToggle/TraceValorizationToggle.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TraceValorizationToggleFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        valorized: false
      },
      validators: {
        onSubmit () {
          return {
            fields: {
              valorized: undefined
            }
          }
        }
      }
    }) as unknown as UpdateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceValorizationToggleFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace valorization toggle form field component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          TraceValorizationToggle: TraceValorizationToggleStub
        }
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the trace valorization toggle', () => {
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
      expect(toggle.props('id')).toBe('trace-valorization')
    })

    BddTest().then('it should have the correct name', () => {
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
      expect(toggle.props('name')).toBe('valorized')
    })

    BddTest().then('it should have false initial value', () => {
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the user toggles the checkbox', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
        expect(updatedToggle.props('modelValue')).toBe(true)
      })
    })

    BddTest().then('it should emit change event', async () => {
      const formField = wrapper.findComponent({ name: 'TraceValorizationToggleFormField' })
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
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
      const formField = wrapper.findComponent({ name: 'TraceValorizationToggleFormField' })
      const toggle = wrapper.findComponent({ name: 'TraceValorizationToggle' })
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
