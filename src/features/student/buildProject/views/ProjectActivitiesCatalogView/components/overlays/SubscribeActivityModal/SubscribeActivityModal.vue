<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { useSubscribeActivityMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import CancelSubscribeActivityConfirmModal from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/CancelSubscribeActivityConfirmModal/CancelSubscribeActivityConfirmModal.vue'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface SubscribeActivityModalProps {
  show: boolean
  activity: {
    id: string
    title: string
  }
}

defineProps<SubscribeActivityModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'subscribed'): void
}>()

const { t } = useI18n()
const {
  showModal: showCancelSubscribeConfirmModal,
  displayModal: displayCancelSubscribeConfirmModal,
  hideModal: hideCancelSubscribeConfirmModal
} = useModal()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const { mutate: subscribe } = useSubscribeActivityMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.success'))
    emit('subscribed')
  },
  onError: (error) => {
    addErrorMessage({
      title: t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.error'),
      description: error.message
    })
  }
})

function onConfirmCancelSubscribe () {
  hideCancelSubscribeConfirmModal()

  setTimeout(() => {
    emit('cancel')
  }, 10)
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    @close="displayCancelSubscribeConfirmModal"
    @confirm="subscribe({ activityId: activity.id })"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="subscribe-activity-modal__header"
      >
        <span class="b2-bold av-text-text1">
          {{ t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.title', { title: activity.title }) }}
        </span>
      </div>
    </template>

    <CancelSubscribeActivityConfirmModal
      :show="showCancelSubscribeConfirmModal"
      @cancel="hideCancelSubscribeConfirmModal"
      @confirm="onConfirmCancelSubscribe"
    />
  </ConfirmationModal>
</template>
