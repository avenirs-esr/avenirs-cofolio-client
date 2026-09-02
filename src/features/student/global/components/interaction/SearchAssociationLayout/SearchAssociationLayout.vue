<script setup lang="ts" generic="T extends AvAutocompleteOption, U extends IdTitle = IdTitle">
import type { IdTitle } from '@/types'
import type { AvAutocompleteOption, AvButtonProps, AvInputProps } from '@avenirs-esr/avenirs-dsav'
import Autocomplete from '@/common/components/interaction/selects/Autocomplete/Autocomplete.vue'
import SelectedAssociateItemsContainer
  from '@/features/student/global/components/cards/SelectedAssociateItemsContainer/SelectedAssociateItemsContainer.vue'

export interface SearchAssociationLayoutProps<T extends AvAutocompleteOption, U extends IdTitle = IdTitle> {
  options: T[]
  items: U[]
  inputOptions?: Omit<AvInputProps, 'id' | 'modelValue'>
  getOptionKey?: (option: T) => string | number
  getOptionLabel?: (option: T) => string
  loading?: boolean
  buttonTheme?: AvButtonProps['theme']
  layout?: 'vertical' | 'horizontal'
  itemsTitleMaxLines?: number
}

const { layout = 'horizontal', itemsTitleMaxLines = 2 } = defineProps<SearchAssociationLayoutProps<T, U>>()

const emit = defineEmits<{
  (e: 'delete', itemId: string): void
  (e: 'clear'): void
  (e: 'clearSelection'): void
  (e: 'loadMore'): void
}>()

defineSlots<{
  beforeSearch?: () => unknown
  selectedItem?: (props: { item: U }) => unknown
}>()

const selectedOptions = defineModel<T[]>({ default: () => [] })
const search = defineModel<string>('search', { default: '' })
</script>

<template>
  <div
    class="search-association-layout av-col av-gap-sm"
    :class="{
      'av-row--md av-align-stretch--md': layout === 'horizontal',
    }"
    data-testid="search-association-layout"
  >
    <div
      class="av-col av-gap-sm"
      :class="{
        'av-flex-fill': layout === 'horizontal',
      }"
      data-testid="search-association-layout-search"
    >
      <slot name="beforeSearch" />

      <Autocomplete
        v-model="selectedOptions"
        v-model:search="search"
        :options="options"
        :input-options="inputOptions"
        :get-option-key="getOptionKey"
        :get-option-label="getOptionLabel"
        :multi-select="true"
        :show-selected-section="false"
        :display-selection-in-input="false"
        :loading="loading"
        :items-title-max-lines="itemsTitleMaxLines"
        @clear="emit('clear')"
        @clear-selection="emit('clearSelection')"
        @load-more="emit('loadMore')"
      />
    </div>

    <div
      class="av-flex-fill av-col av-gap-sm"
      data-testid="search-association-layout-selected"
    >
      <SelectedAssociateItemsContainer
        :items="items"
        :button-theme="buttonTheme"
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
