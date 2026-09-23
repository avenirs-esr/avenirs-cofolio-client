import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import DeclaredProgramPeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
          const errors: Partial<Record<keyof DeclaredProgramFormData, string>> = {}

          if (!value.startDate.trim()) {
            errors.startDate = 'La date de début est requise'
          }

          if (!value.isOngoing && !value.endDate.trim()) {
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

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          DatePeriodPicker: DatePeriodPickerStub
        }
      }
    })
  })

  const getDatePeriodPicker = () => wrapper.findComponent(DatePeriodPickerStub)

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the date period picker', () => {
      expect(getDatePeriodPicker().exists()).toBe(true)
    })

    BddTest().then('it should have empty initial values', () => {
      const datePeriodPicker = getDatePeriodPicker()
      expect(datePeriodPicker.props('startDate')).toBe('')
      expect(datePeriodPicker.props('endDate')).toBe('')
      expect(datePeriodPicker.props('isOngoing')).toBe(false)
    })

    BddTest().then('it should use the month type and API date format', () => {
      const datePeriodPicker = getDatePeriodPicker()
      expect(datePeriodPicker.props('type')).toBe('month')
      expect(datePeriodPicker.props('inputFormat')).toBe('yyyy-MM-dd')
      expect(datePeriodPicker.props('outputFormat')).toBe('yyyy-MM-dd')
    })

    BddTest().and('the user enters a start date', () => {
      BddTest().then('it should update the start date value', async () => {
        getDatePeriodPicker().vm.$emit('update:startDate', '2024-01-01')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('startDate')).toBe('2024-01-01')
        })
      })
    })

    BddTest().and('the user enters an end date', () => {
      BddTest().then('it should update the end date value', async () => {
        getDatePeriodPicker().vm.$emit('update:endDate', '2024-12-01')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('endDate')).toBe('2024-12-01')
        })
      })
    })

    BddTest().and('the user checks isOngoing', () => {
      BddTest().then('it should update the ongoing state and clear the end date', async () => {
        getDatePeriodPicker().vm.$emit('update:endDate', '2024-12-01')
        getDatePeriodPicker().vm.$emit('update:isOngoing', true)
        getDatePeriodPicker().vm.$emit('update:endDate', '')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('isOngoing')).toBe(true)
          expect(getDatePeriodPicker().props('endDate')).toBe('')
        })
      })
    })

    BddTest().and('the user unchecks isOngoing', () => {
      BddTest().then('it should update the ongoing state', async () => {
        getDatePeriodPicker().vm.$emit('update:isOngoing', true)
        getDatePeriodPicker().vm.$emit('update:isOngoing', false)

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('isOngoing')).toBe(false)
        })
      })
    })

    BddTest().and('the form is submitted with empty dates', () => {
      BddTest().then('it should pass validation errors to the date period picker', async () => {
        await wrapper.find('form').trigger('submit')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('startDateErrors')).toEqual(['La date de début est requise'])
          expect(getDatePeriodPicker().props('endDateErrors')).toEqual(['La date de fin est requise'])
        })
      })
    })

    BddTest().and('the form is submitted with valid dates', () => {
      BddTest().then('it should not pass validation errors to the date period picker', async () => {
        getDatePeriodPicker().vm.$emit('update:startDate', '2024-01-01')
        getDatePeriodPicker().vm.$emit('update:endDate', '2024-12-01')
        await wrapper.find('form').trigger('submit')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('startDateErrors')).toEqual([])
          expect(getDatePeriodPicker().props('endDateErrors')).toEqual([])
        })
      })
    })

    BddTest().and('the form is submitted with isOngoing checked and a start date', () => {
      BddTest().then('it should not require an end date', async () => {
        getDatePeriodPicker().vm.$emit('update:startDate', '2024-01-01')
        getDatePeriodPicker().vm.$emit('update:isOngoing', true)
        await wrapper.find('form').trigger('submit')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('startDateErrors')).toEqual([])
          expect(getDatePeriodPicker().props('endDateErrors')).toEqual([])
        })
      })
    })
  })
})
