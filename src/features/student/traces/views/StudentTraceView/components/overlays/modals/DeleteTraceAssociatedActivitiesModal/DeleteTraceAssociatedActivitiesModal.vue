<script lang="ts" setup>
import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { ICONS } from '@/features/student/global/icons'

export interface DeleteTraceAssociatedActivitiesModalProps {
  show: boolean
  traceId: string
  associations: DeclaredActivityAssociationDTO[]
}

const { associations } = defineProps<DeleteTraceAssociatedActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const selectedIds = ref<string[]>([])

const selectableElements = computed(() => associations.map(({ associationId, declaredActivity }) => ({
  id: associationId,
  title: declaredActivity.title,
})))

function onConfirmDelete () {
  // TODO: #1237
  selectedIds.value = []
  emit('deleted')
}

function onCancel () {
  selectedIds.value = []
  emit('cancel')
}
</script>

<template>
  <DeleteAssociationsModal
    :show="show"
    :associations="selectableElements"
    :selected-association-ids="selectedIds"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.ACTIVITY"
    />
  </DeleteAssociationsModal>
</template>
