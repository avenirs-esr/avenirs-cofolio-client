<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import {
  invalidateGetDeclaredExperience,
  invalidateGetDeclaredExperienceAssociations,
  type TraceAssociationDTO,
  useDeleteDeclaredExperienceAssociations
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import CompactCardSelector from '@/features/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperienceAssociatedTracesModalProps {
  show: boolean
  experienceId: string
  associations: TraceAssociationDTO[]
}

const { experienceId, associations } = defineProps<DeleteDeclaredExperienceAssociatedTracesModalProps>()

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

const { mutate: deleteDeclaredExperienceAssociations } = useDeleteDeclaredExperienceAssociations({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredExperienceAssociations(queryClient, experienceId),
        invalidateGetDeclaredExperience(queryClient, experienceId),
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
  deleteDeclaredExperienceAssociations({
    experienceId,
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
      :icon="ICONS.TRACES"
    />
  </DeleteAssociationsModal>
</template>
