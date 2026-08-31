import type { CreateTraceForm } from '@/features/traces'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import TraceLinkInputFormField from '@/features/traces/components/interactions/formFields/TraceLinkInputFormField/TraceLinkInputFormField.vue'
import { TraceLinkInputStub } from '@/features/traces/components/interactions/inputs/TraceLinkInput/TraceLinkInput.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TraceLinkInputFormField
  },
  setup () {
    const { validateLink } = useFormValidators()
    const form = useForm({
      defaultValues: {
        link: ''
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              link: validateLink(value.link)
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceLinkInputFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace link input form field component', () => {
  let wrapper: VueWrapper

  const stubs = { TraceLinkInput: TraceLinkInputStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the trace link input', () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      expect(input.props('id')).toBe('trace-link')
    })

    BddTest().then('it should have required attribute', () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')
      expect(inputElement.attributes('required')).toBeDefined()
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the user types in the input', () => {
    BddTest().then('it should update the form field value', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('My trace name')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceLinkInput' })
        expect(updatedInput.props('modelValue')).toBe('My trace name')
      })
    })
  })

  BddTest().when('the user blurs the input', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with empty value', () => {
    BddTest().then('it should not show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'TraceLinkInput' })
        expect(input.props('errorMessage')).toBeFalsy()
      })
    })

    BddTest().then('it should display error message in the DOM', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('.error')
        expect(errorElement.exists()).toBe(false)
      })
    })
  })

  BddTest().when('the user enters only whitespace', () => {
    BddTest().then('it should show validation error on submit', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('   ')
      await inputElement.trigger('blur')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceLinkInput' })
        expect(updatedInput.props('errorMessage')).toBeTruthy()
      })
    })
  })

  BddTest().when('the user enters an empty URL', () => {
    BddTest().then('it should not show validation error', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('')
      await inputElement.trigger('blur')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceLinkInput' })
        expect(updatedInput.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().when('the user types a non-string value', () => {
    BddTest().then('it should not update the form field value', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })

      await input.vm.$emit('update:modelValue', 123)
      await wrapper.vm.$nextTick()

      const updatedInput = wrapper.findComponent({ name: 'TraceLinkInput' })
      expect(updatedInput.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the user enters an invalid URL', () => {
    BddTest().then('it should show validation error', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('pas-une-url')
      await inputElement.trigger('blur')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceLinkInput' })
        expect(updatedInput.props('errorMessage')).toBeTruthy()
      })
    })
  })

  BddTest().when('the user enters a valid URL', () => {
    BddTest().then('it should not show validation error', async () => {
      const input = wrapper.findComponent({ name: 'TraceLinkInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('https://www.google.com')
      await inputElement.trigger('blur')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceLinkInput' })
        expect(updatedInput.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
