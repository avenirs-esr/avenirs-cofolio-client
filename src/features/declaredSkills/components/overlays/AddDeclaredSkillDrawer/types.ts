import type { EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import type { Association } from '@/features/global/types/associations.types'
import type { IdTitle } from '@/types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredSkillOption extends AvAutocompleteOption, IdTitle {
  pathSegments: string[]
  type: EExternalSkillType
}

export interface DeclaredSkillFormData {
  selectedSkills: DeclaredSkillOption[]
  level: EDeclaredSkillLevel
  reflection?: string
  associationSelections?: Record<string, Association[]>
}
