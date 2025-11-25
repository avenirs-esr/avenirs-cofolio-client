<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import ConfirmDeleteSelfKnowledgeElementsModal from '@/features/student/selfKnowledge/components/modals/ConfirmDeleteSelfKnowledgeElementsModal/ConfirmDeleteSelfKnowledgeElementsModal.vue'
import SelfKnowledgeElementsSelector from '@/features/student/selfKnowledge/components/pickers/SelfKnowledgeElementsSelector/SelfKnowledgeElementsSelector.vue'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteSelfKnowledgeElementsModalProps {
  show: boolean
  categoryType: ESelfKnowledgeCategoryType
  elements: SelfKnowledgeElementViewDTO[]
}

defineProps<DeleteSelfKnowledgeElementsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()

const selectedElementIds = ref<string[]>([])

function resetSelectedElements () {
  selectedElementIds.value = []
}

function onCancel () {
  resetSelectedElements()
  emit('cancel')
}

function onConfirm () {
  displayConfirmModal()
}

function onCancelDelete () {
  hideConfirmModal()
}

function onConfirmDelete () {
  hideConfirmModal()
  emit('confirm')
  resetSelectedElements()
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t(`student.views.studentProjectTrajectoriesView.selfKnowledge.categoryElementsPaginator.modals.deleteElements.confirmButton.${categoryType.toLowerCase()}`,
                             { count: selectedElementIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedElementIds.length === 0"
    @close="onCancel"
    @confirm="onConfirm"
  >
    <template #header>
      <div class="header av-row av-row--center">
        <span class="b2-regular">
          {{ t(`student.views.studentProjectTrajectoriesView.selfKnowledge.categoryElementsPaginator.modals.deleteElements.title.${categoryType.toLowerCase()}`,
               { count: elements.length }) }}
        </span>
      </div>
    </template>

    <SelfKnowledgeElementsSelector
      v-if="elements.length > 0"
      v-model="selectedElementIds"
      :elements="elements"
      :category-type="categoryType"
    />
  </AvModal>

  <ConfirmDeleteSelfKnowledgeElementsModal
    :show="showConfirmModal"
    :category-type="categoryType"
    :elements="elements.filter(element => selectedElementIds.includes(element.id))"
    @cancel="onCancelDelete"
    @confirm="onConfirmDelete"
  />
</template>

<style lang="scss" scoped>
.header {
  .b2-regular {
    color: var(--text1);
  }
}
</style>
