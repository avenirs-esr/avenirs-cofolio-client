<script lang="ts" setup>
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'

export interface DeleteTraceAssociatedSkillsModalProps {
  show: boolean
}

defineProps<DeleteTraceAssociatedSkillsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const dummyAssociations = [
  { id: '1', title: '(Placeholder) Skill 1' },
  { id: '2', title: '(Placeholder) Skill 2' },
  { id: '3', title: '(Placeholder) Skill 3' }
]

const dummySelectedAssociationIds = ['1', '2']

function onConfirmDelete () {
  // TODO: #1243
  emit('deleted')
}
</script>

<template>
  <DeleteAssociationsModal
    :show="show"
    :associations="dummyAssociations"
    :selected-association-ids="dummySelectedAssociationIds"
    @cancel="emit('cancel')"
    @confirm-delete="onConfirmDelete"
  >
    <div class="av-col">
      <span
        v-for="association in dummyAssociations"
        :key="association.id"
      >
        {{ association.title }}
      </span>
    </div>
  </DeleteAssociationsModal>
</template>
