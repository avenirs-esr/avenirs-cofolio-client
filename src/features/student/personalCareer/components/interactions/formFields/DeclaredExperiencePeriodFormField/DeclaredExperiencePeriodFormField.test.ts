import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperiencePeriodFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import { DeclaredExperiencePeriodInputStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.stub'
import { AvCheckboxStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperiencePeriodFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        startDate: '',
        endDate: '',
        isOngoing: false
      } as DeclaredExperienceFormData,
      validators: {
        onSubmit ({ value }) {
          const errors: Record<string, string | undefined> = {
            startDate: undefined,
            endDate: undefined,
            isOngoing: undefined
          }

          if (!value.startDate || value.startDate.trim() === '') {
            errors.startDate = 'La date de début est requise'
          }

          if (!value.isOngoing && (!value.endDate || value.endDate.trim() === '')) {
            errors.endDate = 'La date de fin est requise'
          }

          return { fields: errors }
        }
      }
    }) as unknown as AddDeclaredExperienceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredExperiencePeriodFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared experience period form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    AvCheckbox: AvCheckboxStub,
    DeclaredExperiencePeriodInput: DeclaredExperiencePeriodInputStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the checkbox and period input', () => {
      const checkbox = wrapper.findAllComponents({ name: 'AvCheckbox' })
      const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
      expect(checkbox.length).toBe(1)
      expect(periodInput.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial values', () => {
      const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
      expect(periodInput.props('startModelValue')).toBe('')
      expect(periodInput.props('endModelValue')).toBe('')
    })

    BddTest().then('it should have isOngoing unchecked', () => {
      const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
      expect(checkbox.props('modelValue')).toEqual([])
    })

    BddTest().then('it should enable end date input', () => {
      const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
      expect(periodInput.props('endDateDisabled')).toBe(false)
    })

    BddTest().and('the user enters a start date', () => {
      BddTest().then('it should update the start date value', async () => {
        const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
        await periodInput.vm.$emit('update:startModelValue', '2024-01')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(updated.props('startModelValue')).toBe('2024-01')
        })
      })
    })

    BddTest().and('the user enters an end date', () => {
      BddTest().then('it should update the end date value', async () => {
        const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
        await periodInput.vm.$emit('update:endModelValue', '2024-12')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(updated.props('endModelValue')).toBe('2024-12')
        })
      })
    })

    BddTest().and('the user checks isOngoing checkbox', () => {
      BddTest().then('it should check the checkbox and disable end date input', async () => {
        const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
        await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updatedCheckbox = wrapper.findComponent({ name: 'AvCheckbox' })
          expect(updatedCheckbox.props('modelValue')).toEqual(['isOngoing'])
        })

        await vi.waitFor(() => {
          const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(periodInput.props('endDateDisabled')).toBe(true)
        })

        await vi.waitFor(() => {
          const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(periodInput.props('endModelValue')).toBe('')
        })
      })
    })

    BddTest().and('the user unchecks isOngoing checkbox', () => {
      BddTest().then('it should uncheck the checkbox and enable end date input', async () => {
        const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
        await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
        await wrapper.vm.$nextTick()
        await checkbox.vm.$emit('update:modelValue', [])
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updatedCheckbox = wrapper.findComponent({ name: 'AvCheckbox' })
          expect(updatedCheckbox.props('modelValue')).toEqual([])
        })

        await vi.waitFor(() => {
          const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(periodInput.props('endDateDisabled')).toBe(false)
        })
      })
    })

    BddTest().and('the form is submitted with empty dates', () => {
      BddTest().then('it should show validation errors for start and end dates', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(periodInput.props('startErrorMessage')).toBe('La date de début est requise')
          expect(periodInput.props('endErrorMessage')).toBe('La date de fin est requise')
        })
      })
    })

    BddTest().and('the form is submitted with valid dates', () => {
      BddTest().then('it should not show validation errors', async () => {
        const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
        await periodInput.vm.$emit('update:startModelValue', '2024-01')
        await periodInput.vm.$emit('update:endModelValue', '2024-12')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(updated.props('startErrorMessage')).toBeFalsy()
          expect(updated.props('endErrorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with isOngoing checked and start date', () => {
      BddTest().then('it should not show validation errors', async () => {
        const periodInput = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
        const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
        await periodInput.vm.$emit('update:startModelValue', '2024-01')
        await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperiencePeriodInput' })
          expect(updated.props('startErrorMessage')).toBeFalsy()
          expect(updated.props('endErrorMessage')).toBeFalsy()
        })
      })
    })
  })
})
