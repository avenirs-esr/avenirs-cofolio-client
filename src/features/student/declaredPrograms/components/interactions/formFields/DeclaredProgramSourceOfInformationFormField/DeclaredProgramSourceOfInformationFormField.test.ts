import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramSourceOfInformationFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.vue'
import { DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramSourceOfInformationInputStub = defineComponent({
  name: 'DeclaredProgramSourceOfInformationInput',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-source-of-information-input-stub">
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
    DeclaredProgramSourceOfInformationFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        sourceOfInformation: ''
      } as DeclaredProgramFormData,
      validators: {
        onSubmit () {
          return { fields: { sourceOfInformation: undefined } }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramSourceOfInformationFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program source of information form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredProgramSourceOfInformationInput: DeclaredProgramSourceOfInformationInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the source of information input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a source of information', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Information from university website')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
          expect(updated.props('modelValue')).toBe('Information from university website')
        })
      })
    })

    BddTest().and('the user enters a source of information exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
        const textInput = input.find('input')
        const longSource = 'a'.repeat(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH + 10)
        await textInput.setValue(longSource)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty source of information', () => {
      BddTest().then('it should not show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid source of information', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Valid source')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramSourceOfInformationInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
