import type { EAdditionalSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'

export interface AdditionalSkillOption extends AvAutocompleteOption {
  id: string
  title: string
  pathSegments: string[]
  type: EExternalSkillType
}

export interface AdditionalSkillFormData {
  selectedSkills: AdditionalSkillOption[]
  level: EAdditionalSkillLevel
}
