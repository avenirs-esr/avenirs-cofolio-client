import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceExternalLinkFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.vue'
import { DeclaredExperienceExternalLinkInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceExternalLinkInput/DeclaredExperienceExternalLinkInput.stub'
import { DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'externalLink'>({
  formFieldComponent: DeclaredExperienceExternalLinkFormField,
  fieldName: 'externalLink',
  defaultValue: '',
  useValidator: () => () => undefined
})

BddTest().given('a declared experience external link form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceExternalLinkInput: DeclaredExperienceExternalLinkInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the external link input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a external link', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
        const textInput = input.find('input')
        await textInput.setValue('https://example.com/experience')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
          expect(updated.props('modelValue')).toBe('https://example.com/experience')
        })
      })
    })

    BddTest().and('the user enters an external link exceeding max length', () => {
      BddTest().then('it should keep the user value in the field state', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
        const textInput = input.find('input')
        const longExternalLink = `https://example.com/${'a'.repeat(DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH)}`
        await textInput.setValue(longExternalLink)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
          expect(updated.props('modelValue')).toBe(longExternalLink)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty external link', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid external link', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
        const textInput = input.find('input')
        await textInput.setValue('https://example.com')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceExternalLinkInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
