import type { AvDatePickerMonthModel } from '@avenirs-esr/avenirs-dsav'

export type DatePeriodPickerType = 'date' | 'month'
export type PickerValue = Date | AvDatePickerMonthModel
export type PickerModel = PickerValue | [PickerValue] | [PickerValue, PickerValue] | null
