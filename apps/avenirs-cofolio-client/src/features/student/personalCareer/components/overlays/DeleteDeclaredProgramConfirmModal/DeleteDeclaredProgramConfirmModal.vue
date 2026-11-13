<script setup lang="ts">
import { ConfirmationModal, useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import { invalidateGetDeclaredPrograms, useDeleteDeclaredProgram } from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useToasterStore } from '@/store'

export interface DeleteDeclaredProgramConfirmModalProps {
  opened: boolean
  declaredProgramIds: string[]
}

const { declaredProgramIds } = defineProps<DeleteDeclaredProgramConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateDeleteDeclaredProgram, isPending } = useDeleteDeclaredProgram()

function deletePrograms () {
  mutateDeleteDeclaredProgram({ data: declaredProgramIds }, {
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetDeclaredPrograms(queryClient))
      addSuccessMessage(t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.success', { count: declaredProgramIds.length }))
      emit('confirm')
    },
    onError: (error) => {
      addErrorMessage({
        title: t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.error', { count: declaredProgramIds.length }),
        description: getErrorMessage(error)
      })
    }
  })
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.title', { count: declaredProgramIds.length })"
    :description="t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.description')"
    :is-loading="isLoading || isPending"
    @close="emit('close')"
    @confirm="deletePrograms"
  />
</template>
