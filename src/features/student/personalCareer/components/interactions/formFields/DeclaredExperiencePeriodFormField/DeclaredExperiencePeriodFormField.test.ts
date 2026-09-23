import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import DeclaredExperiencePeriodFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import {
  useDeclaredExperienceFormValidators
} from '@/features/student/personalCareer/composables/use-declared-experience-form-validators/use-declared-experience-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperiencePeriodFormField
  },
  setup () {
    const { validateStartDate, validateEndDate } = useDeclaredExperienceFormValidators()

    const form = useForm({
      defaultValues: {
        startDate: '',
        endDate: '',
        isOngoing: false
      } as DeclaredExperienceFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              startDate: validateStartDate(value.startDate),
              endDate: validateEndDate(value.endDate, value.startDate, { isRequired: !value.isOngoing })
            }
          }
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
    BddTest().then('it should render the date period picker as required', () => {
      expect(getDatePeriodPicker().exists()).toBe(true)
      expect(getDatePeriodPicker().props('required')).toBe(true)
    })

    BddTest().then('it should have empty initial values', () => {
      const datePeriodPicker = getDatePeriodPicker()
      expect(datePeriodPicker.props('startDate')).toBe('')
      expect(datePeriodPicker.props('endDate')).toBe('')
      expect(datePeriodPicker.props('isOngoing')).toBe(false)
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
      BddTest().then('it should update the ongoing state', async () => {
        getDatePeriodPicker().vm.$emit('update:isOngoing', true)

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('isOngoing')).toBe(true)
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
          expect(getDatePeriodPicker().props('startDateErrors')).toEqual(['Ce champ est requis.'])
          expect(getDatePeriodPicker().props('endDateErrors')).toEqual(['Ce champ est requis.'])
        })
      })
    })

    BddTest().and('the form is submitted without an end date', () => {
      BddTest().then('it should require an end date', async () => {
        getDatePeriodPicker().vm.$emit('update:startDate', '2024-01-01')
        await wrapper.find('form').trigger('submit')

        await vi.waitFor(() => {
          expect(getDatePeriodPicker().props('startDateErrors')).toEqual([])
          expect(getDatePeriodPicker().props('endDateErrors')).toEqual(['Veuillez renseigner une date de fin.'])
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
