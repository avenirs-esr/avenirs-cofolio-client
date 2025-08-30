<script setup lang="ts" generic="T extends AvAutocompleteOption = AvAutocompleteOption">
import type { Slot } from 'vue'
import { MDI_ICONS } from '@/ui'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import AvList from '@/ui/interaction/lists/AvList/AvList.vue'
import AvListItem from '@/ui/interaction/lists/AvListItem/AvListItem.vue'
import { useScroll } from '@vueuse/core'
import { debounce } from 'lodash-es'
import { type AvAutocompleteOption, DropdownState } from './AvAutocomplete.types'
import { useAutocompleteContext } from './AvAutocompleteContext'

const emit = defineEmits<{
  loadMore: []
}>()

const slots = defineSlots<{
  item?: Slot<{ option: T, isSelected: boolean, toggle: () => void }>
  empty?: Slot
}>()

const {
  selectedItems,
  searchQuery,
  isOpen,
  props,
  getOptionId,
  getDisplayLabel
} = useAutocompleteContext<T>()

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')
const listRef = useTemplateRef<HTMLElement>('listRef')
const filteredOptions = computed(() => {
  if (!props.options) {
    return []
  }

  if (props.serverSideFiltering) {
    return props.maxResults ? props.options.slice(0, props.maxResults) : props.options
  }

  const query = searchQuery.value.toLowerCase().trim()

  if (!query) {
    const allOptions = props.options
    return props.maxResults ? allOptions.slice(0, props.maxResults) : allOptions
  }

  let filtered: T[]
  if (props.filterOptions) {
    filtered = props.filterOptions(props.options, query)
  }
  else {
    filtered = props.options.filter((option: T) => {
      const label = getDisplayLabel(option).toLowerCase()
      return label.includes(query)
    })
  }

  return props.maxResults ? filtered.slice(0, props.maxResults) : filtered
})

const dropdownState = computed(() => {
  if (props.loading) {
    return DropdownState.LOADING
  }

  if (isOpen.value && props.options && props.options.length > 0) {
    if (filteredOptions.value.length > 0) {
      return DropdownState.HAS_OPTIONS
    }

    return DropdownState.NO_OPTIONS
  }

  if (!props.options || props.options.length === 0) {
    return DropdownState.TYPE_TO_SEARCH
  }

  return DropdownState.TYPE_TO_SEARCH
})

function isSelected (option: T): boolean {
  return selectedItems.value.some((selected: T) =>
    getOptionId(selected) === getOptionId(option)
  )
}

function toggleOption (option: T) {
  if (!props.multiSelect) {
    selectedItems.value = [option]
    isOpen.value = false
    searchQuery.value = ''
    return
  }

  const currentSelection = selectedItems.value
  const optionId = getOptionId(option)
  const isCurrentlySelected = currentSelection.some(
    (selected: T) => getOptionId(selected) === optionId
  )

  if (isCurrentlySelected) {
    selectedItems.value = currentSelection.filter(
      (selected: T) => getOptionId(selected) !== optionId
    )
  }
  else {
    selectedItems.value = [...currentSelection, option]
  }
}

const { arrivedState } = useScroll(listRef, {
  throttle: 100
})

const throttledLoadMore = debounce(() => {
  emit('loadMore')
}, props.loadMoreThrottleDelay)

watch(() => arrivedState.bottom, (hasArrivedBottom) => {
  if (props.enableLoadMore && hasArrivedBottom && isOpen.value) {
    throttledLoadMore()
  }
})

onUnmounted(() => {
  throttledLoadMore.cancel()
})

defineExpose({
  dropdownRef
})
</script>

<template>
  <div
    v-if="isOpen"
    ref="dropdownRef"
    class="av-autocomplete-dropdown"
    :class="props.dropdownClass"
    :style="{ width: props.dropdownWidth, maxHeight: props.maxDropdownHeight }"
  >
    <div
      v-if="dropdownState === DropdownState.LOADING"
      class="av-autocomplete-dropdown__loading"
    >
      <AvVIcon
        :name="MDI_ICONS.LOADING_OUTLINE"
        :size="1.5"
        class="av-autocomplete-dropdown__spinner"
      />
      <span class="av-autocomplete-dropdown__loading-text">Loading...</span>
    </div>

    <div
      v-else-if="dropdownState === DropdownState.TYPE_TO_SEARCH"
      class="av-autocomplete-dropdown__empty"
    >
      <div class="av-autocomplete-dropdown__empty-text">
        Start typing to search
      </div>
    </div>

    <div
      v-else-if="dropdownState === DropdownState.NO_OPTIONS"
      class="av-autocomplete-dropdown__empty"
    >
      <slot
        v-if="slots.empty"
        name="empty"
      />
      <div
        v-else
        class="av-autocomplete-dropdown__empty-text"
      >
        No results found
      </div>
    </div>

    <AvList
      v-else
      ref="listRef"
      v-bind="props.listOptions"
      class="av-autocomplete-dropdown__options"
      :class="props.scrollbarClass"
    >
      <template
        v-for="option in filteredOptions"
        :key="getOptionId(option)"
      >
        <slot
          v-if="slots.item"
          name="item"
          :option="option"
          :is-selected="isSelected(option)"
          :toggle="() => toggleOption(option)"
        />
        <AvListItem
          v-else
          :title="getDisplayLabel(option)"
          :icon="isSelected(option) ? MDI_ICONS.CHECK : undefined"
          :selected="isSelected(option)"
          clickable
          :on-click="() => toggleOption(option)"
          hover-background-color="var(--light-background-neutral)"
          color-on-hover="var(--base)"
        />
      </template>
    </AvList>
  </div>
</template>

<style lang="scss" scoped>
.av-autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background-color: var(--other-background-base);
  border: 1px solid var(--dark-background-primary1);
  border-radius: var(--radius-lg);
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
  margin-top: var(--spacing-xxxs);
  overflow: hidden;
}

.av-autocomplete-dropdown__options {
  max-height: inherit;
  overflow-y: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--divider);
    border-radius: var(--radius-sm);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--text2);
  }
}

.av-autocomplete-dropdown__empty {
  padding: var(--spacing-md);
  text-align: center;
}

.av-autocomplete-dropdown__empty-text {
  font-size: 0.875rem;
  font-weight: 300;
  color: var(--text2);
}

.av-autocomplete-dropdown__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  color: var(--text2);
}

.av-autocomplete-dropdown__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.av-autocomplete-dropdown__loading-text {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--text2);
}
</style>

<style lang="scss">
.av-autocomplete__scrollbar--default {
  scrollbar-color: var(--light-foreground-primary1) var(--light-background-primary1);

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-track {
    background: var(--light-background-primary1);
    border-radius: var(--radius-sm);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--light-foreground-primary1);
    border-radius: var(--radius-sm);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--dark-background-primary1);
  }
}
</style>
