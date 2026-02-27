<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useI18n } from 'vue-i18n'

export interface CancelSubscribeActivityConfirmModalProps {
  show: boolean
}

defineProps<CancelSubscribeActivityConfirmModalProps>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
</script>

<template>
  <ConfirmationModal
    :show="show"
    data-testid="cancel-subscribe-activity-confirm-modal"
    @close="$emit('cancel')"
    @confirm="$emit('confirm')"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="cancel-subscribe-activity-confirm-modal__header"
      >
        <span
          class="b2-bold av-text-text1"
          data-testid="cancel-subscribe-activity-confirm-modal__title"
        >
          {{ t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.CancelSubscribeActivityModal.title') }}
        </span>
      </div>
    </template>

    <div />
  </ConfirmationModal>
</template>
