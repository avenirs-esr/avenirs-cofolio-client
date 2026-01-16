import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramDescriptionFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.vue'
import { DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramDescriptionTextareaStub = defineComponent({
  name: 'DeclaredProgramDescriptionTextarea',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-description-textarea-stub">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
      <slot name="maxLengthCaption" />
    </div>
  `
})

const TestWrapper = defineComponent({
  components: {
    DeclaredProgramDescriptionFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        description: ''
      } as DeclaredProgramFormData,
      validators: {
        onSubmit ({ value }) {
          if (!value.description || value.description.trim() === '') {
            return {
              fields: {
                description: 'La description est requise'
              }
            }
          }
          return { fields: { description: undefined } }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramDescriptionFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program description form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredProgramDescriptionTextarea: DeclaredProgramDescriptionTextareaStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the description textarea component', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
      expect(textarea.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a description', () => {
      BddTest().then('it should update the form field value', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
        const textareaElement = textarea.find('textarea')
        await textareaElement.setValue('This is my program description')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
          expect(updated.props('modelValue')).toBe('This is my program description')
        })
      })
    })

    BddTest().and('the user enters a description exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
        const textareaElement = textarea.find('textarea')
        const longDescription = 'a'.repeat(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH + 20)
        await textareaElement.setValue(longDescription)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the textarea emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
        await textarea.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(textarea.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty description', () => {
      BddTest().then('it should show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
          expect(textarea.props('errorMessage')).toBe('La description est requise')
        })
      })
    })

    BddTest().and('the form is submitted with valid description', () => {
      BddTest().then('it should not show validation error', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
        const textareaElement = textarea.find('textarea')
        await textareaElement.setValue('Valid program description with enough content')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramDescriptionTextarea' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
