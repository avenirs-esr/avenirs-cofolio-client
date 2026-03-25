<script setup lang="ts" generic="T extends AvAutocompleteOption">
import type { IdTitleList } from '@/types'
import type { AvAutocompleteOption, AvInputProps } from '@avenirs-esr/avenirs-dsav'
import SelectedAssociateTracesContainer from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/SelectedAssociateTracesContainer/SelectedAssociateTracesContainer.vue'
import { AvAutocomplete } from '@avenirs-esr/avenirs-dsav'

interface SearchAssociationLayoutProps<T> {
  options: T[]
  traces: IdTitleList
  inputOptions?: Omit<AvInputProps, 'id' | 'modelValue'>
  getOptionKey?: (option: T) => string | number
  getOptionLabel?: (option: T) => string
}

const props = defineProps<SearchAssociationLayoutProps<T>>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'delete', traceId: string): void
  (e: 'clear'): void
  (e: 'loadMore'): void
}>()

const selectedOptions = defineModel<T[]>({ default: () => [] })
</script>

<template>
  <div
    class="search-association-layout av-col av-row--md av-align-stretch--md av-gap-sm"
    data-testid="search-association-layout"
  >
    <div
      class="av-flex-fill av-col av-gap-sm"
      data-testid="search-association-layout-search"
    >
      <slot name="beforeSearch" />

      <AvAutocomplete
        v-model="selectedOptions"
        :options="props.options"
        :input-options="props.inputOptions"
        :get-option-key="props.getOptionKey"
        :get-option-label="props.getOptionLabel"
        :multi-select="true"
        :show-selected-section="false"
        :display-selection-in-input="false"
        @search="emit('search', $event)"
        @clear="emit('clear')"
        @load-more="emit('loadMore')"
      />
    </div>

    <div
      class="av-flex-fill av-col av-gap-sm"
      data-testid="search-association-layout-selected"
    >
      <SelectedAssociateTracesContainer
        :traces="props.traces"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-association-layout {
  height: 32rem;
}
</style>
