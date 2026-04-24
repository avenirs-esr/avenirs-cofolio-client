<script setup lang="ts">
import { invalidateGetDeclaredPrograms, useDeleteDeclaredProgram } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredProgramConfirmModalProps {
  show: boolean
  declaredProgramIds: string[]
}

const { declaredProgramIds } = defineProps<DeleteDeclaredProgramConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
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
        description: error.message
      })
    }
  })
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.title', { count: declaredProgramIds.length })"
    :description="t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.description')"
    :is-loading="isLoading || isPending"
    @close="emit('close')"
    @confirm="deletePrograms"
  />
</template>
