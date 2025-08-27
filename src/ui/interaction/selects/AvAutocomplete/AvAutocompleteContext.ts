import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { AvAutocompleteOption, AvAutocompleteProps } from './AvAutocomplete.types'

export interface AvAutocompleteContext<T extends AvAutocompleteOption = AvAutocompleteOption> {
  selectedItems: Ref<T[]>
  searchQuery: Ref<string>
  isOpen: Ref<boolean>
  props: AvAutocompleteProps<T>
  inputId: ComputedRef<string>
  handleBlur: (event: FocusEvent) => void
  getOptionId: (option: T) => string | number
  getDisplayLabel: (option: T) => string
}

export const AvAutocompleteContextKey: InjectionKey<AvAutocompleteContext> = Symbol('AvAutocompleteContext')

export function useAutocompleteContext<T extends AvAutocompleteOption = AvAutocompleteOption> (): AvAutocompleteContext<T> {
  const context = inject<AvAutocompleteContext<T>>(AvAutocompleteContextKey)

  if (!context) {
    throw new Error('useAutocompleteContext must be used within AvAutocomplete component')
  }
  return context
}
