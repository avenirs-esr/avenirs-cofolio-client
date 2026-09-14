<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import {
  EActivityStatus,
  invalidateGetActivitiesView,
  invalidateGetActivityPresentation,
  invalidateGetDeclaredActivitiesView,
  invalidateGetDeclaredActivityDetails,
  useDeleteActivity,
} from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteMyActivityConfirmModalProps {
  opened: boolean
  declaredActivityId: string
  activityId: string
  activityTitle: string
}

const {
  opened,
  declaredActivityId,
  activityId,
  activityTitle
} = defineProps<DeleteMyActivityConfirmModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: deleteActivity, isPending } = useDeleteActivity({
  mutation: {
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredActivityDetails(queryClient, declaredActivityId),
        invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, activityId),
        invalidateGetDeclaredActivitiesView(queryClient),
        invalidateGetActivitiesView(queryClient)
      ]))

      addSuccessMessage(t('student.activities.views.ActivityView.DeleteMyActivityConfirmModal.success'))
      emit('deleted')
    },
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    }
  }
})

function deleteMyActivity () {
  deleteActivity({ declaredActivityId })
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :is-loading="isPending || isLoading"
    :title="activityTitle"
    :description="t('student.activities.views.ActivityView.DeleteMyActivityConfirmModal.title', { activityTitle })"
    data-testid="delete-my-activity-confirm-modal"
    @close="$emit('cancel')"
    @confirm="deleteMyActivity"
  />
</template>
