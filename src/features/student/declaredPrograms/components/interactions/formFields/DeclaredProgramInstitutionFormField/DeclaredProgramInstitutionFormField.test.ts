import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramInstitutionFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramInstitutionFormField/DeclaredProgramInstitutionFormField.vue'
import { DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH } from '@/features/student/declaredPrograms/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramInstitutionInputStub = defineComponent({
  name: 'DeclaredProgramInstitutionInput',
  props: {
    modelValue: String,
    errorMessage: String
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-program-institution-input-stub">
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
    DeclaredProgramInstitutionFormField
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
    DeclaredProgramInstitutionInput: DeclaredProgramInstitutionInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the institution input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().and('the user enters an institution name', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      const textInput = input.find('input')
      await textInput.setValue('University of Paris')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
        expect(updated.props('modelValue')).toBe('University of Paris')
      })
    })
  })

  BddTest().and('the user enters an institution name exceeding max length', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      const textInput = input.find('input')
      const longInstitution = 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH + 10)
      await textInput.setValue(longInstitution)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should truncate the value to max length', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
        expect(updated.props('modelValue')).toHaveLength(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH)
      })
    })
  })

  BddTest().and('the input emits blur', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      await input.vm.$emit('blur')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should trigger blur handler', () => {
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().and('the form is submitted with empty institution', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show validation error', async () => {
      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
        expect(input.props('errorMessage')).toBe('L\'établissement est requis')
      })
    })
  })

  BddTest().and('the form is submitted with valid institution', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
      const textInput = input.find('input')
      await textInput.setValue('Valid University Name')
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'DeclaredProgramInstitutionInput' })
        expect(updated.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
