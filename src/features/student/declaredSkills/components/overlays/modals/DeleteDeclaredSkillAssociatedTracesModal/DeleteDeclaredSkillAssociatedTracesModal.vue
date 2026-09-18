<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import {
  EAssociationContextType,
  invalidateGetAssociations,
  invalidateGetDeclaredSkillProgressDetails,
  type TraceAssociationDTO,
  useUnassociate
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredSkillAssociatedTracesModalProps {
  opened: boolean
  declaredSkillProgressId: string
  associations: TraceAssociationDTO[]
}

const { declaredSkillProgressId, associations } = defineProps<DeleteDeclaredSkillAssociatedTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const selectedIds = ref<string[]>([])

const selectableElements = computed(() => associations.map(({ associationId, trace }) => ({
  id: associationId,
  title: trace.title,
})))

const { mutate: mutateDeleteDeclaredSkillAssociations } = useUnassociate({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetAssociations(queryClient, EAssociationContextType.DECLARED_SKILL, declaredSkillProgressId),
        invalidateGetDeclaredSkillProgressDetails(queryClient, declaredSkillProgressId),
      ]))
      addSuccessMessage({
        timeout: 2000,
        description: t('student.global.overlays.modals.DeleteAssociationsModal.success', { count: selectedIds.value.length }),
      })
      selectedIds.value = []
      emit('deleted')
    }
  }
})

function onConfirmDelete () {
  mutateDeleteDeclaredSkillAssociations({
    contextType: EAssociationContextType.DECLARED_SKILL,
    elementId: declaredSkillProgressId,
    data: { idsToDelete: selectedIds.value }
  })
}

function onCancel () {
  selectedIds.value = []
  emit('cancel')
}
</script>

<template>
  <DeleteAssociationsModal
    :opened="opened"
    :associations="selectableElements"
    :selected-association-ids="selectedIds"
    :is-loading="isLoading"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.TRACES"
    />
  </DeleteAssociationsModal>
</template>
