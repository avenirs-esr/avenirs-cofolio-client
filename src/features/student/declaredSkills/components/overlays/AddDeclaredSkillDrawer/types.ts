import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { ESkillLevel, ESkillReferentialType } from '@/api/avenir-esr'
import type { AssociationSelections } from '@/features/student/associations/types/associations.types'
import type { IdTitle } from '@/types'

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
