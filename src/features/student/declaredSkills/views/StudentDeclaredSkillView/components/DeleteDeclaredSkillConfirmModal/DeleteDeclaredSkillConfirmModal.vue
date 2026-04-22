<script setup lang="ts">
import { invalidateGetDeclaredSkillsProgresses, useDeleteDeclaredSkillProgress } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredSkillConfirmModalProps {
  show: boolean
  skillId: string
  skillTitle: string
}

const { skillTitle, skillId } = defineProps<DeleteDeclaredSkillConfirmModalProps>()

const emit = defineEmits<{
  (e: 'skillDeleted'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { mutate: mutateDeleteDeclaredSkillProgress } = useDeleteDeclaredSkillProgress()

function deleteDeclaredSkill () {
  mutateDeleteDeclaredSkillProgress({ declaredSkillProgressId: skillId }, {
    onSuccess: async () => {
      addSuccessMessage(t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.success', { skill: skillTitle }))
      emit('skillDeleted')
      await invalidateGetDeclaredSkillsProgresses(queryClient)
    },
    onError: (error) => {
      addErrorMessage({
        title: t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.error', { skill: skillTitle }),
        description: error.message
      })
    }
  })
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.title', { skill: skillTitle })"
    :description="t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.description')"
    @close="emit('close')"
    @confirm="deleteDeclaredSkill"
  />
</template>

<style lang="scss" scoped>

</style>
