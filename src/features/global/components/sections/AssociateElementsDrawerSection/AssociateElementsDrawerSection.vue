<script setup lang="ts">
import type { Association } from '@/features/global/types/associations.types'
import type { AssociateElementTypeConfig } from '@/features/traces/types/traces.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import AssociateElementTypeSelect from '@/features/global/components/interaction/AssociationElementTypeSelect/AssociateElementTypeSelect.vue'
import SearchAssociationLayout from '@/features/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { useI18n } from 'vue-i18n'

export interface AssociateElementsDrawerSectionProps {
  typeConfigs: AssociateElementTypeConfig[]
  options: Association[]
  loading?: boolean
  layout?: 'vertical' | 'horizontal'
}

const { typeConfigs, options, loading, layout = 'horizontal' } = defineProps<AssociateElementsDrawerSectionProps>()

const { t } = useI18n()

function autocompleteOptionToAssociateElementOption (option: AvAutocompleteOption): Association {
  return {
    id: option.value.toString(),
    title: option.label,
    description: option.description,
    disabled: option.disabled ?? false
  }
}

function associateElementOptionToAutocompleteOption (option: Association): AvAutocompleteOption {
  return {
    value: option.id,
    label: option.title,
    description: option.description,
    disabled: option.disabled
  }
}

const selectionsByType = defineModel<Record<string, Association[]>>('selectionsByType', { default: () => ({}) })
const activeTypeKey = defineModel<string>('activeTypeKey', { required: true })
const activeSubTypeKey = defineModel<string>('activeSubTypeKey')
const searchQuery = defineModel<string>('searchQuery', { default: '' })

const activeConfig = computed(() =>
  typeConfigs.find(config => config.key === activeTypeKey.value) ?? typeConfigs[0]
)

const activeSubConfig = computed(() =>
  activeConfig.value.subConfigs?.find(subConfig => subConfig.key === activeSubTypeKey.value) ?? activeConfig.value.subConfigs?.[0]
)

const autocompleteOptions = computed<AvAutocompleteOption[]>(() => options.map(associateElementOptionToAutocompleteOption))

const activeAssociations = computed<Association[]>(() => selectionsByType.value[activeTypeKey.value] ?? [])

const autocompleteSelectedOptions = computed<AvAutocompleteOption[]>({
  get: () => activeAssociations.value.map(associateElementOptionToAutocompleteOption),
  set: (newOptions) => {
    selectionsByType.value = {
      ...selectionsByType.value,
      [activeTypeKey.value]: newOptions.map(autocompleteOptionToAssociateElementOption)
    }
  }
})

const searchPlaceholder = computed(() =>
  activeSubConfig.value?.searchPlaceholder
  ?? activeConfig.value.searchPlaceholder
  ?? t('student.global.sections.AssociateElementsDrawerSection.defaultPlaceholder')
)

function onDeleteItem (itemId: string) {
  selectionsByType.value = {
    ...selectionsByType.value,
    [activeTypeKey.value]: activeAssociations.value.filter(item => item.id !== itemId)
  }
}

watch(activeTypeKey, () => {
  activeSubTypeKey.value = undefined
})
</script>

<template>
  <div
    class="associate-elements-drawer-section"
    data-testid="associate-elements-drawer-section"
  >
    <SearchAssociationLayout
      v-model="autocompleteSelectedOptions"
      v-model:search="searchQuery"
      :options="autocompleteOptions"
      :items="activeAssociations"
      :input-options="{ placeholder: searchPlaceholder }"
      :loading="loading"
      :layout="layout"
      @delete="onDeleteItem"
    >
      <template #beforeSearch>
        <div class="av-row av-gap-xs av-align-end">
          <AssociateElementTypeSelect
            v-model:active-type-key="activeTypeKey"
            :type-configs="typeConfigs"
            data-testid="associate-elements-type-select"
          />
          <AssociateElementTypeSelect
            v-if="activeSubConfig"
            v-model:active-type-key="activeSubTypeKey!"
            :type-configs="activeConfig.subConfigs!"
            data-testid="associate-elements-sub-type-select"
            is-sub-type
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
