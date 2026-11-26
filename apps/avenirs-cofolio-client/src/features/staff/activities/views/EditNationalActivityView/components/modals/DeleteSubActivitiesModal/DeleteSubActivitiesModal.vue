<script lang="ts" setup>
import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { CompactCardSelector, ConfirmationModal, ICONS, useModal } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import ConfirmDeleteSubActivitiesModal from '@/features/staff/activities/views/EditNationalActivityView/components/modals/ConfirmDeleteSubActivitiesModal/ConfirmDeleteSubActivitiesModal.vue'

export interface DeleteSubActivitiesModalProps {
  opened: boolean
  activityDraftId: string
  subActivities: SubActivityOverviewDTO[]
}

const {
  opened,
  activityDraftId,
  subActivities,
} = defineProps<DeleteSubActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const {
  modalOpened: confirmModalOpened,
  openModal: openConfirmModal,
  closeModal: closeConfirmModal,
} = useModal()

const selectedSubActivityIds = ref<string[]>([])

const selectedSubActivities = computed(() => subActivities.filter(({ id }) => selectedSubActivityIds.value.includes(id)))

function resetSelectedSubActivities () {
  selectedSubActivityIds.value = []
}

function onCancel () {
  resetSelectedSubActivities()
  emit('cancel')
}

function onDeleted () {
  closeConfirmModal()
  resetSelectedSubActivities()
  emit('deleted')
}
</script>

<template>
  <ConfirmationModal
    :opened
    :confirm-button-label="t('staff.activities.views.EditNationalActivityView.DeleteSubActivitiesModal.confirmButton', { count: selectedSubActivities.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedSubActivities.length === 0"
    :confirm-button-disabled-tooltip="t('staff.activities.views.EditNationalActivityView.DeleteSubActivitiesModal.confirmButtonDisabledTooltip')"
    data-testid="delete-sub-activities-modal"
    @close="onCancel"
    @confirm="openConfirmModal"
  >
    <template #header>
      <div class="av-row av-justify-center av-flex-fill">
        <span
          class="b2-regular av-text-text1"
          data-testid="delete-sub-activities-modal-title"
        >
          {{ t('staff.activities.views.EditNationalActivityView.DeleteSubActivitiesModal.title', { count: subActivities.length }) }}
        </span>
      </div>
    </template>

    <CompactCardSelector
      v-model="selectedSubActivityIds"
      :elements="subActivities"
      :icon="ICONS.ACTIVITY"
      color="var(--text1)"
      icon-color="var(--icon)"
      background-color="var(--surface-background)"
      checkbox-color="var(--dark-background-primary1)"
      overlay-color="var(--dark-background-primary1)"
      :overlay-opacity="0.25"
    />
  </ConfirmationModal>

  <ConfirmDeleteSubActivitiesModal
    :opened="confirmModalOpened"
    :activity-draft-id="activityDraftId"
    :sub-activities="selectedSubActivities"
    @cancel="closeConfirmModal"
    @deleted="onDeleted"
  />
</template>
