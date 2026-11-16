import type { BaseApiException } from '@avenirs-esr/shared'
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import { useAssociate, useUnassociate } from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { invalidateAssociationQueries } from '@/features/student/associations/queries/associations.queries'
import { useToasterStore } from '@/store'

interface AssociationMutationVariables {
  contextType: EAssociationContextType
  elementId: string
  associatedContextType: EAssociationContextType
  withToasts?: boolean
}

export interface AssociateVariables extends AssociationMutationVariables {
  idsToAssociate: string[]
}

export interface UnassociateVariables extends AssociationMutationVariables {
  associationIds: string[]
}

/**
 * Associates or unassociates elements, then refreshes the impacted queries and notifies the student.
 */
export function useAssociationMutations () {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()
  const { isLoading: isRefreshing, withTaskLoading } = useTaskLoading()

  const { mutate: mutateAssociate, isPending: isAssociatePending } = useAssociate()
  const { mutate: mutateUnassociate, isPending: isUnassociatePending } = useUnassociate()

  function onError (error: BaseApiException, withToasts = true) {
    if (withToasts) {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    }
  }

  function refresh ({ contextType, associatedContextType }: AssociationMutationVariables) {
    return withTaskLoading(() => invalidateAssociationQueries(queryClient, [contextType, associatedContextType]))
  }

  function associate (variables: AssociateVariables, onSuccess?: () => void) {
    const { contextType, elementId, associatedContextType, idsToAssociate, withToasts = true } = variables

    mutateAssociate({ contextType, elementId, associatedContextType, data: { idsToAssociate } }, {
      onError: error => onError(error, withToasts),
      onSuccess: async () => {
        await refresh(variables)

        if (withToasts) {
          addSuccessMessage({
            timeout: 2000,
            description: t(`student.associations.contextTypes.${associatedContextType}.associateSuccess`, { count: idsToAssociate.length }),
          })
        }

        onSuccess?.()
      }
    })
  }

  function unassociate (variables: UnassociateVariables, onSuccess?: () => void) {
    const { contextType, elementId, associationIds, withToasts = true } = variables

    mutateUnassociate({ contextType, elementId, data: { idsToDelete: associationIds } }, {
      onError: error => onError(error, withToasts),
      onSuccess: async () => {
        await refresh(variables)

        onSuccess?.()
      }
    })
  }

  const isPending = computed(() => isAssociatePending.value || isUnassociatePending.value || isRefreshing.value)

  return {
    associate,
    unassociate,
    isPending
  }
}
