<script lang="ts" setup>
import { useModal } from '@/common/composables'
import ConfirmAssociateModal from '@/features/student/global/components/overlays/modals/ConfirmAssociateModal/ConfirmAssociateModal.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredSkillsModalProps {
  show: boolean
}

defineProps<AssociateDeclaredSkillsModalProps>()

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
    data-testid="associate-declared-skills-modal"
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
          {{ t('student.traces.views.StudentTraceView.AssociateDeclaredSkillsModal.title') }}
        </span>
      </div>
    </template>
  </AvModal>

  <!-- TODO: #1316 - items param and title plural replace 0 by items length -->
  <ConfirmAssociateModal
    :show="showConfirmModal"
    :items="[]"
    :title="t('student.traces.views.StudentTraceView.AssociateDeclaredSkillsModal.confirmTitle', 0)"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>
