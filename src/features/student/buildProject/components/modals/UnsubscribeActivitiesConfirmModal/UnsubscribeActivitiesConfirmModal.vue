<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useUnsubscribeActivitiesMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface UnsubscribeActivitiesConfirmModalProps {
  show: boolean
  activities: {
    id: string
    title: string
  }[]
}

const { activities } = defineProps<UnsubscribeActivitiesConfirmModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'unsubscribed'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { mutate: unsubscribeActivities } = useUnsubscribeActivitiesMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.success', { count: activities.length }))
    emit('unsubscribed')
  },
  onError: (error) => {
    addErrorMessage({
      title: t('student.buildProject.activities.overlays.UnsubscribeActivitiesConfirmModal.error', { count: activities.length }),
      description: error.message
    })
  }
})

function onConfirm () {
  unsubscribeActivities({ activitiesIds: activities.map(activity => activity.id) })
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    data-testid="unsubscribe-activities-confirm-modal"
    @close="$emit('cancel')"
    @confirm="onConfirm"
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
