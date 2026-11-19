<script lang="ts" setup>
import type { BaseApiException } from '@avenirs-esr/shared'
import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { ConfirmationModal, useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import {
  EActivityStatus,
  invalidateGetActivityContent,
  invalidateGetActivityPresentation,
  useDeleteSubActivityDraft
} from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useToasterStore } from '@/store'

export interface ConfirmDeleteSubActivitiesModalProps {
  opened: boolean
  activityDraftId: string
  subActivities: SubActivityOverviewDTO[]
}

const {
  opened,
  activityDraftId,
  subActivities,
} = defineProps<ConfirmDeleteSubActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { mutateAsync: deleteSubActivityDraft } = useDeleteSubActivityDraft()

async function deleteSubActivitiesOneByOne (subActivitiesToDelete: SubActivityOverviewDTO[]) {
  try {
    for (const { id: subActivityId } of subActivitiesToDelete) {
      await deleteSubActivityDraft({ activityDraftId, subActivityId })
    }
  }
  finally {
    await Promise.all([
      invalidateGetActivityContent(queryClient, EActivityStatus.DRAFT, activityDraftId),
      invalidateGetActivityPresentation(queryClient, EActivityStatus.DRAFT, activityDraftId),
    ])
  }
}

async function deleteSubActivities () {
  const count = subActivities.length

  try {
    await withTaskLoading(() => deleteSubActivitiesOneByOne(subActivities))
    addSuccessMessage(t('staff.activities.views.EditNationalActivityView.ConfirmDeleteSubActivitiesModal.success', { count }))
    emit('deleted')
  }
  catch (error) {
    addErrorMessage({
      title: t('staff.activities.views.EditNationalActivityView.ConfirmDeleteSubActivitiesModal.error', { count }),
      description: getErrorMessage(error as BaseApiException),
    })
  }
}
</script>

<template>
  <ConfirmationModal
    :opened
    :is-loading
    data-testid="confirm-delete-sub-activities-modal"
    @close="emit('cancel')"
    @confirm="deleteSubActivities"
  >
    <div class="av-col av-gap-sm">
      <span
        class="n5"
        data-testid="confirm-delete-sub-activities-modal-title"
      >
        {{ t('staff.activities.views.EditNationalActivityView.ConfirmDeleteSubActivitiesModal.title', { count: subActivities.length }) }}
      </span>

      <ul>
        <li
          v-for="subActivity in subActivities"
          :key="subActivity.id"
          data-testid="confirm-delete-sub-activities-modal-item"
        >
          <span class="b2-regular av-text-text2">{{ subActivity.title }}</span>
        </li>
      </ul>
    </div>
  </ConfirmationModal>
</template>
