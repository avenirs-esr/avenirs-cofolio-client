import type { EExperienceType } from '@/api/avenir-esr'
import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceTypeFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { DeclaredExperienceTypeSelectStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperienceTypeFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        type: ''
      } as DeclaredExperienceFormData,
      validators: {
        onSubmit ({ value }) {
          if (!value.type || value.type.trim() === '') {
            return {
              fields: {
                type: 'Le type est requis'
              }
            }
          }
          return { fields: { type: undefined } }
        }
      }
    }) as unknown as AddDeclaredExperienceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredExperienceTypeFormField :form="form" />
    </form>
  `
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
      expect(select.props('modelValue')).toBe('')
    })

    BddTest().and('the user selects a type', () => {
      BddTest().then('it should update the form field value', async () => {
        const select = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
        await select.vm.$emit('update:modelValue', 'PROFESSIONAL' as EExperienceType)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceTypeSelect' })
          expect(updated.props('modelValue')).toBe('PROFESSIONAL')
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
          expect(select.props('errorMessage')).toBe('Le type est requis')
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
