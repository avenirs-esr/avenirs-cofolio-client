import type { AssociationSearchResultDTO, EAssociationContextType, PagedResponseAssociationSearchResultDTO, SearchForAssociationParams } from '@/api/avenir-esr'
import type { Association, AssociationSearchFilter } from '@/features/student/associations/types/associations.types'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { useSearchForAssociation, useSearchForAssociationWithNewElement } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import {
  ASSOCIATION_CONTEXT_CONFIGS,
  ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED,
  ASSOCIATION_SEARCH_PAGE_SIZE,
  DEFAULT_ASSOCIATION_SEARCH_FILTER
} from '@/features/student/associations/constants/associations.constants'
import { useToasterStore } from '@/store'
import { keepPreviousData } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export interface UseAssociationSearchOptions {
  contextType: EAssociationContextType
  /**
   * The element to associate, omitted when it does not exist yet (e.g. in a creation form).
   */
  elementId?: MaybeRefOrGetter<string>
  associatedContextType: EAssociationContextType
  searchQuery?: Ref<string>
  searchFilter?: Ref<AssociationSearchFilter>
  enabled?: MaybeRefOrGetter<boolean>
}

/**
 * Maps the generic search results returned by the association API to the associations
 * displayed by the association pickers, translating the category of the searched context type.
 */
export function useAssociationSearchResults () {
  const { t } = useI18n()

  const toAssociation = (searchResult: AssociationSearchResultDTO, contextType: EAssociationContextType): Association => {
    const { categoryLabelKeyPrefix } = ASSOCIATION_CONTEXT_CONFIGS[contextType]

    return {
      id: searchResult.id,
      title: searchResult.title,
      disabled: searchResult.disabled,
      category: searchResult.category,
      description: categoryLabelKeyPrefix && searchResult.category
        ? t(`${categoryLabelKeyPrefix}.${searchResult.category}`)
        : undefined
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
  enabled = true
}: UseAssociationSearchOptions) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { toAssociations } = useAssociationSearchResults()

  const isFilterable = !!ASSOCIATION_CONTEXT_CONFIGS[associatedContextType].filterable

  const params = computed<SearchForAssociationParams>(() => ({
    keyword: searchQuery.value.trim() || undefined,
    isAssociated: isFilterable ? ASSOCIATION_SEARCH_FILTER_IS_ASSOCIATED[searchFilter.value] : undefined,
    page: 0,
    pageSize: ASSOCIATION_SEARCH_PAGE_SIZE,
  }))

  const options = {
    query: {
      enabled: computed(() => toValue(enabled)),
      placeholderData: keepPreviousData,
      select: (response: PagedResponseAssociationSearchResultDTO) => toAssociations(response.data, associatedContextType)
    }
  }

  const { data, isFetching, isError, error } = elementId === undefined
    ? useSearchForAssociationWithNewElement(contextType, associatedContextType, params, options)
    : useSearchForAssociation(contextType, computed(() => toValue(elementId)), associatedContextType, params, options)

  watch(isError, (value) => {
    if (!value || !error.value) {
      return
    }

    addErrorMessage({
      title: t('global.error.generic'),
      description: getErrorMessage(error.value),
    })
  })

  const associations = computed<Association[]>(() => data.value ?? [])

  return {
    searchQuery,
    searchFilter,
    isFilterable,
    associations,
    isLoading: isFetching
  }
}
