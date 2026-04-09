import type { EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
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
}
