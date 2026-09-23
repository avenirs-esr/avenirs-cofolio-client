<script lang="ts" setup>
import type { SortValue } from '@/common/types'
import { ESortField, ESortOrder } from '@/api/avenir-esr'
import { formatSortValue } from '@/common/utils/http/http-params'
import { AvSelect, type AvSelectOption, type AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type SortSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'label'>

const { labelVisible = true, ...restProps } = defineProps<SortSelectProps>()

const selectedItem = defineModel<{ itemId: SortValue }>('selectedItem')

const { t } = useI18n()

const sortOptions = computed<AvSelectOption[]>(() => [
  formatSortValue(ESortField.NAME, ESortOrder.ASC),
  formatSortValue(ESortField.NAME, ESortOrder.DESC),
  formatSortValue(ESortField.DATE, ESortOrder.DESC),
  formatSortValue(ESortField.DATE, ESortOrder.ASC)
].map(value => ({
  id: value,
  label: t(`global.sort.${value}`)
})))

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: t('global.sort.label'),
  placeholder: '',
  options: sortOptions.value,
  labelVisible
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model:selected-item="selectedItem"
  />
</template>
