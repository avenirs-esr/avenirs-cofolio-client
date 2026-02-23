import type { EExperienceType } from '@/api/avenir-esr'
import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceTypeFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { DeclaredExperienceTypeSelectStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.stub'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddDeclaredExperienceForm, DeclaredExperienceFormData, 'type'>({
  formFieldComponent: DeclaredExperienceTypeFormField,
  fieldName: 'type',
  defaultValue: '',
  useValidator: () => useDeclaredExperienceFormValidators().validateType
})

BddTest().given('a declared experience type form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceTypeSelect: DeclaredExperienceTypeSelectStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the type select component', () => {
      const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
      expect(select.props('modelValue')).toEqual({ itemId: '' })
    })

    BddTest().and('the user selects a type', () => {
      BddTest().then('it should update the form field value', async () => {
        const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
        await select.vm.$emit('update:modelValue', { itemId: 'PROFESSIONAL' as EExperienceType })
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
          expect(updated.props('modelValue')).toEqual({ itemId: 'PROFESSIONAL' })
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
        await select.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(select.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty type', () => {
      BddTest().then('it should show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
          expect(select.props('errorMessage')).toBe('Ce champ est requis.')
        })
      })
    })

    BddTest().and('the form is submitted with valid type', () => {
      BddTest().then('it should not show validation error', async () => {
        const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
        await select.vm.$emit('update:modelValue', 'ASSOCIATIVE' as EExperienceType)
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
