<script lang="ts" setup>
import { useModal } from '@/common/composables'
import ConfirmAssociateTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/ConfirmAssociateTracesModal/ConfirmAssociateTracesModal.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesModalProps {
  show: boolean
}

const { show } = defineProps<AssociateTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()

// TODO: #1218
const dummyAssociations = [
  { id: '1', title: '(Placeholder) Trace 1' },
  { id: '2', title: '(Placeholder) Trace 2' },
  { id: '3', title: '(Placeholder) Trace 3' }
]

function onCancel () {
  emit('cancel')
}

function onConfirm () {
  hideConfirmModal()
  emit('associated')
}
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="associate-traces-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.AssociateTracesModal.title') }}
        </span>
      </div>
    </template>

    <div class="av-col av-gap-sm">
      Placeholder...
    </div>
  </AvModal>

  <ConfirmAssociateTracesModal
    :show="showConfirmModal"
    :traces="dummyAssociations"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>
