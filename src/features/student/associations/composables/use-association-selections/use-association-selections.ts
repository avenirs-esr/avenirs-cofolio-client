import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationSelections } from '@/features/student/associations/types/associations.types'
import { useAssociate } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { invalidateAssociationQueries } from '@/features/student/associations/queries/associations.queries'
import { isAssociable } from '@/features/student/associations/utils/associations.utils'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export type IdsToAssociate = Partial<Record<EAssociationContextType, string[]>>

/**
 * Handles the elements selected to be associated with an element of the given context type
 * before it exists, as done by the creation forms.
 */
export function useAssociationSelections (contextType: EAssociationContextType) {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()

  const { mutateAsync: mutateAssociate, isPending: isAssociating } = useAssociate()

  /**
   * Returns the ids of the selected elements, grouped by context type, ignoring the empty or non associable selections.
   */
  function getIdsToAssociate (selections: AssociationSelections = {}): IdsToAssociate {
    return Object.fromEntries(
      (Object.entries(selections) as [EAssociationContextType, AssociationSelections[EAssociationContextType]][])
        .filter(([associatedContextType, associations]) =>
          !!associations?.length && isAssociable(contextType, associatedContextType))
        .map(([associatedContextType, associations]) => [associatedContextType, associations!.map(({ id }) => id)])
    )
  }

  /**
   * Associates the selected elements to the element, sending one request per context type.
   */
  async function associateSelections (elementId: string, selections?: AssociationSelections): Promise<PromiseSettledResult<AssociationsDTO>[]> {
    const idsToAssociate = Object.entries(getIdsToAssociate(selections)) as [EAssociationContextType, string[]][]

    if (idsToAssociate.length === 0) {
      return []
    }

    const results = await Promise.allSettled(idsToAssociate.map(([associatedContextType, ids]) => mutateAssociate({
      contextType,
      elementId,
      associatedContextType,
      data: { idsToAssociate: ids }
    })))

    await invalidateAssociationQueries(queryClient, [contextType, ...idsToAssociate.map(([associatedContextType]) => associatedContextType)])

    return results
  }

  /**
   * Displays an error message for each association request that failed.
   */
  function notifyAssociationErrors (results: PromiseSettledResult<AssociationsDTO>[]) {
    results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .forEach(({ reason }) => addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(reason as BaseApiException),
      }))
  }

  return {
    getIdsToAssociate,
    associateSelections,
    notifyAssociationErrors,
    isAssociating
  }
}
