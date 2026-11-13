<script lang="ts" setup>
import type { BaseApiException } from '@avenirs-esr/shared'
import { ConfirmationModal, useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import {
  EActivityStatus,
  getGetDeclaredActivityDetailsQueryKey,
  invalidateGetActivitiesView,
  invalidateGetActivityPresentation,
  invalidateGetDeclaredActivitiesView,
  useDeleteActivity,
} from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { I18nT, useI18n } from 'vue-i18n'
import { useToasterStore } from '@/store'

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
      queryClient.removeQueries({ queryKey: getGetDeclaredActivityDetailsQueryKey(declaredActivityId) })
      await withTaskLoading(() => Promise.all([
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
    data-testid="delete-my-activity-confirm-modal"
    @close="$emit('cancel')"
    @confirm="deleteMyActivity"
  >
    <template #description>
      <I18nT
        keypath="student.activities.views.ActivityView.DeleteMyActivityConfirmModal.title"
        scope="global"
        tag="span"
      >
        <template #activityTitle>
          <span class="av-text-bold">{{ activityTitle }}</span>
        </template>
      </I18nT>
    </template>
  </ConfirmationModal>
</template>
