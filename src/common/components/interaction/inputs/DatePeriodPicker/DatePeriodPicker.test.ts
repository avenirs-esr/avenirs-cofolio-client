import type { DatePeriodPickerProps } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.vue'
import DatePeriodPicker from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.vue'
import { AvCheckboxStub, AvDatePickerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

interface DatePeriodPickerModelValues {
  endDate?: string
  isOngoing?: boolean
  startDate?: string
}

BddTest().given('a date period picker', () => {
  let wrapper: VueWrapper<InstanceType<typeof DatePeriodPicker>>

  const stubs = {
    AvCheckbox: AvCheckboxStub,
    AvDatePicker: AvDatePickerStub,
  }

  const getDatePicker = () => wrapper.findComponent(AvDatePickerStub)
  const getCheckbox = () => wrapper.findComponent(AvCheckboxStub)

  function mountDatePeriodPicker (
    props: Partial<DatePeriodPickerProps> = {},
    modelValues: DatePeriodPickerModelValues = {}
  ) {
    wrapper = mount(DatePeriodPicker, {
      global: { stubs },
      props: {
        endDate: modelValues.endDate ?? '',
        isOngoing: modelValues.isOngoing ?? false,
        label: 'Period',
        ongoingLabel: 'Ongoing',
        startDate: modelValues.startDate ?? '',
        ...props,
      },
    })
  }

  BddTest().when('it is mounted with default values', () => {
    beforeEach(() => {
      mountDatePeriodPicker()
    })

    BddTest().then('it should configure a month range picker', () => {
      expect(getDatePicker().props('type')).toBe('month')
      expect(getDatePicker().props('range')).toBe(true)
      expect(getDatePicker().props('modelValue')).toBeNull()
    })

    BddTest().then('it should render the labels', () => {
      expect(getDatePicker().props('label')).toBe('Period')
      expect(getCheckbox().props('label')).toBe('Ongoing')
    })
  })

  BddTest().when('it is mounted as required', () => {
    beforeEach(() => {
      mountDatePeriodPicker({ required: true })
    })

    BddTest().then('it should append an asterisk to the date picker label', () => {
      expect(getDatePicker().props('label')).toBe('Période *')
    })
  })

  BddTest().when('it is mounted as ongoing', () => {
    beforeEach(() => {
      mountDatePeriodPicker({}, {
        endDate: '2025-03-01',
        isOngoing: true,
        startDate: '2024-02-01',
      })
    })

    BddTest().then('it should use a single month value', () => {
      expect(getDatePicker().props('modelValue')).toEqual({ month: 1, year: 2024 })
      expect(getDatePicker().props('range')).toBe(false)
      expect(getCheckbox().props('modelValue')).toEqual(['isOngoing'])
    })
  })

  BddTest().when('it is mounted with date type', () => {
    beforeEach(() => {
      mountDatePeriodPicker({ type: 'date' }, {
        endDate: '2025-03-01',
        startDate: '2024-02-01',
      })
    })

    BddTest().then('it should configure a date picker', () => {
      expect(getDatePicker().props('type')).toBe('date')
    })
  })

  BddTest().when('the date picker emits a complete month range', () => {
    beforeEach(() => {
      mountDatePeriodPicker()
      getDatePicker().vm.$emit('update:modelValue', [
        { month: 2, year: 2024 },
        { month: 4, year: 2025 },
      ])
    })

    BddTest().then('it should emit both formatted dates', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:startDate')).toEqual([['2024-03-01']])
        expect(wrapper.emitted('update:endDate')).toEqual([['2025-05-01']])
      })
    })
  })

  BddTest().when('the date picker emits a partial month range', () => {
    beforeEach(() => {
      mountDatePeriodPicker({}, { endDate: '2025-03-01' })
      getDatePicker().vm.$emit('update:modelValue', [{ month: 2, year: 2024 }])
    })

    BddTest().then('it should emit the start date and clear the end date', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:startDate')).toEqual([['2024-03-01']])
        expect(wrapper.emitted('update:endDate')).toEqual([['']])
      })
    })
  })

  BddTest().when('the date picker emits null', () => {
    beforeEach(() => {
      mountDatePeriodPicker({}, {
        endDate: '2025-03-01',
        startDate: '2024-02-01',
      })
      getDatePicker().vm.$emit('update:modelValue', null)
    })

    BddTest().then('it should clear both dates', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:startDate')).toEqual([['']])
        expect(wrapper.emitted('update:endDate')).toEqual([['']])
      })
    })
  })

  BddTest().when('the ongoing checkbox is checked', () => {
    beforeEach(() => {
      mountDatePeriodPicker({}, { endDate: '2025-03-01', startDate: '2024-02-01' })
      getCheckbox().vm.$emit('update:modelValue', ['isOngoing'])
    })

    BddTest().then('it should enable ongoing mode and clear the end date', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:isOngoing')).toEqual([[true]])
        expect(wrapper.emitted('update:endDate')).toEqual([['']])
      })
    })
  })

  BddTest().when('the ongoing checkbox is unchecked', () => {
    beforeEach(() => {
      mountDatePeriodPicker({}, { isOngoing: true, startDate: '2024-02-01' })
      getCheckbox().vm.$emit('update:modelValue', [])
    })

    BddTest().then('it should disable ongoing mode', async () => {
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:isOngoing')).toEqual([[false]])
        expect(wrapper.emitted('update:endDate')).toBeUndefined()
      })
    })
  })

  BddTest().when('it receives a validation error', () => {
    beforeEach(() => {
      mountDatePeriodPicker({ startDateErrors: ['The period is invalid'] }, {
        startDate: '2024-02-01',
      })
    })

    BddTest().then('it should keep the API form value and forward the error', () => {
      expect(getDatePicker().props('modelValue')).toEqual([{ month: 1, year: 2024 }])
      expect(getDatePicker().props('errorMessage')).toBe('The period is invalid')
    })
  })
})
