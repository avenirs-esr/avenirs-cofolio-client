<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useDeleteDeclaredSkillMutation } from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredSkillConfirmModalProps {
  show: boolean
  skillId: string
  skillTitle: string
}

const { skillTitle } = defineProps<DeleteDeclaredSkillConfirmModalProps>()

const emit = defineEmits<{
  (e: 'skillDeleted'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { mutate: deleteDeclaredSkill } = useDeleteDeclaredSkillMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.success', { skill: skillTitle }))
    emit('skillDeleted')
  },
  onError: (error) => {
    addErrorMessage({
      title: t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.error', { skill: skillTitle }),
      description: error.message
    })
  }
})
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.title', { skill: skillTitle })"
    :description="t('student.declaredSkills.views.StudentDeclaredSkillView.deleteModal.description')"
    @close="emit('close')"
    @confirm="deleteDeclaredSkill({ declaredSkillProgressId: skillId })"
  />
</template>

<style lang="scss" scoped>

</style>
