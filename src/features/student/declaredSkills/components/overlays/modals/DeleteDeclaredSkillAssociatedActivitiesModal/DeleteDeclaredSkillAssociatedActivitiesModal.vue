<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import { type DeclaredActivityAssociationDTO, invalidateGetDeclaredSkillProgressDetails, invalidateGetDeclaredSkillWithDeclaredActivities, useDeleteDeclaredSkillAssociations } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import { isDeletableDeclaredActivityAssociation } from '@/features/student/declaredSkills/rules/declared-activity-association.rules'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredSkillAssociatedActivitiesModalProps {
  show: boolean
  declaredSkillProgressId: string
  associations: DeclaredActivityAssociationDTO[]
}

const { declaredSkillProgressId, associations } = defineProps<DeleteDeclaredSkillAssociatedActivitiesModalProps>()

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

const selectableElements = computed(() => associations.filter(isDeletableDeclaredActivityAssociation).map(({ associationId, declaredActivity }) => ({
  id: associationId,
  title: declaredActivity.title,
})))

const { mutate: deleteDeclaredSkillAssociations } = useDeleteDeclaredSkillAssociations({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredSkillWithDeclaredActivities(queryClient, declaredSkillProgressId),
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
  deleteDeclaredSkillAssociations({
    declaredSkillProgressId,
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
      :icon="ICONS.ACTIVITY"
    />
  </DeleteAssociationsModal>
</template>
