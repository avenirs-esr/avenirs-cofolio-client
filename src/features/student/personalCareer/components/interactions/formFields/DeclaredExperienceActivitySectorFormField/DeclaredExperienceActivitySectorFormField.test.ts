import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceActivitySectorFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.vue'
import { DeclaredExperienceActivitySectorInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'activitySector'>({
  formFieldComponent: DeclaredExperienceActivitySectorFormField,
  fieldName: 'activitySector',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateActivitySector
})

BddTest().given('a declared experience activity sector form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceActivitySectorInput: DeclaredExperienceActivitySectorInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the activity sector input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters an activity sector', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
        const textInput = input.find('input')
        await textInput.setValue('Technology')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
          expect(updated.props('modelValue')).toBe('Technology')
        })
      })
    })

    BddTest().and('the user enters an activity sector exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
        const textInput = input.find('input')
        const longSector = 'a'.repeat(DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH + 10)
        await textInput.setValue(longSector)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty activity sector', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid activity sector', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
        const textInput = input.find('input')
        await textInput.setValue('Healthcare')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceActivitySectorInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
