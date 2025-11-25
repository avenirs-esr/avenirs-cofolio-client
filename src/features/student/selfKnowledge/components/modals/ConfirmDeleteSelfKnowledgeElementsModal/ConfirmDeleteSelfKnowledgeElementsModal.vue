<script lang="ts" setup>
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ConfirmDeleteSelfKnowledgeElementsModalProps {
  show: boolean
  categoryType: ESelfKnowledgeCategoryType
  elements: SelfKnowledgeElementViewDTO[]
}

defineProps<ConfirmDeleteSelfKnowledgeElementsModalProps>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.confirm')"
    :confirm-button-icon="MDI_ICONS.CHECK_CIRCLE"
    @close="$emit('cancel')"
    @confirm="$emit('confirm')"
  >
    <template #header>
      <span class="b2-bold">
        {{ t(`student.views.studentProjectTrajectoriesView.selfKnowledge.categoryElementsPaginator.modals.confirmDeleteElements.title.${categoryType.toLowerCase()}`,
             { count: elements.length }) }}
      </span>
    </template>

    <ul>
      <li
        v-for="element in elements"
        :key="element.id"
      >
        <span class="b2-light">{{ element.title }}</span>
      </li>
    </ul>
  </AvModal>
</template>

<style lang="scss" scoped>
.b2-regular {
  color: var(--text1);
}

.b2-light {
  color: var(--text2);
}
</style>
