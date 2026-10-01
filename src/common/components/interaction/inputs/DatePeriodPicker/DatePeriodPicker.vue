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

type AvDatePickerPassThroughProps = Omit<AvDatePickerProps, 'key' | 'errorMessage' | 'modelValue' | 'range' | 'type'>

export type DatePeriodPickerProps = AvDatePickerPassThroughProps & {
  endDateErrors?: (string | undefined)[]
  inputFormat?: string
  outputFormat?: string
  ongoingLabel?: string
  required?: boolean
  showOngoing?: boolean
  startDateErrors?: (string | undefined)[]
  type?: DatePeriodPickerType
}

defineOptions({
  inheritAttrs: false
})

const {
  autoApply = undefined,
  disabled = false,
  endDateErrors,
  inputFormat = 'yyyy-MM-dd',
  label,
  ongoingLabel,
  outputFormat = 'yyyy-MM-dd',
  required = false,
  showOngoing = true,
  startDateErrors,
  type = 'month',
  ...restProps
} = defineProps<DatePeriodPickerProps>()
const IS_ONGOING = 'isOngoing'
const { t, locale } = useI18n()

const pickerLabel = computed(() => {
  const defaultLabel = label ?? t('global.dates.period')
  return required ? `${defaultLabel} *` : defaultLabel
})

const pickerOngoingLabel = computed(() => ongoingLabel ?? t('global.dates.ongoing'))

const startDate = defineModel<string>('startDate', { required: true })
const endDate = defineModel<string>('endDate', { required: false, default: undefined })
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
    :model-value="(modelValue as AvDatePickerModel)"
    :range="!isOngoing"
    :type="type"
    :auto-apply
    :disabled
    v-bind="restProps"
    :locale="locale"
    @update:model-value="onUpdateModelValue"
  >
    <template
      v-if="showOngoing"
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
