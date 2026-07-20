<script setup lang="ts">
import type { Association } from '@/features/student/global/types/associations.types'
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import AssociateElementTypeSelect from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociationElementTypeSelect/AssociateElementTypeSelect.vue'

export interface AssociateElementsDrawerSectionProps {
  typeConfigs: AssociateElementTypeConfig[]
  options: Association[]
  loading?: boolean
  activeTypeKey: string
  layout?: 'vertical' | 'horizontal'
}

const { typeConfigs, options, loading, layout = 'horizontal' } = defineProps<AssociateElementsDrawerSectionProps>()

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
const searchQuery = defineModel<string>('searchQuery', { default: '' })

const activeConfig = computed(() =>
  typeConfigs.find(config => config.key === activeTypeKey.value) ?? typeConfigs[0]
)

const autocompleteOptions = computed<AvAutocompleteOption[]>(() =>
  options.map(associateElementOptionToAutocompleteOption)
)

const activeTypeAssociations = computed<Association[]>(() => selectionsByType.value[activeTypeKey.value] ?? [])

const autocompleteSelectedOptions = computed<AvAutocompleteOption[]>({
  get: () => activeTypeAssociations.value.map(associateElementOptionToAutocompleteOption),
  set: (newOptions) => {
    selectionsByType.value = {
      ...selectionsByType.value,
      [activeTypeKey.value]: newOptions.map(autocompleteOptionToAssociateElementOption)
    }
  }
})

function onDeleteItem (itemId: string) {
  selectionsByType.value = {
    ...selectionsByType.value,
    [activeTypeKey.value]: activeTypeAssociations.value.filter(item => item.id !== itemId)
  }
}
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
      :items="activeTypeAssociations"
      :input-options="{ placeholder: activeConfig?.searchPlaceholder }"
      :loading="loading"
      :layout="layout"
      @delete="onDeleteItem"
    >
      <template #beforeSearch>
        <AssociateElementTypeSelect
          v-model:active-type-key="activeTypeKey"
          :type-configs="typeConfigs"
        />
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
