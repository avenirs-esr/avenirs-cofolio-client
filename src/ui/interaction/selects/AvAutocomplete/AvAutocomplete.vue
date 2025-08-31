<script setup lang="ts" generic="T extends AvAutocompleteOption = AvAutocompleteOption">
import type { Slot } from 'vue'
import type { AvAutocompleteOption, AvAutocompleteProps } from './AvAutocomplete.types'
import { type AvAutocompleteContext, AvAutocompleteContextKey } from './AvAutocompleteContext'
import AvAutocompleteDropdown from './AvAutocompleteDropdown.vue'
import AvAutocompleteInput from './AvAutocompleteInput.vue'
import AvAutocompleteSelectedTags from './AvAutocompleteSelectedTags.vue'

const props = withDefaults(defineProps<AvAutocompleteProps<T>>(), {
  inputOptions: () => ({}),
  multiSelect: false,
  dropdownWidth: '100%',
  maxDropdownHeight: '20rem',
  listOptions: () => ({
    size: 'small',
    ariaLabel: 'Available options list'
  }),
  scrollbarClass: 'av-autocomplete__scrollbar--default',
  dropdownClass: 'av-autocomplete__dropdown--default',
  loading: false,
  debounceDelay: 300,
  enableLoadMore: false,
  showSelectedSection: false,
  blurCloseDelay: 150,
  loadMoreThrottleDelay: 200,
  serverSideFiltering: false
})

const emit = defineEmits<{
  /**
   * Emitted when user searches for options.
   * @param e emitted event name: search
   * @param query Search query string entered by the user.
   */
  (e: 'search', query: string): void
  /**
   * Emitted when more options should be loaded (infinite scroll).
   */
  (e: 'loadMore'): void
  /**
   * Emitted when the selection is cleared.
   */
  (e: 'clear'): void
}>()

const slots = defineSlots<{
  /**
   * Slot for displaying a required field tip in the input.
   */
  requiredTip?: () => Slot
  /**
   * Slot for customizing how each option is displayed in the dropdown.
   * @param option The option object being rendered
   * @param isSelected Whether the option is currently selected
   * @param toggle Function to toggle the option's selected state
   */
  item?: Slot<{ option: T, isSelected: boolean, toggle: () => void }>
  /**
   * Slot for customizing how selected items are displayed as tags.
   * @param option The selected option object
   * @param remove Function to remove this option from selection
   */
  selectedItem?: Slot<{ option: T, remove: () => void }>
  /**
   * Slot for customizing the empty state when no options match the search.
   */
  empty?: Slot
}>()

const selectedItems = defineModel<T[]>({ default: () => [] })

const isOpen = ref(false)
const searchQuery = ref('')
const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef')
const inputRef = useTemplateRef<{ inputRef?: HTMLElement, dropdownRef?: HTMLElement }>('inputRef')
const dropdownRef = useTemplateRef<{ dropdownRef?: HTMLElement }>('dropdownRef')

const inputId = computed(() => props.id || `av-autocomplete-${crypto.randomUUID()}`)
function handleSearch (query: string) {
  searchQuery.value = query
  emit('search', query)
}

function handleBlur (event: FocusEvent) {
  if (dropdownRef.value?.dropdownRef?.contains(event.relatedTarget as Node)) {
    return
  }

  setTimeout(() => {
    isOpen.value = false
  }, props.blurCloseDelay)
}

function getOptionId (option: T): string | number {
  return props.getOptionKey ? props.getOptionKey(option) : option.value
}

function getDisplayLabel (option: T): string {
  return props.getOptionLabel ? props.getOptionLabel(option) : option.label
}

const context: AvAutocompleteContext<T> = {
  selectedItems,
  searchQuery,
  isOpen,
  props,
  inputId,
  handleBlur,
  getOptionId,
  getDisplayLabel
}

provide<AvAutocompleteContext<T>>(AvAutocompleteContextKey, context)

function handleClickOutside (event: MouseEvent) {
  const target = event.target as HTMLElement
  const inputElement = inputRef.value?.inputRef

  if (
    !(inputElement as HTMLElement)?.contains?.(target)
    && !wrapperRef.value?.contains(target)
    && !dropdownRef.value?.dropdownRef?.contains(target)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="av-autocomplete">
    <div
      ref="wrapperRef"
      class="av-autocomplete__wrapper"
    >
      <AvAutocompleteInput
        ref="inputRef"
        @search="handleSearch"
        @clear="emit('clear')"
      >
        <template
          v-if="slots.requiredTip"
          #requiredTip
        >
          <component :is="slots.requiredTip" />
        </template>
      </AvAutocompleteInput>

      <AvAutocompleteDropdown
        ref="dropdownRef"
        @load-more="emit('loadMore')"
      >
        <template
          v-if="slots.item"
          #item="{ option, isSelected, toggle }"
        >
          <slot
            name="item"
            :option="(option as T)"
            :is-selected="isSelected"
            :toggle="toggle"
          />
        </template>
        <template
          v-if="slots.empty"
          #empty
        >
          <slot name="empty" />
        </template>
      </AvAutocompleteDropdown>
    </div>

    <AvAutocompleteSelectedTags>
      <template
        v-if="slots.selectedItem"
        #selectedItem="{ option, remove }"
      >
        <slot
          name="selectedItem"
          :option="(option) as T"
          :remove="remove"
        />
      </template>
    </AvAutocompleteSelectedTags>
  </div>
</template>

<style lang="scss" scoped>
.av-autocomplete {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  position: relative;
}

.av-autocomplete__wrapper {
  position: relative;
}
</style>
