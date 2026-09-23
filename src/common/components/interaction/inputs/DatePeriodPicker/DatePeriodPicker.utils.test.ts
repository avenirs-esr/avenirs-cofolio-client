import type { AvDatePickerMonthModel } from '@avenirs-esr/avenirs-dsav'
import { toOutputValue, toPickerValue } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

BddTest().given('toPickerValue', () => {
  BddTest().when('the value is empty', () => {
    BddTest().then('it should return null', () => {
      expect(toPickerValue('', 'month', 'yyyy-MM-dd')).toBeNull()
    })
  })

  BddTest().when('the value is a valid date', () => {
    BddTest().then('it should return a Date instance', () => {
      expect(toPickerValue('2024-02-01', 'date', 'yyyy-MM-dd')).toEqual(new Date(2024, 1, 1))
    })
  })

  BddTest().when('the value is a valid month', () => {
    BddTest().then('it should return a month model', () => {
      expect(toPickerValue('2024-02-01', 'month', 'yyyy-MM-dd')).toEqual({ month: 1, year: 2024 })
    })
  })

  BddTest().when('the value uses a custom input format', () => {
    BddTest().then('it should parse the value using that format', () => {
      expect(toPickerValue('01/02/2024', 'date', 'dd/MM/yyyy')).toEqual(new Date(2024, 1, 1))
    })
  })

  BddTest().when('the value is invalid or does not match the input format', () => {
    BddTest().then('it should return null', () => {
      expect(toPickerValue('2024-02-30', 'date', 'yyyy-MM-dd')).toBeNull()
      expect(toPickerValue('01/02/2024', 'date', 'yyyy-MM-dd')).toBeNull()
    })
  })
})

BddTest().given('toOutputValue', () => {
  const monthValue: AvDatePickerMonthModel = { month: 1, year: 2024 }
  const dateValue = new Date(2024, 1, 1)

  BddTest().when('the type is month and the value is a month model', () => {
    BddTest().then('it should format the corresponding date', () => {
      expect(toOutputValue(monthValue, 'month', 'yyyy-MM-dd')).toBe('2024-02-01')
    })
  })

  BddTest().when('the type is date and the value is a Date', () => {
    BddTest().then('it should format the date', () => {
      expect(toOutputValue(dateValue, 'date', 'dd/MM/yyyy')).toBe('01/02/2024')
    })
  })

  BddTest().when('the value does not match the picker type', () => {
    BddTest().then('it should return an empty string', () => {
      expect(toOutputValue(dateValue, 'month', 'yyyy-MM-dd')).toBe('')
      expect(toOutputValue(monthValue, 'date', 'yyyy-MM-dd')).toBe('')
    })
  })
})
