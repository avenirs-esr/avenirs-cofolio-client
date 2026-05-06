import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceOrganizationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import { DeclaredExperienceOrganizationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'organization'>({
  formFieldComponent: DeclaredExperienceOrganizationFormField,
  fieldName: 'organization',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateOrganization
})

BddTest().given('a declared experience organization form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceOrganizationInput: DeclaredExperienceOrganizationInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the organization input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters an organization', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
        const textInput = input.find('input')
        await textInput.setValue('My Organization')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
          expect(updated.props('modelValue')).toBe('My Organization')
        })
      })
    })

    BddTest().and('the user enters an organization exceeding max length', () => {
      BddTest().then('it should keep the user value in the field state', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
        const textInput = input.find('input')
        const longOrganization = 'a'.repeat(300)
        await textInput.setValue(longOrganization)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
          expect(updated.props('modelValue')).toBe(longOrganization)
        })
      })
    })

    BddTest().and('the input emits maxlength exceeded state', () => {
      BddTest().then('it should forward maxlengthExceeded to parent', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
        const formField = wrapper.findComponent(DeclaredExperienceOrganizationFormField)
        await input.vm.$emit('maxlengthExceeded', true)
        await wrapper.vm.$nextTick()

        const events = formField.emitted('maxlengthExceeded')
        expect(events).toBeTruthy()
        expect(events?.at(-1)?.[0]).toBe(true)
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty organization', () => {
      BddTest().then('it should show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
          expect(input.props('errorMessage')).toBe('Ce champ est requis.')
        })
      })
    })

    BddTest().and('the form is submitted with valid organization', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Valid Organization')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
