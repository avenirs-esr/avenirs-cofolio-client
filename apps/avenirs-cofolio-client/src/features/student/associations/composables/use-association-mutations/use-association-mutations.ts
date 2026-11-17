import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { BaseApiException, useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
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

  const { mutateAsync: mutateAssociateAsync, isPending: isAssociatePending } = useAssociate()
  const { mutateAsync: mutateUnassociateAsync, isPending: isUnassociatePending } = useUnassociate()

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

  async function associateAsync (variables: AssociateVariables) {
    const { contextType, elementId, associatedContextType, idsToAssociate, withToasts } = variables
    try {
      await mutateAssociateAsync({ contextType, elementId, associatedContextType, data: { idsToAssociate } })
    }
    catch (error) {
      if (error instanceof BaseApiException) {
        onError(error, withToasts)
      }
      throw error
    }
    await refresh(variables)
    if (withToasts !== false) {
      addSuccessMessage({
        timeout: 2000,
        description: t(`student.associations.contextTypes.${associatedContextType}.associateSuccess`, { count: idsToAssociate.length }),
      })
    }
  }

  async function unassociateAsync (variables: UnassociateVariables) {
    const { contextType, elementId, associationIds, withToasts } = variables
    try {
      await mutateUnassociateAsync({ contextType, elementId, data: { idsToDelete: associationIds } })
    }
    catch (error) {
      if (error instanceof BaseApiException) {
        onError(error, withToasts)
      }
      throw error
    }
    await refresh(variables)
  }

  const isPending = computed(() => isAssociatePending.value || isUnassociatePending.value || isRefreshing.value)

  return {
    associateAsync,
    unassociateAsync,
    isPending
  }
}
