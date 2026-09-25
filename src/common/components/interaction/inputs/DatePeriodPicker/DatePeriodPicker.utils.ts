import type { DatePeriodPickerType, PickerValue } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.types'
import { type AvDatePickerModel, isDate, isMonthModel, toDate } from '@avenirs-esr/avenirs-dsav'
import { format, isValid, parse } from 'date-fns'

export function toPickerValue (value: string | undefined, type: DatePeriodPickerType, inputFormat: string): PickerValue | null {
  if (!value) {
    return null
  }

  const parsedDate = parse(value, inputFormat, new Date())
  if (!isValid(parsedDate) || format(parsedDate, inputFormat) !== value) {
    return null
  }

  return type === 'month'
    ? { month: parsedDate.getMonth(), year: parsedDate.getFullYear() }
    : parsedDate
}

export function toOutputValue (value: AvDatePickerModel, type: DatePeriodPickerType, outputFormat: string): string {
  if (type === 'month' && isMonthModel(value)) {
    const date = toDate(value)
    return date ? format(date, outputFormat) : ''
  }

  return type === 'date' && isDate(value) ? format(value, outputFormat) : ''
}
