import type { AssociationSearchResultDeclaredExperienceDTO } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'
import { useI18n } from 'vue-i18n'

export function useDeclaredExperienceAssociation () {
  const { t } = useI18n()

  const declaredExperienceToAssociation = (declaredExperience: AssociationSearchResultDeclaredExperienceDTO): Association => ({
    id: declaredExperience.id,
    title: declaredExperience.title,
    description: declaredExperience.experienceType
      ? t(`student.personalCareer.declaredExperienceType.${declaredExperience.experienceType}`)
      : undefined,
    disabled: declaredExperience.disabled
  })

  return {
    declaredExperienceToAssociation
  }
}
