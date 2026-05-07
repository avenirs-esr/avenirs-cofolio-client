import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceTitleFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.vue'
import { DeclaredExperienceTitleInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTitleInput/DeclaredExperienceTitleInput.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { DECLARED_EXPERIENCE_TITLE_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'title'>({
  formFieldComponent: DeclaredExperienceTitleFormField,
  fieldName: 'title',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateTitle
})

BddTest().given('a declared experience title form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceTitleInput: DeclaredExperienceTitleInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the title input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a title', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
        const textInput = input.find('input')
        await textInput.setValue('My Experience Title')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
          expect(updated.props('modelValue')).toBe('My Experience Title')
        })
      })
    })

    BddTest().and('the user enters a title exceeding max length', () => {
      BddTest().then('it should keep the user value in the field state', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
        const textInput = input.find('input')
        const longTitle = 'a'.repeat(DECLARED_EXPERIENCE_TITLE_MAX_LENGTH + 10)
        await textInput.setValue(longTitle)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
          expect(updated.props('modelValue')).toBe(longTitle)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty title', () => {
      BddTest().then('it should show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
          expect(input.props('errorMessage')).toBe('Ce champ est requis.')
        })
      })
    })

    BddTest().and('the form is submitted with valid title', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
        const textInput = input.find('input')
        await textInput.setValue('Valid Experience Title')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceTitleInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
