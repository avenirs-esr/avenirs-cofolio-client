import type { AssociationSearchResultDeclaredSkillIDTO } from '@/api/avenir-esr'
import type { Association } from '@/features/global/types/associations.types'
import { useI18n } from 'vue-i18n'

export function useDeclaredSkillAssociation () {
  const { t } = useI18n()

  const declaredSkillToAssociation = (declaredSkill: AssociationSearchResultDeclaredSkillIDTO): Association => ({
    id: declaredSkill.id,
    title: declaredSkill.title,
    disabled: declaredSkill.disabled,
    description: declaredSkill.type
      ? t(`student.declaredSkills.declaredSkillTypes.${declaredSkill.type}`)
      : undefined
  })

  return {
    declaredSkillToAssociation
  }
}
