import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredProgramPeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import { AvCheckboxStub, AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredProgramPeriodFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        startDate: '',
        endDate: '',
        isOngoing: false
      } as DeclaredProgramFormData,
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
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramPeriodFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program period form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    AvCheckbox: AvCheckboxStub,
    AvPeriodInput: AvPeriodInputStub
  }

  const getCheckbox = () => wrapper.findComponent({ name: 'AvCheckbox' })
  const getPeriodInput = () => wrapper.findComponent({ name: 'AvPeriodInput' })

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the checkbox and the period input', () => {
      expect(getCheckbox().exists()).toBe(true)
      expect(getPeriodInput().exists()).toBe(true)
    })

    BddTest().then('it should have empty initial values', () => {
      const period = getPeriodInput()
      expect(period.props('startModelValue')).toBe('')
      expect(period.props('endModelValue')).toBe('')
    })

    BddTest().then('it should have isOngoing unchecked', () => {
      const checkbox = getCheckbox()
      expect(checkbox.props('modelValue')).toEqual([])
    })

    BddTest().then('it should enable end date input', () => {
      const period = getPeriodInput()
      expect(period.props('endDateDisabled')).toBe(false)
    })

    BddTest().and('the user enters a start date', () => {
      BddTest().then('it should update the start date value', async () => {
        const period = getPeriodInput()
        await period.vm.$emit('update:startModelValue', '2024-01')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = getPeriodInput()
          expect(updated.props('startModelValue')).toBe('2024-01')
        })
      })
    })

    BddTest().and('the user enters an end date', () => {
      BddTest().then('it should update the end date value', async () => {
        const period = getPeriodInput()
        await period.vm.$emit('update:endModelValue', '2024-12')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = getPeriodInput()
          expect(updated.props('endModelValue')).toBe('2024-12')
        })
      })
    })

    BddTest().and('the user checks isOngoing checkbox', () => {
      BddTest().then('it should check the checkbox and disable end date input and clear end date', async () => {
        // set an end date first, so we can ensure it gets cleared
        const period = getPeriodInput()
        await period.vm.$emit('update:endModelValue', '2024-12')
        await wrapper.vm.$nextTick()

        const checkbox = getCheckbox()
        await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updatedCheckbox = getCheckbox()
          expect(updatedCheckbox.props('modelValue')).toEqual(['isOngoing'])
        })

        await vi.waitFor(() => {
          const updatedPeriod = getPeriodInput()
          expect(updatedPeriod.props('endDateDisabled')).toBe(true)
        })

        await vi.waitFor(() => {
          const updatedPeriod = getPeriodInput()
          expect(updatedPeriod.props('endModelValue')).toBe('')
        })
      })
    })

    BddTest().and('the user unchecks isOngoing checkbox', () => {
      BddTest().then('it should uncheck the checkbox and enable end date input', async () => {
        const checkbox = getCheckbox()
        await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
        await wrapper.vm.$nextTick()

        await checkbox.vm.$emit('update:modelValue', [])
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updatedCheckbox = getCheckbox()
          expect(updatedCheckbox.props('modelValue')).toEqual([])
        })

        await vi.waitFor(() => {
          const updatedPeriod = getPeriodInput()
          expect(updatedPeriod.props('endDateDisabled')).toBe(false)
        })
      })
    })

    BddTest().and('the form is submitted with empty dates', () => {
      BddTest().then('it should show validation errors for start and end dates', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const period = getPeriodInput()
          expect(period.props('startErrorMessage')).toBe('La date de début est requise')
          expect(period.props('endErrorMessage')).toBe('La date de fin est requise')
        })
      })
    })

    BddTest().and('the form is submitted with valid dates', () => {
      BddTest().then('it should not show validation errors', async () => {
        const period = getPeriodInput()
        await period.vm.$emit('update:startModelValue', '2024-01')
        await period.vm.$emit('update:endModelValue', '2024-12')
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = getPeriodInput()
          expect(updated.props('startErrorMessage')).toBeFalsy()
          expect(updated.props('endErrorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with isOngoing checked and start date', () => {
      BddTest().then('it should not show validation errors', async () => {
        const period = getPeriodInput()
        const checkbox = getCheckbox()

        await period.vm.$emit('update:startModelValue', '2024-01')
        await wrapper.vm.$nextTick()

        await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = getPeriodInput()
          expect(updated.props('startErrorMessage')).toBeFalsy()
          expect(updated.props('endErrorMessage')).toBeFalsy()
        })
      })
    })
  })
})
