import type { AssociationSearchResultDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'
import { ASSOCIATION_CATEGORY_LABEL_KEY_PREFIXES } from '@/common/associations/constants/association-type.constants'
import { useI18n } from 'vue-i18n'

/**
 * Maps the generic search results returned by the association API to the
 * associations displayed by the association pickers, resolving the category
 * of the searched context type into a translated description.
 */
export function useAssociationSearchResults () {
  const { t } = useI18n()

  const toAssociation = (searchResult: AssociationSearchResultDTO, contextType: EAssociationContextType): Association => {
    const labelKeyPrefix = ASSOCIATION_CATEGORY_LABEL_KEY_PREFIXES[contextType]

    return {
      id: searchResult.id,
      title: searchResult.title,
      disabled: searchResult.disabled,
      description: labelKeyPrefix && searchResult.category
        ? t(`${labelKeyPrefix}.${searchResult.category}`)
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
