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

const tracesItems = computed(() => items.filter(item => item.contextType === EAssociationContextType.TRACE))
const activitiesItems = computed(() => items.filter(item => item.contextType === EAssociationContextType.DECLARED_ACTIVITY))
const skillsItems = computed(() => items.filter(item => item.contextType === EAssociationContextType.DECLARED_SKILL))
const experiencesItems = computed(() => items.filter(item => item.contextType === EAssociationContextType.DECLARED_EXPERIENCE))
const programItems = computed(() => items.filter(item => item.contextType === EAssociationContextType.DECLARED_PROGRAM))

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
      <PendingItemsList :items="tracesItems" />
      <PendingItemsList :items="activitiesItems" />
      <PendingItemsList :items="skillsItems" />
      <PendingItemsList :items="experiencesItems" />
      <PendingItemsList :items="programItems" />
    </div>
  </ConfirmationModal>
</template>

<style lang="scss" scoped>
.pending-items {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
