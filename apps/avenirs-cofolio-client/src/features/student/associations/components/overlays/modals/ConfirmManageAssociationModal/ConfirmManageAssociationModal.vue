<script lang="ts" setup>
import type { Association } from '@/features/student/associations/types/associations.types'
import { ConfirmationModal } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import PendingItemsList from '@/features/student/associations/components/overlays/modals/ConfirmManageAssociationModal/PendingItemsList.vue'

export interface ConfirmAssociateModalProps {
  opened: boolean
  items: Association[]
  title: string
}

const { items } = defineProps<ConfirmAssociateModalProps>()

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
    :opened="opened"
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

    <div class="av-col av-gap-sm pending-items">
      <template
        v-for="contextType in Object.values(EAssociationContextType)"
        :key="contextType"
      >
        <PendingItemsList :items="items.filter(item => item.contextType === contextType)" />
      </template>
    </div>
  </ConfirmationModal>
</template>

<style lang="scss" scoped>
.pending-items {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
