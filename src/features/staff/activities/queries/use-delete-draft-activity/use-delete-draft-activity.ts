import { invalidateGetStaffActivityWorkingSpace, useDeleteActivityDraft } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useDeleteDraftActivity (options?: {
  onSuccess?: () => void
}) {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { mutate } = useDeleteActivityDraft()
  const { addSuccessMessage, addErrorMessage } = useToasterStore()
  const { getErrorMessage } = useApiErrors()

  function deleteDraftActivity (activityId: string) {
    mutate({ activityDraftId: activityId }, {
      onSuccess: async () => {
        addSuccessMessage(t('staff.activities.modals.DeleteDraftActivityConfirmationModal.deleteSuccess'))
        await invalidateGetStaffActivityWorkingSpace(queryClient)
        options?.onSuccess?.()
      },
      onError: (error) => {
        addErrorMessage({
          title: t('staff.activities.modals.DeleteDraftActivityConfirmationModal.deleteError'),
          description: getErrorMessage(error),
        })
      },
    })
  }

  return { deleteDraftActivity }
}
