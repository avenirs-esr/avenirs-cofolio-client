<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import { type DeclaredActivityAssociationDTO, invalidateGetTraceAssociations, invalidateGetTraceDetail, useDeleteTraceAssociations } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import DeleteActivitiesSelector from '@/features/student/global/components/cards/DeleteActivitiesSelector/DeleteActivitiesSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteTraceAssociatedActivitiesModalProps {
  show: boolean
  traceId: string
  associations: DeclaredActivityAssociationDTO[]
}

const { traceId, associations } = defineProps<DeleteTraceAssociatedActivitiesModalProps>()

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
    :associations="associations.map(({ associationId, declaredActivity }) => ({ id: associationId, title: declaredActivity.title }))"
    :selected-association-ids="selectedIds"
    :is-loading="isLoading"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <DeleteActivitiesSelector
      v-model="selectedIds"
      :associations="associations"
    />
  </DeleteAssociationsModal>
</template>
