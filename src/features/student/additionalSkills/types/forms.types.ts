import type {
  useUpdateAdditionalSkillForm
} from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import type {
  useAdditionalSkillForm
} from '@/features/student/skills/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'

export type UpdateAdditionalSkillForm = ReturnType<typeof useUpdateAdditionalSkillForm>['form']
export type AdditionalSkillForm = ReturnType<typeof useAdditionalSkillForm>['form']
