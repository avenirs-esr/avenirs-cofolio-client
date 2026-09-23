<script setup lang="ts">
import type { DatePeriodPickerType, PickerModel } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.types'
import { toOutputValue, toPickerValue } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.utils'
import {
  AvCheckbox,
  AvDatePicker,
  type AvDatePickerModel,
  type AvDatePickerProps
} from '@avenirs-esr/avenirs-dsav'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

export interface DatePeriodPickerProps {
  disabled?: boolean
  endDateErrors?: (string | undefined)[]
  formats?: AvDatePickerProps['formats']
  inputFormat?: string
  label?: string
  labelClass?: string
  ongoingLabel?: string
  outputFormat?: string
  required?: boolean
  startDateErrors?: (string | undefined)[]
  type?: DatePeriodPickerType
}

const {
  disabled = false,
  endDateErrors,
  formats,
  inputFormat = 'yyyy-MM-dd',
  label,
  labelClass,
  ongoingLabel,
  outputFormat = 'yyyy-MM-dd',
  required = false,
  startDateErrors,
  type = 'month'
} = defineProps<DatePeriodPickerProps>()
const IS_ONGOING = 'isOngoing'
const { t } = useI18n()

const pickerLabel = computed(() => {
  const defaultLabel = label ?? t('global.dates.period')
  return required ? `${defaultLabel} *` : defaultLabel
})
const pickerOngoingLabel = computed(() => ongoingLabel ?? t('global.dates.ongoing'))

const startDate = defineModel<string>('startDate', { required: true })
const endDate = defineModel<string>('endDate', { required: true })
const isOngoing = defineModel<boolean>('isOngoing', { required: false, default: false })

const componentId = useId()
const isOngoingId = `${componentId}-ongoing`

const modelValue = computed<PickerModel>(() => {
  const startValue = toPickerValue(startDate.value, type, inputFormat)
  if (!startValue) {
    return null
  }

  if (isOngoing.value) {
    return startValue
  }

  const endValue = toPickerValue(endDate.value, type, inputFormat)
  return endValue ? [startValue, endValue] : [startValue]
})

function onUpdateModelValue (value: AvDatePickerModel) {
  if (value === null) {
    startDate.value = ''
    endDate.value = ''
    return
  }

  if (Array.isArray(value)) {
    const [startValue, endValue] = value
    startDate.value = toOutputValue(startValue, type, outputFormat)
    endDate.value = endValue ? toOutputValue(endValue, type, outputFormat) : ''
    return
  }

  startDate.value = toOutputValue(value, type, outputFormat)
  if (isOngoing.value) {
    endDate.value = ''
  }
}

function onUpdateIsOngoing (values: (string | number | boolean | undefined)[]) {
  const checked = values[0] === IS_ONGOING
  isOngoing.value = checked

  if (checked) {
    endDate.value = ''
  }
}

const errorMessage = computed(() => [
  startDateErrors?.filter(Boolean)?.join(', '),
  endDateErrors?.filter(Boolean)?.join(', ')
].filter(Boolean).join(', ') || undefined)
</script>

<template>
  <AvDatePicker
    :key="`${type}-${isOngoing ? 'ongoing' : 'period'}`"
    :error-message="errorMessage"
    :label="pickerLabel"
    :model-value="modelValue"
    :range="!isOngoing"
    :type="type"
    :disabled
    :formats="formats"
    :label-class
    @update:model-value="onUpdateModelValue"
  >
    <template
      #labelSuffix
    >
      <AvCheckbox
        :id="isOngoingId"
        :disabled
        :name="IS_ONGOING"
        :model-value="isOngoing ? [IS_ONGOING] : []"
        :value="IS_ONGOING"
        :label="pickerOngoingLabel"
        @update:model-value="onUpdateIsOngoing"
      />
    </template>
  </AvDatePicker>
</template>
