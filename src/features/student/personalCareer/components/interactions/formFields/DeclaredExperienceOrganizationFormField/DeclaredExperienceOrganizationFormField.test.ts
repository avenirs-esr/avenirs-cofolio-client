import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceOrganizationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import { DeclaredExperienceOrganizationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.stub'
import { DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperienceOrganizationFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        organization: ''
      } as DeclaredExperienceFormData,
      validators: {
        onSubmit ({ value }) {
          if (!value.organization || value.organization.trim() === '') {
            return {
              fields: {
                organization: 'L\'organisation est requise'
              }
            }
          }
          return { fields: { organization: undefined } }
        }
      }
    }) as unknown as AddDeclaredExperienceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredExperienceOrganizationFormField :form="form" />
    </form>
  `
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
      BddTest().then('it should truncate the value to max length', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
        const textInput = input.find('input')
        const longOrganization = 'a'.repeat(DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH + 10)
        await textInput.setValue(longOrganization)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceOrganizationInput' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH)
        })
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
          expect(input.props('errorMessage')).toBe('L\'organisation est requise')
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
