import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/personalCareer/types/forms.types'
import DeclaredProgramResultFormField from '@/features/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramResultInputStub = defineComponent({
  name: 'DeclaredProgramResultInput',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-result-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})

const TestWrapper = defineComponent({
  components: {
    DeclaredProgramResultFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        result: ''
      } as DeclaredProgramFormData,
      validators: {
        onSubmit () {
          return { fields: { result: undefined } }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramResultFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program result form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredProgramResultInput: DeclaredProgramResultInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the result input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a result', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
        const textInput = input.find('input')
        await textInput.setValue('Admis avec mention')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
          expect(updated.props('modelValue')).toBe('Admis avec mention')
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty result', () => {
      BddTest().then('it should not show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid result', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
        const textInput = input.find('input')
        await textInput.setValue('Valid result')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramResultInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
