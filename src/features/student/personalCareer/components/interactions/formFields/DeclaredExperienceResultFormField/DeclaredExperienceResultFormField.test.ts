import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceResultFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceResultFormField/DeclaredExperienceResultFormField.vue'
import { DeclaredExperienceResultInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceResultInput/DeclaredExperienceResultInput.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperienceResultFormField
  },

  setup () {
    const form = useForm({
      defaultValues: {
        result: ''
      } as DeclaredExperienceFormData,

      validators: {
        onSubmit () {
          return {
            fields: {
              result: undefined
            }
          }
        }
      }
    }) as unknown as AddDeclaredExperienceForm

    return { form }
  },

  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredExperienceResultFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared experience result form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceResultInput: DeclaredExperienceResultInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the result input component', () => {
      const input = wrapper.findComponent({
        name: 'DeclaredExperienceResultInput'
      })

      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({
        name: 'DeclaredExperienceResultInput'
      })

      expect(input.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a result', () => {
      BddTest().then('it should update the form field value', async () => {
        const input = wrapper.findComponent({
          name: 'DeclaredExperienceResultInput'
        })

        const textInput = input.find('input')

        await textInput.setValue('Admis avec mention')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({
            name: 'DeclaredExperienceResultInput'
          })

          expect(updated.props('modelValue')).toBe('Admis avec mention')
        })
      })
    })

    BddTest().and('the input emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const input = wrapper.findComponent({
          name: 'DeclaredExperienceResultInput'
        })

        await input.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(input.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the user clears the result', () => {
      BddTest().then('it should update the form field with an empty value', async () => {
        const input = wrapper.findComponent({
          name: 'DeclaredExperienceResultInput'
        })

        const textInput = input.find('input')

        await textInput.setValue('Résultat obtenu')
        await wrapper.vm.$nextTick()

        await textInput.setValue('')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({
            name: 'DeclaredExperienceResultInput'
          })

          expect(updated.props('modelValue')).toBe('')
        })
      })
    })

    BddTest().and('the form is submitted with empty result', () => {
      BddTest().then('it should not show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const input = wrapper.findComponent({
            name: 'DeclaredExperienceResultInput'
          })

          expect(input.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid result', () => {
      BddTest().then('it should not show validation error', async () => {
        const input = wrapper.findComponent({
          name: 'DeclaredExperienceResultInput'
        })

        const textInput = input.find('input')

        await textInput.setValue('Validation avec mention')
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({
            name: 'DeclaredExperienceResultInput'
          })

          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
