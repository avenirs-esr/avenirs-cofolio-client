<script setup lang="ts">
import type { AvSelectModelValue, AvSelectOption, AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'

export interface DeclaredActivityStatusSelectProps extends Omit<AvSelectProps, 'options' | 'placeholder' | 'label' | 'multiple'> {
  statuses?: EDeclaredActivityStatus[]
}

const {
  statuses,
  ...restProps
} = defineProps<DeclaredActivityStatusSelectProps>()

const selectedStatuses = defineModel<EDeclaredActivityStatus[]>({ default: () => [] })

const { t } = useI18n()

const options = computed<AvSelectOption[]>(() =>
  Object.values(EDeclaredActivityStatus)
    .filter(status => !statuses?.length || statuses.includes(status))
    .map(status => ({
      value: status,
      label: t(`global.activities.badges.declaredStatuses.${status}`),
    }))
)

function toOption (status: EDeclaredActivityStatus): AvSelectOption | undefined {
  return options.value.find(option => option.value === status)
}

function toStatus (option?: AvSelectOption | null): EDeclaredActivityStatus | undefined {
  if (!option) {
    return undefined
  }

  const value = String(option.value)
  return isEnumMember(EDeclaredActivityStatus, value)
    ? value
    : undefined
}

const selectedOptions = computed<AvSelectModelValue>({
  get: () => selectedStatuses.value.flatMap(status => toOption(status) ?? []),
  set: newValue => selectedStatuses.value = (Array.isArray(newValue) ? newValue : [newValue])
    .flatMap(option => toStatus(option) ?? [])
})

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: t('global.activities.inputs.DeclaredActivityStatusSelect.label'),
  placeholder: t('global.activities.inputs.DeclaredActivityStatusSelect.placeholder'),
  options: options.value,
  width: 'var(--dimension-7xl)',
  multiple: true,
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model="selectedOptions"
  />
</template>
