import type { EAdditionalSkillLevel, EAdditionalSkillType } from '@/api/avenir-esr'
import type { AvAutocompleteOption } from '@/ui'

export interface AdditionalSkillOption extends AvAutocompleteOption {
  id: string
  title: string
  pathSegments: string[]
  type: EAdditionalSkillType
}

export interface AdditionalSkillFormData {
  selectedSkills: AdditionalSkillOption[]
  level: EAdditionalSkillLevel
}
