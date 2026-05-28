<script lang="ts" setup>
import { invalidateGetSelfKnowledgeCategories, useRemoveSelfKnowledgeCategory } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
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
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateRemoveSelfKnowledgeCategory, isPending } = useRemoveSelfKnowledgeCategory()

function removeSelfKnowledgeCategory () {
  mutateRemoveSelfKnowledgeCategory({ categoryId }, {
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetSelfKnowledgeCategories(queryClient))
      addSuccessMessage(t('student.selfKnowledge.SelfKnowledgeMainSection.modals.deleteSelfKnowledgeCategory.success', { category: categoryTitle }))
      emit('confirm')
    },
    onError: (error) => {
      addErrorMessage(getErrorMessage(error))
    }
  })
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    :confirm-button-icon="MDI_ICONS.CHECK_CIRCLE"
    :is-loading="isPending || isLoading"
    @close="$emit('cancel')"
    @confirm="removeSelfKnowledgeCategory"
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
