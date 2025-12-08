<script lang="ts" setup>
import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useI18n } from 'vue-i18n'

export interface ConfirmDeleteSelfKnowledgeElementsModalProps {
  show: boolean
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
  <ConfirmationModal
    :show="show"
    @close="$emit('cancel')"
    @confirm="$emit('confirm')"
  >
    <template #header>
      <span class="b2-bold">
        {{ t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.confirmDeleteElements.title',
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
  </ConfirmationModal>
</template>

<style lang="scss" scoped>
.b2-regular {
  color: var(--text1);
}

.b2-light {
  color: var(--text2);
}
</style>
