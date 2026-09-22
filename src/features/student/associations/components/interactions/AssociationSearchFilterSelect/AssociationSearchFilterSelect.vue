<script setup lang="ts">
import type { EAssociationContextType } from '@/api/avenir-esr'
import { AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { AvSelect, type AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociationSearchFilterSelectProps {
  contextType: EAssociationContextType
  label?: string
  labelVisible?: boolean
}

const { contextType, label, labelVisible = true } = defineProps<AssociationSearchFilterSelectProps>()

const searchFilter = defineModel<AssociationSearchFilter>({ required: true })

const { t } = useI18n()

const selectedItem = computed<AvSelectSelectedOption>({
  get: () => ({ itemId: searchFilter.value }),
  set: ({ itemId }) => {
    searchFilter.value = itemId as AssociationSearchFilter
  }
})

const options = computed(() =>
  Object.values(AssociationSearchFilter).map(filter => ({
    id: filter,
    label: t(`student.associations.contextTypes.${contextType}.searchFilters.${filter}.label`)
  }))
)
</script>

<template>
  <AvSelect
    v-model:selected-item="selectedItem"
    :options="options"
    :label="label ?? t('student.associations.interactions.AssociationSearchFilterSelect.label')"
    :label-visible="labelVisible"
    :placeholder="t('student.associations.interactions.AssociationSearchFilterSelect.placeholder')"
    data-testid="association-search-filter-select"
  />
</template>
