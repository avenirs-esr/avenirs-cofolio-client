import type { CreateTraceForm } from '@/features/student/types'
import TraceNameInputFormField
  from '@/features/student/views/StudentToolsTracesView/components/TraceNameInputFormField/TraceNameInputFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    TraceNameInputFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        traceName: ''
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              traceName: !value.traceName || !value.traceName.trim()
                ? 'Ce champ est requis'
                : undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceNameInputFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace name input form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceNameInput: {
      name: 'TraceNameInput',
      props: ['id', 'modelValue', 'errorMessage', 'required'],
      emits: ['blur', 'update:modelValue'],
      template: '<div><input type="text" :id="id" :value="modelValue" :required="required" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" /><span v-if="errorMessage" class="error">{{ errorMessage }}</span></div>'
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
    BddTest().then('it should render the trace name input', () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      expect(input.props('id')).toBe('trace-name')
    })

    BddTest().then('it should have required attribute', () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      const inputElement = input.find('input[type="text"]')
      expect(inputElement.attributes('required')).toBeDefined()
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the user types in the input', () => {
    BddTest().then('it should update the form field value', async () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('My trace name')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceNameInput' })
        expect(updatedInput.props('modelValue')).toBe('My trace name')
      })
    })
  })

  BddTest().when('the user blurs the input', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with empty value', () => {
    BddTest().then('it should show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'TraceNameInput' })
        expect(input.props('errorMessage')).toBe('Ce champ est requis')
      })
    })

    BddTest().then('it should display error message in the DOM', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('.error')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe('Ce champ est requis')
      })
    })
  })

  BddTest().when('the form is submitted with valid value', () => {
    BddTest().then('it should not show validation error', async () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('Valid trace name')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceNameInput' })
        expect(updatedInput.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().when('the user enters only whitespace', () => {
    BddTest().then('it should show validation error on submit', async () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })
      const inputElement = input.find('input[type="text"]')

      await inputElement.setValue('   ')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceNameInput' })
        expect(updatedInput.props('errorMessage')).toBe('Ce champ est requis')
      })
    })
  })

  BddTest().when('the user types a non-string value', () => {
    BddTest().then('it should not update the form field value', async () => {
      const input = wrapper.findComponent({ name: 'TraceNameInput' })

      await input.vm.$emit('update:modelValue', 123)
      await wrapper.vm.$nextTick()

      const updatedInput = wrapper.findComponent({ name: 'TraceNameInput' })
      expect(updatedInput.props('modelValue')).toBe('')
    })
  })
})
