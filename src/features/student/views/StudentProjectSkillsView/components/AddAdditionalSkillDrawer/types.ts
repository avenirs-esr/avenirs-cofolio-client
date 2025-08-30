import type { AdditionalSkillProgressDTOLevel } from '@/api/avenir-esr'
import type { AvAutocompleteOption } from '@/ui'

export interface AdditionalSkillOption extends AvAutocompleteOption {
  id: string
  title: string
  pathSegments: string[]
  type: string
  level: AdditionalSkillProgressDTOLevel
}

export interface AdditionalSkillFormData {
  selectedSkills: AdditionalSkillOption[]
}
