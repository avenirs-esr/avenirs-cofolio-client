<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import ConfirmDeleteSelfKnowledgeElementsModal from '@/features/student/selfKnowledge/components/modals/ConfirmDeleteSelfKnowledgeElementsModal/ConfirmDeleteSelfKnowledgeElementsModal.vue'
import SelfKnowledgeElementsSelector from '@/features/student/selfKnowledge/components/pickers/SelfKnowledgeElementsSelector/SelfKnowledgeElementsSelector.vue'
import { useDeleteSelfKnowledgeElementsMutation } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
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
const { addErrorMessage, addSuccessMessage } = useToasterStore()

function onDeleteSuccess (deletedCount: number) {
  addSuccessMessage(
    t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.success', { count: deletedCount })
  )
  hideConfirmModal()
  emit('confirm')
  resetSelectedElements()
}

const { mutate: deleteSelfKnowledgeElements } = useDeleteSelfKnowledgeElementsMutation({
  onSuccess: (_data, variables) => onDeleteSuccess(variables.selfKnowledgeElementIds.length),
  onError: error => addErrorMessage({
    title: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.error'),
    description: error.message
  })

})

const selectedElementIds = ref<string[]>([])

function resetSelectedElements () {
  selectedElementIds.value = []
}

function onCancel () {
  resetSelectedElements()
  emit('cancel')
}

function onConfirmDelete () {
  deleteSelfKnowledgeElements({ selfKnowledgeElementIds: selectedElementIds.value })
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.confirmButton',
                             { count: selectedElementIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedElementIds.length === 0"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.title',
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
    :elements="elements.filter(element => selectedElementIds.includes(element.id))"
    @cancel="hideConfirmModal"
    @confirm="onConfirmDelete"
  />
</template>
