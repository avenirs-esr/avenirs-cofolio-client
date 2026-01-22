import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceSourceOfInformationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.vue'
import { DeclaredExperienceSourceOfInformationInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.stub'
import { DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperienceSourceOfInformationFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        sourceOfInformation: ''
      } as DeclaredExperienceFormData,
      validators: {
        onSubmit () {
          return { fields: { sourceOfInformation: undefined } }
        }
      }
    }) as unknown as AddDeclaredExperienceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredExperienceSourceOfInformationFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared experience source of information form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceSourceOfInformationInput: DeclaredExperienceSourceOfInformationInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the source of information input component', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a source of information', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
        const textInput = input.find('input')
        await textInput.setValue('LinkedIn profile')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
          expect(updated.props('modelValue')).toBe('LinkedIn profile')
        })
      })
    })

    BddTest().and('the user enters a source exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
        const textInput = input.find('input')
        const longSource = 'a'.repeat(DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH + 10)
        await textInput.setValue(longSource)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty source', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid source', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
        const textInput = input.find('input')
        await textInput.setValue('Company website')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceSourceOfInformationInput' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
