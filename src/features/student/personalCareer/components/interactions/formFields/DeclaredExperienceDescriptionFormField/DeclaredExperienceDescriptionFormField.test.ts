import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceDescriptionFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.vue'
import { DeclaredExperienceDescriptionTextareaStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'description'>({
  formFieldComponent: DeclaredExperienceDescriptionFormField,
  fieldName: 'description',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateDescription
})

BddTest().given('a declared experience description form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceDescriptionTextarea: DeclaredExperienceDescriptionTextareaStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the description textarea component', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
      expect(textarea.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a description', () => {
      BddTest().then('it should update the form field value', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
        const textInput = textarea.find('textarea')
        await textInput.setValue('A detailed description of my experience')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
          expect(updated.props('modelValue')).toBe('A detailed description of my experience')
        })
      })
    })

    BddTest().and('the user enters a description exceeding max length', () => {
      BddTest().then('it should keep the user value in the field state', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
        const textInput = textarea.find('textarea')
        const longDescription = 'a'.repeat(DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH + 10)
        await textInput.setValue(longDescription)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
          expect(updated.props('modelValue')).toBe(longDescription)
        })
      })
    })

    BddTest().and('the textarea emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
        await textarea.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(textarea.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty description', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
          expect(textarea.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid description', () => {
      BddTest().then('it should not show validation error', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
        const textInput = textarea.find('textarea')
        await textInput.setValue('Valid description of experience')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceDescriptionTextarea' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
