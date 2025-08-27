import type { AvInputProps } from '@/ui/interaction/inputs/AvInput/AvInput.vue'
import type { AvListProps } from '@/ui/interaction/lists/AvList/AvList.vue'

export interface AvAutocompleteOption {
  label: string
  value: string | number
}

export interface AvAutocompleteProps<T extends AvAutocompleteOption = AvAutocompleteOption> {
  /**
   * ID of the input element
   */
  id?: string
  /**
   * Input-related options and configuration
   */
  inputOptions?: Omit<AvInputProps, 'id' | 'modelValue'>
  /**
   * Options available for selection
   */
  options?: T[]
  /**
   * Minimum number of characters to trigger search
   * @default 3
   */
  minChars?: number
  /**
   * Whether to allow multi-selection
   * @default true
   */
  multiSelect?: boolean
  /**
   * Function to get display text from option
   */
  getOptionLabel?: (option: T) => string
  /**
   * Function to get unique key from option
   */
  getOptionKey?: (option: T) => string | number
  /**
   * Function to filter options based on query
   */
  filterOptions?: (options: T[], query: string) => T[]
  /**
   * Width of the dropdown
   */
  dropdownWidth?: string
  /**
   * Maximum height of the dropdown
   */
  maxDropdownHeight?: string
  /**
   * Props to pass to the AvList component
   */
  listOptions?: AvListProps
  /**
   * CSS class to apply to the scrollbar
   */
  scrollbarClass?: string
  /**
   * CSS class to apply to the dropdown
   */
  dropdownClass?: string
  /**
   * Whether the component is in loading state
   */
  loading?: boolean
  /**
   * Debounce delay for search input in milliseconds
   * @default 300
   */
  debounceDelay?: number
  /**
   * Maximum number of results to display
   */
  maxResults?: number
  /**
   * Whether to enable pagination with scroll-to-bottom loading
   * @default false
   */
  enableLoadMore?: boolean
  /**
   * Whether to show the selected items section below the input
   * @default false
   */
  showSelectedSection?: boolean
  /**
   * Delay before closing dropdown when focus is lost (in milliseconds)
   * @default 150
   */
  blurCloseDelay?: number
  /**
   * Throttle delay for scroll-to-bottom load more (in milliseconds)
   * @default 200
   */
  loadMoreThrottleDelay?: number
  /**
   * Whether filtering is handled server-side (options prop already contains filtered results)
   * When true, client-side filtering is bypassed and options are used as-is
   * @default false
   */
  serverSideFiltering?: boolean
}

export enum DropdownState {
  LOADING = 'loading',
  TYPE_TO_SEARCH = 'type-to-search',
  NO_OPTIONS = 'no-options',
  HAS_OPTIONS = 'has-options'
}
