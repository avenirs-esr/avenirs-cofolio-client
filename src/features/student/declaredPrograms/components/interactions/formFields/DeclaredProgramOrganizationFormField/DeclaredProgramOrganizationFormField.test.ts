import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramOrganizationFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.vue'
import { DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramInstitutionInputStub = defineComponent({
  name: 'DeclaredProgramOrganizationInput',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-organization-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})

const TestWrapper = defineComponent({
  components: {
    DeclaredProgramInstitutionFormField: DeclaredProgramOrganizationFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        organization: ''
      } as DeclaredProgramFormData,
      validators: {
        onSubmit ({ value }) {
          if (!value.organization || value.organization.trim() === '') {
            return {
              fields: {
                organization: 'L\'établissement est requis'
              }
            }
          }
          return { fields: { organization: undefined } }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramInstitutionFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program institution form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredProgramOrganizationInput: DeclaredProgramInstitutionInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the institution input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters an institution name', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
        const textInput = input.find('input')
        await textInput.setValue('University of Paris')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
          expect(updated.props('modelValue')).toBe('University of Paris')
        })
      })
    })

    BddTest().and('the user enters an institution name exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
        const textInput = input.find('input')
        const longInstitution = 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH + 10)
        await textInput.setValue(longInstitution)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty institution', () => {
      BddTest().then('it should show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
          expect(input.props('errorMessage')).toBe('L\'établissement est requis')
        })
      })
    })

    BddTest().and('the form is submitted with valid institution', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Valid University Name')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredProgramOrganizationInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
