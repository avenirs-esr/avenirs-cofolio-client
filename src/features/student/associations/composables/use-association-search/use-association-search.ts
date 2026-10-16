import type { QueryKey } from '@tanstack/vue-query'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { AssociationSearchResultDTO, EAssociationContextType, PagedResponseAssociationSearchResultDTO, SearchForAssociationParams } from '@/api/avenir-esr'
import type { Association, AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSearchForAssociation, useSearchForAssociationWithNewElement } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useAssociationLimit } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { ASSOCIATION_CONTEXT_CONFIGS, ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED, ASSOCIATION_SEARCH_PAGE_SIZE, DEFAULT_ASSOCIATION_SEARCH_FILTER } from '@/features/student/associations/constants/associations.constants'
import { useToasterStore } from '@/store'

export interface UseAssociationSearchOptions {
  contextType: EAssociationContextType
  /**
   * The element to associate, omitted when it does not exist yet (e.g. in a creation form).
   */
  elementId?: MaybeRefOrGetter<string>
  associatedContextType: MaybeRefOrGetter<EAssociationContextType>
  searchQuery?: Ref<string>
  searchFilter?: Ref<AssociationSearchFilter>
  /**
   * Ids of the elements already selected. The element only accepts so many associations: once the
   * selection fills them, the other elements can no longer be selected, while the selected ones
   * can still be deselected.
   */
  selectedIds?: MaybeRefOrGetter<string[]>
  enabled?: MaybeRefOrGetter<boolean>
}

/**
 * Maps the generic search results returned by the association API to the associations
 * displayed by the association pickers, translating the category when a translation exists.
 */
export function useAssociationSearchResults () {
  const { t } = useI18n()

  const toAssociation = (searchResult: AssociationSearchResultDTO, contextType: EAssociationContextType): Association => {
    const { categoryLabelKeyPrefix } = ASSOCIATION_CONTEXT_CONFIGS[contextType]

    return {
      id: searchResult.id,
      title: searchResult.title,
      disabled: searchResult.disabled,
      limitReached: searchResult.limitReached,
      category: searchResult.category,
      description: searchResult.description ?? (categoryLabelKeyPrefix && searchResult.category
        ? t(`${categoryLabelKeyPrefix}.${searchResult.category}`)
        : searchResult.category)
    }
  }

  const toAssociations = (searchResults: AssociationSearchResultDTO[], contextType: EAssociationContextType): Association[] =>
    searchResults.map(searchResult => toAssociation(searchResult, contextType))

  return {
    toAssociation,
    toAssociations
  }
}

/**
 * Searches the elements of a context type that can be associated with an element,
 * whether this element already exists or not.
 */
export function useAssociationSearch ({
  contextType,
  elementId,
  associatedContextType,
  searchQuery = ref(''),
  searchFilter = ref(DEFAULT_ASSOCIATION_SEARCH_FILTER),
  selectedIds = [],
  enabled = true
}: UseAssociationSearchOptions) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { toAssociations } = useAssociationSearchResults()

  const currentAssociatedContextType = computed(() => toValue(associatedContextType))
  const isFilterable = computed(() => !!ASSOCIATION_CONTEXT_CONFIGS[currentAssociatedContextType.value].filterable)

  const { remaining } = useAssociationLimit({
    contextType,
    elementId,
    associatedContextType: currentAssociatedContextType,
    enabled
  })

  const params = computed<SearchForAssociationParams>(() => ({
    keyword: searchQuery.value.trim() || undefined,
    isAssociated: isFilterable.value ? ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED[searchFilter.value] : undefined,
    page: 0,
    pageSize: ASSOCIATION_SEARCH_PAGE_SIZE,
  }))

  const options = {
    query: {
      enabled: computed(() => toValue(enabled)),
      placeholderData: (previousData?: PagedResponseAssociationSearchResultDTO, previousQuery?: { queryKey: QueryKey }) =>
        previousQuery?.queryKey.includes(currentAssociatedContextType.value) ? previousData : undefined,
      select: (response: PagedResponseAssociationSearchResultDTO) => toAssociations(response.data, currentAssociatedContextType.value)
    }
  }

  const { data, isFetching, isError, error } = elementId === undefined
    ? useSearchForAssociationWithNewElement(contextType, currentAssociatedContextType, params, options)
    : useSearchForAssociation(contextType, computed(() => toValue(elementId)), currentAssociatedContextType, params, options)

  watch(isError, (value) => {
    if (!value || !error.value) {
      return
    }

    addErrorMessage({
      title: t('global.error.generic'),
      description: getErrorMessage(error.value),
    })
  })

  function getDisabledTooltip (association: Association, isBlockedBySelection: boolean) {
    if (association.limitReached) {
      return t('student.associations.composables.useAssociationSearch.limitReachedTooltip')
    }

    if (!association.disabled && isBlockedBySelection) {
      return t('student.associations.composables.useAssociationSearch.selectionLimitReachedTooltip')
    }

    return t('student.associations.composables.useAssociationSearch.disabledTooltip')
  }

  const associations = computed<Association[]>(() => {
    const selected = new Set(toValue(selectedIds))
    const isSelectionFull = selected.size >= remaining.value

    return (data.value ?? []).map((association) => {
      const isBlockedBySelection = isSelectionFull && !selected.has(association.id)

      return {
        ...association,
        disabled: association.disabled || isBlockedBySelection,
        disabledTooltip: getDisabledTooltip(association, isBlockedBySelection)
      }
    })
  })

  return {
    searchQuery,
    searchFilter,
    isFilterable,
    associations,
    isLoading: isFetching
  }
}
