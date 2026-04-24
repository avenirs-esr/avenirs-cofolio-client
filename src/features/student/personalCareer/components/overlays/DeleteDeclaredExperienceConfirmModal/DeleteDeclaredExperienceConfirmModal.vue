<script setup lang="ts">
import { invalidateGetDeclaredExperienceView, useDeleteDeclaredExperiences } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperienceConfirmModalProps {
  show: boolean
  declaredExperienceIds: string[]
}

const { declaredExperienceIds } = defineProps<DeleteDeclaredExperienceConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateDeleteDeclaredExperiences, isPending } = useDeleteDeclaredExperiences()

function deleteExperiences () {
  mutateDeleteDeclaredExperiences({ data: declaredExperienceIds }, {
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetDeclaredExperienceView(queryClient))
      addSuccessMessage(t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.success', { count: declaredExperienceIds.length }))
      emit('confirm')
    },
    onError: (error) => {
      addErrorMessage({
        title: t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.error', { count: declaredExperienceIds.length }),
        description: error.message
      })
    }
  })
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.title', { count: declaredExperienceIds.length })"
    :description="t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.description')"
    :is-loading="isLoading || isPending"
    @close="emit('close')"
    @confirm="deleteExperiences"
  />
</template>
