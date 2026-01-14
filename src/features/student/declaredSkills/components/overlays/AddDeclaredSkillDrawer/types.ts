import type { EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredSkillOption extends AvAutocompleteOption {
  id: string
  title: string
  pathSegments: string[]
  type: EExternalSkillType
}

export interface DeclaredSkillFormData {
  selectedSkills: DeclaredSkillOption[]
  level: EDeclaredSkillLevel
}
