<script lang="ts" setup>
import { useRemoveSelfKnowledgeCategoryMutation } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteSelfKnowledgeCategoryModalProps {
  show: boolean
  categoryTitle: string
  categoryId: string
  elementsCount: number
}

const { categoryTitle, categoryId } = defineProps<DeleteSelfKnowledgeCategoryModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const { mutate: removeSelfKnowledgeCategory } = useRemoveSelfKnowledgeCategoryMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.selfKnowledge.SelfKnowledgeMainSection.modals.deleteSelfKnowledgeCategory.success', { category: categoryTitle }))
    emit('confirm')
  },
  onError: (error) => {
    addErrorMessage(error.message)
  }
})

function onConfirm () {
  removeSelfKnowledgeCategory({ categoryId })
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    :confirm-button-icon="MDI_ICONS.CHECK_CIRCLE"
    @close="$emit('cancel')"
    @confirm="onConfirm"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="delete-self-knowledge-category-modal__header"
      >
        <span class="b2-bold av-text-text1">
          {{ t('student.selfKnowledge.SelfKnowledgeMainSection.modals.deleteSelfKnowledgeCategory.title', { category: categoryTitle }) }}
        </span>
      </div>
    </template>

    <div v-if="elementsCount > 0">
      <span
        class="b2-regular av-text-text1"
        data-testid="delete-self-knowledge-category-modal__body"
      >
        {{ t('student.selfKnowledge.SelfKnowledgeMainSection.modals.deleteSelfKnowledgeCategory.description', { count: elementsCount }) }}
      </span>
    </div>
  </AvModal>
</template>
