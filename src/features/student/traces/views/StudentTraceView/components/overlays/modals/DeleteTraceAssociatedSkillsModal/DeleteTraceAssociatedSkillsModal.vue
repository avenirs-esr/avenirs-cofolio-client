<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import { type DeclaredSkillAssociationDTO, invalidateGetTraceAssociations, invalidateGetTraceDetail, useDeleteTraceAssociations } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteTraceAssociatedSkillsModalProps {
  show: boolean
  traceId: string
  associations: DeclaredSkillAssociationDTO[]
}

const { traceId, associations } = defineProps<DeleteTraceAssociatedSkillsModalProps>()

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

const selectableElements = computed(() => associations.map(({ associationId, declaredSkill }) => ({
  id: associationId,
  title: declaredSkill.title,
})))

const { mutate: deleteTraceAssociations } = useDeleteTraceAssociations({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetTraceDetail(queryClient, traceId),
        invalidateGetTraceAssociations(queryClient, traceId),
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
  deleteTraceAssociations({
    traceId,
    data: selectedIds.value
  })
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
    :is-loading="isLoading"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.SKILLS"
      background-color="var(--dark-background-primary1)"
      color="var(--card)"
      checkbox-color="var(--card)"
    />
  </DeleteAssociationsModal>
</template>
