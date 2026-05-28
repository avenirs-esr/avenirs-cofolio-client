<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { IdTitleList } from '@/types'
import { invalidateGetDeclaredActivityAssociations, useDeleteDeclaredActivityAssociations } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteActivityAssociatedTracesModalProps {
  show: boolean
  declaredActivityId: string
  associations: IdTitleList
}

const { declaredActivityId, associations } = defineProps<DeleteActivityAssociatedTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const selectedIds = ref<string[]>([])

const { mutate: mutateDeleteDeclaredActivityAssociations, isPending } = useDeleteDeclaredActivityAssociations()

function deleteDeclaredActivityAssociations () {
  mutateDeleteDeclaredActivityAssociations({
    declaredActivityId,
    data: {
      idsToDelete: selectedIds.value
    }
  }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetDeclaredActivityAssociations(queryClient, declaredActivityId))
      addSuccessMessage({
        timeout: 2000,
        description: t('student.buildProject.activities.views.ProjectActivityDetailedView.DeleteActivityAssociatedTracesModal.success'),
      })
      selectedIds.value = []
      emit('deleted')
    },
  })
}

const selectableElements = associations.map(association => ({
  id: association.id,
  title: association.title,
}))

function onCancel () {
  selectedIds.value = []
  emit('cancel')
}
</script>

<template>
  <DeleteAssociationsModal
    :show="show"
    :associations="associations"
    :selected-association-ids="selectedIds"
    :is-loading="isPending || isLoading"
    @cancel="onCancel"
    @confirm-delete="deleteDeclaredActivityAssociations"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.TRACES"
    />
  </DeleteAssociationsModal>
</template>
