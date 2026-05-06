import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceSummaryFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.vue'
import { DeclaredExperienceSummaryTextareaStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'summary'>({
  formFieldComponent: DeclaredExperienceSummaryFormField,
  fieldName: 'summary',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateSummary
})

BddTest().given('a declared experience summary form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceSummaryTextarea: DeclaredExperienceSummaryTextareaStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the summary textarea component', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
      expect(textarea.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a summary', () => {
      BddTest().then('it should update the form field value', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
        const textInput = textarea.find('textarea')
        await textInput.setValue('A positive summary of my experience')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
          expect(updated.props('modelValue')).toBe('A positive summary of my experience')
        })
      })
    })

    BddTest().and('the user enters a summary exceeding max length', () => {
      BddTest().then('it should keep the user value in the field state', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
        const textInput = textarea.find('textarea')
        const longSummary = 'a'.repeat(500)
        await textInput.setValue(longSummary)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
          expect(updated.props('modelValue')).toBe(longSummary)
        })
      })
    })

    BddTest().and('the textarea emits maxlength exceeded state', () => {
      BddTest().then('it should forward maxlengthExceeded to parent', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
        const formField = wrapper.findComponent(DeclaredExperienceSummaryFormField)
        await textarea.vm.$emit('maxlengthExceeded', true)
        await wrapper.vm.$nextTick()

        const events = formField.emitted('maxlengthExceeded')
        expect(events).toBeTruthy()
        expect(events?.at(-1)?.[0]).toBe(true)
      })
    })

    BddTest().and('the textarea emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
        await textarea.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(textarea.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty summary', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
          expect(textarea.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid summary', () => {
      BddTest().then('it should not show validation error', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
        const textInput = textarea.find('textarea')
        await textInput.setValue('Valid summary of the experience')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceSummaryTextarea' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
