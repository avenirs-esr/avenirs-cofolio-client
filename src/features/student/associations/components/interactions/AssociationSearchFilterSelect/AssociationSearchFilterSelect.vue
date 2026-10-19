<script setup lang="ts">
import type { AvSelectOption, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@/api/avenir-esr'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'

export interface AssociationSearchFilterSelectProps {
  contextType: EAssociationContextType
  label?: string
  labelVisible?: boolean
}

const { contextType, label, labelVisible = true } = defineProps<AssociationSearchFilterSelectProps>()

const searchFilter = defineModel<AssociationSearchFilter>({ required: true })

const { t } = useI18n()

const options = computed<AvSelectOption[]>(() =>
  Object.values(AssociationSearchFilter).map(filter => ({
    value: filter,
    label: t(`student.associations.contextTypes.${contextType}.searchFilters.${filter}.label`),
  })),
)

const selectedOption = computed<AvSelectSelectedOption | null>({
  get: () => options.value.find(option => option.value === searchFilter.value) ?? null,
  set: (option) => {
    if (option) {
      searchFilter.value = option.value as AssociationSearchFilter
    }
  },
})
</script>

<template>
  <AvSelect
    v-model="selectedOption"
    :options="options"
    :label="label ?? t('student.associations.interactions.AssociationSearchFilterSelect.label')"
    :label-visible="labelVisible"
    :placeholder="t('student.associations.interactions.AssociationSearchFilterSelect.placeholder')"
    data-testid="association-search-filter-select"
  />
</template>
