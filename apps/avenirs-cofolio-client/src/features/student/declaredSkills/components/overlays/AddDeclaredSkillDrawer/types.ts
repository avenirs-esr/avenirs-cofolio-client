import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { IdTitle } from '@avenirs-esr/shared'
import type { ESkillLevel, ESkillReferentialType } from '@avenirs-esr/shared/api/avenir-esr'
import type { AssociationSelections } from '@/features/student/associations/types/associations.types'

export interface DeclaredSkillOption extends AvAutocompleteOption, IdTitle {
  pathSegments: string[]
  type: ESkillReferentialType
}

export interface DeclaredSkillFormData {
  selectedSkills: DeclaredSkillOption[]
  level: ESkillLevel
  reflection?: string
  associationSelections?: AssociationSelections
}
