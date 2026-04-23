<script lang="ts" setup>
import type { IdTitleList } from '@/types'
import { invalidateGetActivitiesView, invalidateGetActivityDetail, invalidateGetDeclaredActivitiesView, invalidateGetDeclaredActivityDetails, useUnsubscribeActivitiesProgresses } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
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
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()

const { mutate: mutateUnsubscribeActivitiesProgresses } = useUnsubscribeActivitiesProgresses()

const activitiesIds = computed(() => activities.map(activity => activity.id))

function unsubscribeActivities () {
  mutateUnsubscribeActivitiesProgresses(
    { data: activitiesIds.value },
    {
      onSuccess: async () => {
        await Promise.all(
          activitiesIds.value.map(activityId => invalidateGetDeclaredActivityDetails(queryClient, activityId)),
        )
        await Promise.all(
          activitiesIds.value.map(activityId => invalidateGetActivityDetail(queryClient, activityId)),
        )
        await invalidateGetDeclaredActivitiesView(queryClient)
        await invalidateGetActivitiesView(queryClient)

        addSuccessMessage(t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.success', { count: activities.length }))
        emit('unsubscribed')
      },
      onError: (error) => {
        addErrorMessage({
          title: t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.error', { count: activities.length }),
          description: error.message
        })
      }
    }
  )
}
</script>

<template>
  <ConfirmationModal
    :show="show"
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
