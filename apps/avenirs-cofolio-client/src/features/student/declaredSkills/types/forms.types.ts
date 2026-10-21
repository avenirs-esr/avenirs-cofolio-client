import type {
  useDeclaredSkillForm
} from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/use-declared-skill-form/use-declared-skill-form'
import type {
  useUpdateDeclaredSkillForm
} from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'

export type UpdateDeclaredSkillForm = ReturnType<typeof useUpdateDeclaredSkillForm>['form']
export type DeclaredSkillForm = ReturnType<typeof useDeclaredSkillForm>['form']
