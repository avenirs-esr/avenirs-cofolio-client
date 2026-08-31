<script lang="ts" setup>
import type { IdTitleList } from '@/types'
import {
  EActivityStatus,
  invalidateGetActivitiesView,
  invalidateGetActivityPresentation,
  invalidateGetDeclaredActivitiesView,
  invalidateGetDeclaredActivityDetails,
  useUnsubscribeActivitiesProgresses
} from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface UnsubscribeActivitiesConfirmModalProps {
  show: boolean
  activities: IdTitleList
}

const { activities } = defineProps<UnsubscribeActivitiesConfirmModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'unsubscribed'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateUnsubscribeActivitiesProgresses } = useUnsubscribeActivitiesProgresses()

const activitiesIds = computed(() => activities.map(activity => activity.id))

function unsubscribeActivities () {
  mutateUnsubscribeActivitiesProgresses(
    { data: activitiesIds.value },
    {
      onSuccess: async () => {
        await withTaskLoading(() => Promise.all([
          ...activitiesIds.value.map(activityId =>
            invalidateGetDeclaredActivityDetails(queryClient, activityId),
          ),
          ...activitiesIds.value.map(activityId =>
            invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, activityId),
          ),
          invalidateGetDeclaredActivitiesView(queryClient),
          invalidateGetActivitiesView(queryClient)
        ]))

        addSuccessMessage(t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.success', { count: activities.length }))
        emit('unsubscribed')
      },
      onError: (error) => {
        addErrorMessage({
          title: t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.error', { count: activities.length }),
          description: getErrorMessage(error)
        })
      }
    }
  )
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :is-loading="isLoading"
    data-testid="unsubscribe-activities-confirm-modal"
    @close="$emit('cancel')"
    @confirm="unsubscribeActivities"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="unsubscribe-activities-confirm-modal__header"
      >
        <span class="b2-bold av-text-text1">
          {{ t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.title', { count: activities.length }) }}
        </span>
      </div>
    </template>

    <span
      class="b2-regular av-text-text1"
      data-testid="unsubscribe-activities-confirm-modal__body"
    >
      {{ t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.description') }}
    </span>
    <ul
      v-if="activities.length > 1"
      data-testid="unsubscribe-activities-confirm-modal__activities-list"
    >
      <li
        v-for="activity in activities"
        :key="activity.id"
      >
        <span class="b2-light av-text-text2">{{ activity.title }}</span>
      </li>
    </ul>
  </ConfirmationModal>
</template>
