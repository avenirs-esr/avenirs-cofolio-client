<script lang="ts" setup>
import type { IdTitleList } from '@/types'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'

export interface ConfirmAssociateModalProps {
  show: boolean
  items: IdTitleList
  title: string
}

defineProps<ConfirmAssociateModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

function onConfirm () {
  emit('confirm')
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    data-testid="confirm-associate-modal"
    @close="emit('cancel')"
    @confirm="onConfirm"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="confirm-associate-modal__header"
      >
        <span class="b2-bold av-text-text1">
          {{ title }}
        </span>
      </div>
    </template>

    <ul data-testid="confirm-associate-modal__items-list">
      <li
        v-for="item in items"
        :key="item.id"
      >
        <span class="b2-light av-text-text2">
          {{ item.title }}
        </span>
      </li>
    </ul>
  </ConfirmationModal>
</template>
