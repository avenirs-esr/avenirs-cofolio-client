<script setup lang="ts" generic="T extends AvAutocompleteOption, U extends IdTitle = IdTitle">
import type { IdTitle } from '@/types'
import type { AvAutocompleteOption, AvButtonProps, AvInputProps } from '@avenirs-esr/avenirs-dsav'
import SelectedAssociateItemsContainer
  from '@/features/student/global/components/cards/SelectedAssociateItemsContainer/SelectedAssociateItemsContainer.vue'
import { AvAutocomplete } from '@avenirs-esr/avenirs-dsav'

interface SearchAssociationLayoutProps<T extends AvAutocompleteOption, U extends IdTitle = IdTitle> {
  options: T[]
  items: U[]
  inputOptions?: Omit<AvInputProps, 'id' | 'modelValue'>
  getOptionKey?: (option: T) => string | number
  getOptionLabel?: (option: T) => string
  loading?: boolean
  buttonTheme?: AvButtonProps['theme']
}

const props = defineProps<SearchAssociationLayoutProps<T, U>>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'delete', itemId: string): void
  (e: 'clear'): void
  (e: 'loadMore'): void
}>()

defineSlots<{
  beforeSearch?: () => unknown
  selectedItem?: (props: { item: U }) => unknown
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
        :button-theme="props.buttonTheme"
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
