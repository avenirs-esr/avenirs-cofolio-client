<script lang="ts" setup>
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteSelfKnowledgeCategoryModalProps {
  show: boolean
  categoryTitle: string
  elementsCount: number
}

defineProps<DeleteSelfKnowledgeCategoryModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()

function onConfirm () {
  // TODO: implement this when backend is ready
  emit('confirm')
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
      <div class="delete-self-knowledge-category-modal__header">
        <span class="b2-bold">
          {{ t('student.views.studentProjectTrajectoriesView.selfKnowledge.modals.deleteSelfKnowledgeCategory.title', { category: categoryTitle }) }}
        </span>
      </div>
    </template>

    <div
      v-if="elementsCount > 0"
      class="delete-self-knowledge-category-modal__body"
    >
      {{ t('student.views.studentProjectTrajectoriesView.selfKnowledge.modals.deleteSelfKnowledgeCategory.description', { count: elementsCount }) }}
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.delete-self-knowledge-category-modal {
  &__header {
    display: flex;
    flex: 1;
  }
}

.b2-bold,
.b2-regular {
  color: var(--text1);
}
</style>
