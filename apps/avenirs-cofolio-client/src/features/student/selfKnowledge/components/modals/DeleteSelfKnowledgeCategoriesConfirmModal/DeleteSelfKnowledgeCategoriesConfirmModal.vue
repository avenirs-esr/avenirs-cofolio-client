<script lang="ts" setup>
import type { ESelfKnowledgeCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import { invalidateGetSelfKnowledgeCategories, useRemoveSelfKnowledgeCategories } from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useToasterStore } from '@/store'

export interface DeleteSelfKnowledgeCategoriesConfirmModalProps {
  opened: boolean
  categories: { title: string, type: ESelfKnowledgeCategory }[]
}

const { categories } = defineProps<DeleteSelfKnowledgeCategoriesConfirmModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const categoryTypes = computed(() => categories.map(category => category.type))
const categoryTitles = computed(() => categories.map(category => category.title))

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateRemoveSelfKnowledgeCategories, isPending } = useRemoveSelfKnowledgeCategories()

function removeSelfKnowledgeCategories () {
  mutateRemoveSelfKnowledgeCategories({ data: categoryTypes.value }, {
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetSelfKnowledgeCategories(queryClient))
      addSuccessMessage(t('student.selfKnowledge.SelfKnowledgeMainSection.modals.DeleteSelfKnowledgeCategoriesConfirmModal.success', { category: categoryTitles.value.join(', '), count: categories.length }))
      emit('deleted')
    },
    onError: (error) => {
      addErrorMessage(getErrorMessage(error))
    }
  })
}
</script>

<template>
  <AvModal
    :opened="opened"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    :confirm-button-icon="MDI_ICONS.CHECK_CIRCLE"
    :is-loading="isPending || isLoading"
    @close="$emit('cancel')"
    @confirm="removeSelfKnowledgeCategories"
  >
    <template #header>
      <div
        class="av-col"
        data-testid="delete-sf-categories-confirm-modal-title"
      >
        <div class="av-row av-flex-fill">
          <span class="b2-bold av-text-text1">
            {{ t('student.selfKnowledge.SelfKnowledgeMainSection.modals.DeleteSelfKnowledgeCategoriesConfirmModal.title', { count: categories.length }) }}
          </span>
        </div>

        <ul>
          <li
            v-for="title in categoryTitles"
            :key="title"
            data-testid="delete-sf-categories-confirm-modal-category"
          >
            <span class="b2-bold av-text-text1">{{ title }}</span>
          </li>
        </ul>
      </div>
    </template>

    <span
      class="b2-regular av-text-text1"
      data-testid="delete-sf-categories-confirm-modal-description"
    >
      {{ t('student.selfKnowledge.SelfKnowledgeMainSection.modals.DeleteSelfKnowledgeCategoriesConfirmModal.description', { count: categories.length }) }}
    </span>
  </AvModal>
</template>
