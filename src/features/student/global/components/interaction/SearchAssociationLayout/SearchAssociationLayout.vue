<script setup lang="ts" generic="T extends AvAutocompleteOption">
import type { IdTitle, IdTitleList } from '@/types'
import type { AvAutocompleteOption, AvInputProps } from '@avenirs-esr/avenirs-dsav'
import SelectedAssociateItemsContainer
  from '@/features/student/global/components/cards/SelectedAssociateItemsContainer/SelectedAssociateItemsContainer.vue'
import { AvAutocomplete } from '@avenirs-esr/avenirs-dsav'

interface SearchAssociationLayoutProps<T> {
  options: T[]
  items: IdTitleList
  inputOptions?: Omit<AvInputProps, 'id' | 'modelValue'>
  getOptionKey?: (option: T) => string | number
  getOptionLabel?: (option: T) => string
  loading?: boolean
}

const props = defineProps<SearchAssociationLayoutProps<T>>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'delete', itemId: string): void
  (e: 'clear'): void
  (e: 'loadMore'): void
}>()

defineSlots<{
  beforeSearch?: () => unknown
  selectedItem?: (props: { item: IdTitle }) => unknown
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
        :loading="props.loading"
        @search="emit('search', $event)"
        @clear="emit('clear')"
        @load-more="emit('loadMore')"
      />
    </div>

    <div
      class="av-flex-fill av-col av-gap-sm"
      data-testid="search-association-layout-selected"
    >
      <SelectedAssociateItemsContainer
        :items="props.items"
        @delete="emit('delete', $event)"
      >
        <template #item="{ item }">
          <slot
            name="selectedItem"
            :item="item"
          />
        </template>
      </SelectedAssociateItemsContainer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-association-layout {
  height: 32rem;
}
</style>
