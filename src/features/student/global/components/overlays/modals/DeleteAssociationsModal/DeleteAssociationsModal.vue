<script lang="ts" setup>
import type { Slot } from 'vue'
import { useModal } from '@/common/composables'
import DeleteAssociationsConfirmModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsConfirmModal/DeleteAssociationsConfirmModal.vue'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteAssociationsModalProps {
  show: boolean
  associations: {
    id: string
    title: string
  }[]
  selectedAssociationIds: string[]
  isLoading?: boolean
}

defineProps<DeleteAssociationsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirmDelete'): void
}>()

defineSlots<{
  /**
   * You should pass a custom SelectorOverlay and use its `v-model:selected-elements` to bind the selectedAssociationIds.
   */
  default: Slot
}>()

const { t } = useI18n()
const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()

function onConfirm () {
  hideConfirmModal()

  setTimeout(() => {
    emit('confirmDelete')
  }, 10)
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.global.overlays.modals.DeleteAssociationsModal.confirmButton',
                             { count: selectedAssociationIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedAssociationIds.length === 0"
    :is-loading="isLoading"
    @close="$emit('cancel')"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center av-flex-fill"
        data-testid="delete-associations-modal-header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.global.overlays.modals.DeleteAssociationsModal.title', { count: associations.length }) }}
        </span>
      </div>
    </template>

    <slot />
  </AvModal>

  <DeleteAssociationsConfirmModal
    :show="showConfirmModal"
    :associations="associations.filter(association => selectedAssociationIds.includes(association.id))"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>
