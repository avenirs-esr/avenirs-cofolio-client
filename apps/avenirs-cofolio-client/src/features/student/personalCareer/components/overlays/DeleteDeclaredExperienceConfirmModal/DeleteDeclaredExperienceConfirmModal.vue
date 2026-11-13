<script setup lang="ts">
import { ConfirmationModal, useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import { invalidateGetDeclaredExperienceView, useDeleteDeclaredExperiences } from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useToasterStore } from '@/store'

export interface DeleteDeclaredExperienceConfirmModalProps {
  opened: boolean
  declaredExperienceIds: string[]
}

const { declaredExperienceIds } = defineProps<DeleteDeclaredExperienceConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
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
        description: getErrorMessage(error)
      })
    }
  })
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.title', { count: declaredExperienceIds.length })"
    :description="t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.description')"
    :is-loading="isLoading || isPending"
    @close="emit('close')"
    @confirm="deleteExperiences"
  />
</template>
