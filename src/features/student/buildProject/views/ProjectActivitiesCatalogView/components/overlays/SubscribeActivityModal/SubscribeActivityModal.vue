<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import ActivityPeriodFormField
  from '@/features/student/buildProject/components/interactions/formFields/ActivityPeriodFormField/ActivityPeriodFormField.vue'
import CancelSubscribeActivityConfirmModal from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/CancelSubscribeActivityConfirmModal/CancelSubscribeActivityConfirmModal.vue'
import { useSubscribeActivityForm } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/use-subscribe-activity-form/use-subscribe-activity-form'
import { startOfToday } from 'date-fns'
import { useI18n } from 'vue-i18n'

export interface SubscribeActivityModalProps {
  show: boolean
  activity: {
    id: string
    title: string
  }
}

const { activity } = defineProps<SubscribeActivityModalProps>()

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

const todayDate = startOfToday()

const { form, isFormValid, isFormDirty } = useSubscribeActivityForm(activity, () => emit('subscribed'))

function onConfirmCancelSubscribe () {
  hideCancelSubscribeConfirmModal()
  form.reset()
  setTimeout(() => {
    emit('cancel')
  }, 10)
}

function onCancelSubscribeModal () {
  if (isFormDirty.value) {
    displayCancelSubscribeConfirmModal()
  }
  else {
    emit('cancel')
  }
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :confirm-button-disabled="!isFormValid"
    data-testid="subscribe-activity-modal"
    @close="onCancelSubscribeModal"
    @confirm="form.handleSubmit"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="subscribe-activity-modal__header"
      >
        <span
          class="b2-bold av-text-text1"
          data-testid="subscribe-activity-modal__title"
        >
          {{ t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.title', { title: activity.title }) }}
        </span>
      </div>
    </template>

    <ActivityPeriodFormField
      data-testid="subscribe-activity-modal__period-input"
      :form="form"
      :start-min-date="todayDate"
    />

    <CancelSubscribeActivityConfirmModal
      :show="showCancelSubscribeConfirmModal"
      @cancel="hideCancelSubscribeConfirmModal"
      @confirm="onConfirmCancelSubscribe"
    />
  </ConfirmationModal>
</template>
