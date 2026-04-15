<script setup lang="ts">
import type { AssociateElementOption, AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { IdTitle } from '@/types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import AssociateElementTypeSelect from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociationElementTypeSelect/AssociateElementTypeSelect.vue'

export interface AssociateElementsDrawerSectionProps {
  typeConfigs: AssociateElementTypeConfig[]
  options: AssociateElementOption[]
  loading?: boolean
}

const { typeConfigs, options, loading } = defineProps<AssociateElementsDrawerSectionProps>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'typeChange', typeKey: string): void
}>()

const selectionsByType = defineModel<Record<string, IdTitle[]>>('selectionsByType', { default: () => ({}) })

const activeTypeKey = ref<string>(typeConfigs[0]?.key ?? '')

const selectedOptionsByType = ref<Record<string, AvAutocompleteOption[]>>({})

const activeConfig = computed(() =>
  typeConfigs.find(config => config.key === activeTypeKey.value) ?? typeConfigs[0]
)

const autocompleteOptions = computed<AvAutocompleteOption[]>(() =>
  options.map(option => ({
    label: option.title,
    value: option.id,
    description: option.description,
    disabled: option.disabled
  }))
)

const selectedOptions = computed({
  get: (): AvAutocompleteOption[] => selectedOptionsByType.value[activeTypeKey.value] ?? [],
  set: (newOptions: AvAutocompleteOption[]) => {
    selectedOptionsByType.value = {
      ...selectedOptionsByType.value,
      [activeTypeKey.value]: newOptions
    }
  }
})

const selectedItems = computed<IdTitle[]>(() =>
  selectedOptions.value.map(option => ({
    id: option.value.toString(),
    title: option.label,
    description: option.description
  }))
)

function onTypeChange (typeKey: string) {
  activeTypeKey.value = typeKey
  emit('typeChange', typeKey)
}

function onDeleteItem (itemId: string) {
  const current = selectedOptionsByType.value[activeTypeKey.value] ?? []
  selectedOptionsByType.value = {
    ...selectedOptionsByType.value,
    [activeTypeKey.value]: current.filter(option => option.value !== itemId)
  }
}

watch(selectedOptionsByType, () => {
  const updated: Record<string, IdTitle[]> = {}
  for (const [typeKey, opts] of Object.entries(selectedOptionsByType.value)) {
    updated[typeKey] = opts.map(option => ({
      id: option.value.toString(),
      title: option.label,
      description: option.description
    }))
  }
  selectionsByType.value = updated
}, { deep: true })
</script>

<template>
  <div
    class="associate-elements-drawer-section"
    data-testid="associate-elements-drawer-section"
  >
    <SearchAssociationLayout
      v-model="selectedOptions"
      :options="autocompleteOptions"
      :items="selectedItems"
      :input-options="{ placeholder: activeConfig?.searchPlaceholder }"
      :loading="loading"
      @search="emit('search', $event)"
      @delete="onDeleteItem"
    >
      <template #beforeSearch>
        <AssociateElementTypeSelect
          :type-configs="typeConfigs"
          @type-change="onTypeChange"
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
