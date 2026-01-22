import type { CreateTraceForm } from '@/features/student/traces'
import TraceAuthenticDeclarationToggleFormField from '@/features/student/traces/components/interactions/formFields/TraceAuthenticDeclarationToggleFormField/TraceAuthenticDeclarationToggleFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TraceAuthenticDeclarationToggleFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        isAuthentic: false
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              isAuthentic: !value.isAuthentic ? 'Required field' : undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceAuthenticDeclarationToggleFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace authentic declaration toggle form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceAuthenticDeclarationToggle: {
      name: 'TraceAuthenticDeclarationToggle',
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
    BddTest().then('it should render the authentic declaration toggle', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      expect(toggle.props('id')).toBe('is-authentic')
    })

    BddTest().then('it should have the correct name', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      expect(toggle.props('name')).toBe('isAuthentic')
    })

    BddTest().then('it should have false initial value', () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the user toggles the checkbox', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
        expect(updatedToggle.props('modelValue')).toBe(true)
      })
    })
  })

  BddTest().when('the toggle is changed to false', () => {
    BddTest().then('it should update the form field value to false', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await checkbox.setValue(false)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
        expect(updatedToggle.props('modelValue')).toBe(false)
      })
    })
  })

  BddTest().when('the form is submitted with empty value', () => {
    BddTest().then('it should show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('[data-testid="trace-form__authentic-error"]')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe('Required field')
      })
    })
  })

  BddTest().when('the form is submitted with valid value', () => {
    BddTest().then('it should not show validation error', async () => {
      const toggle = wrapper.findComponent({ name: 'TraceAuthenticDeclarationToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('[data-testid="trace-form__authentic-error"]')
        expect(errorElement.exists()).toBe(false)
      })
    })
  })
})
