import type {
  useAdditionalSkillForm
} from '@/features/student/additionalSkills/components/overlays/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import type {
  useUpdateAdditionalSkillForm
} from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'

export type UpdateAdditionalSkillForm = ReturnType<typeof useUpdateAdditionalSkillForm>['form']
export type AdditionalSkillForm = ReturnType<typeof useAdditionalSkillForm>['form']
