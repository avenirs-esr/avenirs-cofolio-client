<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useI18n } from 'vue-i18n'

export interface DeleteAssociationsConfirmModalProps {
  show: boolean
  associations: {
    id: string
    title: string
  }[]
}

const { associations } = defineProps<DeleteAssociationsConfirmModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
</script>

<template>
  <ConfirmationModal
    :show="show"
    data-testid="$attrs"
    @close="emit('cancel')"
    @confirm="emit('confirm')"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="delete-associations-confirm-modal__header"
      >
        <span class="b2-bold av-text-text1">
          {{ t('student.global.overlays.modals.DeleteAssociationsConfirmModal.title', { count: associations.length }) }}
        </span>
      </div>
    </template>
    <ul
      v-if="associations.length > 0"
      data-testid="delete-associations-confirm-modal__associations-list"
    >
      <li
        v-for="association in associations"
        :key="association.id"
      >
        <span class="b2-light av-text-text2">{{ association.title }}</span>
      </li>
    </ul>
  </ConfirmationModal>
</template>
