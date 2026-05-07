import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceLocationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.vue'
import { DeclaredExperienceLocationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'location'>({
  formFieldComponent: DeclaredExperienceLocationFormField,
  fieldName: 'location',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateLocation
})

BddTest().given('a declared experience location form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceLocationInput: DeclaredExperienceLocationInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the location input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a location', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Paris, France')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
          expect(updated.props('modelValue')).toBe('Paris, France')
        })
      })
    })

    BddTest().and('the user enters a location exceeding max length', () => {
      BddTest().then('it should keep the user value in the field state', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
        const textInput = input.find('input')
        const longLocation = 'a'.repeat(DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH + 10)
        await textInput.setValue(longLocation)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
          expect(updated.props('modelValue')).toBe(longLocation)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty location', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid location', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Lyon, France')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceLocationInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
