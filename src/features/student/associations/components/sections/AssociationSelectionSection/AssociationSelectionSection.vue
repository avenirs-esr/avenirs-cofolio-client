<script setup lang="ts">
import type { EAssociationContextType } from '@/api/avenir-esr'
import type { Association, AssociationSelections } from '@/features/student/associations/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import AssociationContextTypeSelect
  from '@/features/student/associations/components/interactions/AssociationContextTypeSelect/AssociationContextTypeSelect.vue'
import AssociationSearchFilterSelect
  from '@/features/student/associations/components/interactions/AssociationSearchFilterSelect/AssociationSearchFilterSelect.vue'
import SearchAssociationLayout from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.vue'
import { useAssociationSearch } from '@/features/student/associations/composables/use-association-search/use-association-search'
import { DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { canAssociateContextType, getAssociableContextTypes } from '@/features/student/associations/utils/associations.utils'
import { useI18n } from 'vue-i18n'

export interface AssociationSelectionSectionProps {
  /** Context type of the element being created. */
  contextType: EAssociationContextType
  /** Context types that can be selected, all the associable ones by default. */
  associatedContextTypes?: EAssociationContextType[]
  /** Whether the search is enabled, e.g. only when the section is visible. */
  enabled?: boolean
  layout?: 'vertical' | 'horizontal'
}

const {
  contextType,
  associatedContextTypes,
  enabled = true,
  layout = 'horizontal'
} = defineProps<AssociationSelectionSectionProps>()

const selections = defineModel<AssociationSelections>('selections', { default: () => ({}) })

const { t } = useI18n()

const selectableContextTypes = (associatedContextTypes ?? getAssociableContextTypes(contextType)).filter(canAssociateContextType)

const activeContextType = ref<EAssociationContextType>(selectableContextTypes[0]!)
const searchQuery = ref('')
const searchFilter = ref(DEFAULT_ASSOCIATION_SEARCH_FILTER)

const searches = new Map(selectableContextTypes.map(associatedContextType => [
  associatedContextType,
  useAssociationSearch({
    contextType,
    associatedContextType,
    searchQuery,
    searchFilter,
    enabled: () => enabled && activeContextType.value === associatedContextType
  })
]))

const activeSearch = computed(() => searches.get(activeContextType.value)!)
const isSearchLoading = computed(() => activeSearch.value.isLoading.value)

function toAutocompleteOption (association: Association): AvAutocompleteOption {
  return {
    value: association.id,
    label: association.title,
    description: association.description,
    disabled: association.disabled
  }
}

function toAssociation (option: AvAutocompleteOption): Association {
  return {
    id: option.value.toString(),
    title: option.label,
    description: option.description,
    disabled: option.disabled ?? false
  }
}

const autocompleteOptions = computed<AvAutocompleteOption[]>(() => activeSearch.value.associations.value.map(toAutocompleteOption))

const activeAssociations = computed<Association[]>(() => selections.value[activeContextType.value] ?? [])

const autocompleteSelectedOptions = computed<AvAutocompleteOption[]>({
  get: () => activeAssociations.value.map(toAutocompleteOption),
  set: (options) => {
    selections.value = {
      ...selections.value,
      [activeContextType.value]: options.map(toAssociation)
    }
  }
})

const searchPlaceholder = computed(() => activeSearch.value.isFilterable
  ? t(`student.associations.contextTypes.${activeContextType.value}.searchFilters.${searchFilter.value}.searchPlaceholder`)
  : t(`student.associations.contextTypes.${activeContextType.value}.searchPlaceholder`))

function onDeleteItem (itemId: string) {
  selections.value = {
    ...selections.value,
    [activeContextType.value]: activeAssociations.value.filter(({ id }) => id !== itemId)
  }
}

watch(activeContextType, () => {
  searchQuery.value = ''
})
</script>

<template>
  <div
    v-if="selectableContextTypes.length > 0"
    class="association-selection-section"
    data-testid="associate-elements-drawer-section"
  >
    <SearchAssociationLayout
      v-model="autocompleteSelectedOptions"
      v-model:search="searchQuery"
      :options="autocompleteOptions"
      :items="activeAssociations"
      :input-options="{ placeholder: searchPlaceholder }"
      :loading="isSearchLoading"
      :layout="layout"
      @delete="onDeleteItem"
    >
      <template #beforeSearch>
        <div class="av-row av-gap-xs av-align-end">
          <AssociationContextTypeSelect
            v-model="activeContextType"
            :context-types="selectableContextTypes"
            data-testid="associate-elements-type-select"
          />
          <AssociationSearchFilterSelect
            v-if="activeSearch.isFilterable"
            v-model="searchFilter"
            :context-type="activeContextType"
            :label="t('student.associations.sections.AssociationSelectionSection.filterLabel')"
            :label-visible="false"
            data-testid="associate-elements-filter-select"
          />
        </div>
      </template>

      <template #selectedItem="{ item }">
        <div class="av-col">
          <span class="caption-regular">{{ item.title }}</span>
          <span
            v-if="item.description"
            class="caption-light"
          >{{ item.description }}</span>
        </div>
      </template>
    </SearchAssociationLayout>
  </div>
</template>
