import type { EAssociationContextType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useAssociate, useUnassociate } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { invalidateAssociationQueries } from '@/features/student/associations/queries/associations.queries'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

interface AssociationMutationVariables {
  contextType: EAssociationContextType
  elementId: string
  associatedContextType: EAssociationContextType
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

  function onError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.error.generic'),
      description: getErrorMessage(error),
    })
  }

  function refresh ({ contextType, associatedContextType }: AssociationMutationVariables) {
    return withTaskLoading(() => invalidateAssociationQueries(queryClient, [contextType, associatedContextType]))
  }

  function associate (variables: AssociateVariables, onSuccess?: () => void) {
    const { contextType, elementId, associatedContextType, idsToAssociate } = variables

    mutateAssociate({ contextType, elementId, associatedContextType, data: { idsToAssociate } }, {
      onError,
      onSuccess: async () => {
        await refresh(variables)

        addSuccessMessage({
          timeout: 2000,
          description: t(`student.associations.contextTypes.${associatedContextType}.associateSuccess`, { count: idsToAssociate.length }),
        })

        onSuccess?.()
      }
    })
  }

  function unassociate (variables: UnassociateVariables, onSuccess?: () => void) {
    const { contextType, elementId, associationIds } = variables

    mutateUnassociate({ contextType, elementId, data: { idsToDelete: associationIds } }, {
      onError,
      onSuccess: async () => {
        await refresh(variables)

        addSuccessMessage({
          timeout: 2000,
          description: t('student.associations.overlays.modals.DeleteAssociationsModal.success', { count: associationIds.length }),
        })

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
