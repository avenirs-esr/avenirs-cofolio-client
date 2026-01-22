import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceLinkFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLinkFormField/DeclaredExperienceLinkFormField.vue'
import { DeclaredExperienceLinkInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLinkInput/DeclaredExperienceLinkInput.stub'
import { DECLARED_EXPERIENCE_LINK_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'link'>({
  formFieldComponent: DeclaredExperienceLinkFormField,
  fieldName: 'link',
  defaultValue: '',
  useValidator: () => () => undefined
})

BddTest().given('a declared experience link form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceLinkInput: DeclaredExperienceLinkInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the link input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a link', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
        const textInput = input.find('input')
        await textInput.setValue('https://example.com/experience')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
          expect(updated.props('modelValue')).toBe('https://example.com/experience')
        })
      })
    })

    BddTest().and('the user enters a link exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
        const textInput = input.find('input')
        const longLink = `https://example.com/${'a'.repeat(DECLARED_EXPERIENCE_LINK_MAX_LENGTH)}`
        await textInput.setValue(longLink)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_EXPERIENCE_LINK_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty link', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid link', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
        const textInput = input.find('input')
        await textInput.setValue('https://example.com')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceLinkInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
