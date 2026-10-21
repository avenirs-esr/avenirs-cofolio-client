<script lang="ts" setup>
import type { AvSelectOption, AvSelectProps, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { SortValue } from '@/common/types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ESortField, ESortOrder } from '@/api/avenir-esr'
import { formatSortValue } from '@/common/utils/http/http-params'

export type SortSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'label' | 'selectedText'>

const { labelVisible = true, ...restProps } = defineProps<SortSelectProps>()

const selectedItem = defineModel<{ itemId: SortValue }>('selectedItem')

const { t } = useI18n()

const sortOptions = computed<AvSelectOption[]>(() => [
  formatSortValue(ESortField.NAME, ESortOrder.ASC),
  formatSortValue(ESortField.NAME, ESortOrder.DESC),
  formatSortValue(ESortField.DATE, ESortOrder.DESC),
  formatSortValue(ESortField.DATE, ESortOrder.ASC)
].map(value => ({
  value,
  label: t(`global.sort.${value}`)
})))

const selectedSortOption = computed<AvSelectSelectedOption>({
  get () {
    return sortOptions.value.find(
      option => option.value === selectedItem.value?.itemId,
    ) ?? sortOptions.value[0]
  },
  set (option) {
    selectedItem.value = { itemId: option.value as SortValue }
  },
})

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: t('global.sort.label'),
  placeholder: '',
  options: sortOptions.value,
  labelVisible,
  selectedText: selectedSortOption.value.label,
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model="selectedSortOption"
    width="var(--dimension-7xl)"
    required
  />
</template>
